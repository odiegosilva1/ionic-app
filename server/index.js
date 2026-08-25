const express = require('express');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { v4: uuidv4 } = require('uuid');
const https = require('https');
const fs = require('fs');
const path = require('path');

const app = express();
const JWT_SECRET = process.env.JWT_SECRET || 'petshop-jwt-secret-key-2024';
const JWT_EXPIRES_IN = '24h';
const PORT = process.env.PORT || 3000;

const DB_FILE = path.join(__dirname, 'db.json');

function loadDB() {
  try {
    if (fs.existsSync(DB_FILE)) {
      return JSON.parse(fs.readFileSync(DB_FILE, 'utf-8'));
    }
  } catch {}
  return { usuarios: [] };
}

function saveDB(db) {
  fs.writeFileSync(DB_FILE, JSON.stringify(db, null, 2));
}

app.use(cors());
app.use(express.json());

function authMiddleware(req, res, next) {
  const header = req.headers.authorization;
  if (!header || !header.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Token não fornecido' });
  }
  try {
    const token = header.split(' ')[1];
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch {
    return res.status(401).json({ message: 'Token inválido ou expirado' });
  }
}

app.post('/api/auth/register', async (req, res) => {
  try {
    const { nome, email, senha } = req.body;

    if (!nome || !email || !senha) {
      return res.status(400).json({ message: 'Preencha todos os campos' });
    }

    const db = loadDB();

    if (db.usuarios.some((u) => u.email.toLowerCase() === email.toLowerCase())) {
      return res.status(409).json({ message: 'Email já cadastrado' });
    }

    const hashedSenha = await bcrypt.hash(senha, 10);
    const novoUsuario = {
      id: uuidv4(),
      nome,
      email: email.toLowerCase(),
      senha: hashedSenha,
      created_at: new Date().toISOString(),
    };

    db.usuarios.push(novoUsuario);
    saveDB(db);

    const { senha: _, ...usuarioSemSenha } = novoUsuario;
    res.status(201).json({ message: 'Cadastro realizado com sucesso', usuario: usuarioSemSenha });
  } catch (error) {
    console.error('Erro no register:', error);
    res.status(500).json({ message: 'Erro interno do servidor' });
  }
});

app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, senha } = req.body;

    if (!email || !senha) {
      return res.status(400).json({ message: 'Preencha todos os campos' });
    }

    const db = loadDB();
    const usuario = db.usuarios.find(
      (u) => u.email.toLowerCase() === email.toLowerCase()
    );

    if (!usuario) {
      return res.status(401).json({ message: 'Email ou senha incorretos' });
    }

    const senhaValida = await bcrypt.compare(senha, usuario.senha);
    if (!senhaValida) {
      return res.status(401).json({ message: 'Email ou senha incorretos' });
    }

    const token = jwt.sign(
      { id: usuario.id, email: usuario.email, nome: usuario.nome },
      JWT_SECRET,
      { expiresIn: JWT_EXPIRES_IN }
    );

    const { senha: _, ...usuarioSemSenha } = usuario;
    res.json({ message: 'Login realizado com sucesso', token, usuario: usuarioSemSenha });
  } catch (error) {
    console.error('Erro no login:', error);
    res.status(500).json({ message: 'Erro interno do servidor' });
  }
});

app.get('/api/auth/me', authMiddleware, (req, res) => {
  const db = loadDB();
  const usuario = db.usuarios.find((u) => u.id === req.user.id);
  if (!usuario) {
    return res.status(404).json({ message: 'Usuário não encontrado' });
  }
  const { senha: _, ...usuarioSemSenha } = usuario;
  res.json(usuarioSemSenha);
});

app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

const sslDir = path.join(__dirname, 'ssl');
if (fs.existsSync(path.join(sslDir, 'cert.pem')) && fs.existsSync(path.join(sslDir, 'key.pem'))) {
  const options = {
    cert: fs.readFileSync(path.join(sslDir, 'cert.pem')),
    key: fs.readFileSync(path.join(sslDir, 'key.pem')),
  };
  https.createServer(options, app).listen(PORT, () => {
    console.log(`🔒 API HTTPS rodando em https://localhost:${PORT}`);
  });
  app.listen(PORT + 1, () => {
    console.log(`🔓 API HTTP fallback em http://localhost:${PORT + 1}`);
  });
} else {
  app.listen(PORT, () => {
    console.log(`🔓 API HTTP rodando em http://localhost:${PORT}`);
  });
}
