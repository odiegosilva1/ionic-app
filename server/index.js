const express = require('express');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const nodemailer = require('nodemailer');
const { v4: uuidv4 } = require('uuid');
const https = require('https');
const fs = require('fs');
const path = require('path');

const app = express();
const JWT_SECRET = process.env.JWT_SECRET || 'petshop-jwt-secret-key-2024';
const JWT_EXPIRES_IN = '24h';
const PORT = process.env.PORT || 3000;

const RESET_TOKEN_TTL_MINUTES = 60;

const PASSWORD_RULES = [
  (s) => s.length >= 8,
  (s) => /[A-Z]/.test(s),
  (s) => /[a-z]/.test(s),
  (s) => /[0-9]/.test(s),
  (s) => /[^A-Za-z0-9]/.test(s),
];

const DB_FILE = path.join(__dirname, 'db.json');

function loadDB() {
  try {
    if (fs.existsSync(DB_FILE)) {
      const db = JSON.parse(fs.readFileSync(DB_FILE, 'utf-8'));
      if (!Array.isArray(db.reset_tokens)) db.reset_tokens = [];
      return db;
    }
  } catch {}
  return { usuarios: [], reset_tokens: [] };
}

function saveDB(db) {
  fs.writeFileSync(DB_FILE, JSON.stringify(db, null, 2));
}

function hashToken(token) {
  return crypto.createHash('sha256').update(token).digest('hex');
}

function isStrongPassword(senha) {
  return PASSWORD_RULES.every((rule) => rule(senha));
}

function createTransporter() {
  if (!process.env.SMTP_HOST) return null;
  return nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT) || 587,
    secure: Number(process.env.SMTP_PORT) === 465,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });
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
    const { nome, email, senha, aceiteTermos } = req.body;

    if (!nome || !email || !senha) {
      return res.status(400).json({ message: 'Preencha todos os campos' });
    }

    if (aceiteTermos !== true) {
      return res.status(400).json({
        message: 'É necessário aceitar a Política de Privacidade para se cadastrar (LGPD)',
      });
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
      aceite_termos: true,
      aceite_termos_at: new Date().toISOString(),
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

app.post('/api/auth/forgot-password', async (req, res) => {
  try {
    const { email } = req.body;

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return res.status(400).json({ message: 'Informe um email válido' });
    }

    const db = loadDB();
    const usuario = db.usuarios.find(
      (u) => u.email.toLowerCase() === email.toLowerCase()
    );

    if (usuario) {
      db.reset_tokens = (db.reset_tokens || []).filter(
        (t) => t.usuario_id !== usuario.id || new Date(t.expires_at) > new Date()
      );

      const token = uuidv4() + uuidv4();
      const tokenHash = hashToken(token);
      const expiresAt = new Date(Date.now() + RESET_TOKEN_TTL_MINUTES * 60 * 1000).toISOString();

      db.reset_tokens.push({
        id: tokenHash,
        usuario_id: usuario.id,
        expires_at: expiresAt,
        used_at: null,
      });
      saveDB(db);

      const resetUrl = `${process.env.APP_URL || 'http://localhost:4200'}/redefinir-senha?token=${token}`;
      const transporter = createTransporter();

      if (transporter) {
        try {
          await transporter.sendMail({
            from: process.env.SMTP_FROM || process.env.SMTP_USER,
            to: usuario.email,
            subject: 'Redefinição de senha - PetShop',
            text: `Você solicitou a redefinição de senha. Acesse o link abaixo para criar uma nova senha (válido por ${RESET_TOKEN_TTL_MINUTES} minutos):\n\n${resetUrl}\n\nSe você não solicitou, ignore este email.`,
            html: `<p>Você solicitou a redefinição de senha.</p><p>Acesse o link abaixo para criar uma nova senha (válido por ${RESET_TOKEN_TTL_MINUTES} minutos):</p><p><a href="${resetUrl}">Redefinir senha</a></p><p>Se você não solicitou, ignore este email.</p>`,
          });
        } catch (sendErr) {
          console.error('Falha ao enviar email:', sendErr.message);
        }
      } else {
        console.log(`[DEV] Link de redefinição para ${usuario.email}: ${resetUrl}`);
      }
    }

    res.json({ message: 'Se o email existir, enviaremos um link de redefinição.' });
  } catch (error) {
    console.error('Erro no forgot-password:', error);
    res.status(500).json({ message: 'Erro interno do servidor' });
  }
});

app.post('/api/auth/reset-password', async (req, res) => {
  try {
    const { token, novaSenha } = req.body;

    if (!token || !novaSenha) {
      return res.status(400).json({ message: 'Preencha todos os campos' });
    }

    if (!isStrongPassword(novaSenha)) {
      return res.status(400).json({
        message: 'A senha deve atender todos os 5 requisitos de segurança',
      });
    }

    const db = loadDB();
    const tokenHash = hashToken(String(token));
    const registro = (db.reset_tokens || []).find((t) => t.id === tokenHash);

    if (
      !registro ||
      registro.used_at ||
      new Date(registro.expires_at) < new Date()
    ) {
      return res.status(400).json({ message: 'Token inválido, expirado ou já utilizado' });
    }

    const usuario = db.usuarios.find((u) => u.id === registro.usuario_id);
    if (!usuario) {
      return res.status(400).json({ message: 'Usuário não encontrado' });
    }

    usuario.senha = await bcrypt.hash(novaSenha, 10);
    registro.used_at = new Date().toISOString();

    db.reset_tokens = (db.reset_tokens || []).filter((t) => {
      if (t.used_at) return false;
      return new Date(t.expires_at) > new Date();
    });
    saveDB(db);

    res.json({ message: 'Senha redefinida com sucesso' });
  } catch (error) {
    console.error('Erro no reset-password:', error);
    res.status(500).json({ message: 'Erro interno do servidor' });
  }
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
