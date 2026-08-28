# PetShop

Aplicativo mobile para gestão de pet shop construído com **Ionic**, **Angular** e **Capacitor**, com **backend API** em Node.js/Express e autenticação **JWT**.

## Tecnologias

![Ionic](https://img.shields.io/badge/Ionic-3880FF?style=for-the-badge&logo=ionic&logoColor=white)
![Angular](https://img.shields.io/badge/Angular-DD0031?style=for-the-badge&logo=angular&logoColor=white)
![Capacitor](https://img.shields.io/badge/Capacitor-119EFF?style=for-the-badge&logo=capacitor&logoColor=white)
![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=node.js&logoColor=white)
![Express](https://img.shields.io/badge/Express-000000?style=for-the-badge&logo=express&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white)
![SCSS](https://img.shields.io/badge/SCSS-CC6699?style=for-the-badge&logo=sass&logoColor=white)
![Android](https://img.shields.io/badge/Android-3DDC84?style=for-the-badge&logo=android&logoColor=white)

## Sobre o projeto

O **PetShop** é um aplicativo híbrido que roda no navegador e em dispositivos móveis (Android/iOS) por meio do Capacitor. O app permite gerenciar clientes e pets de uma pet shop com CRUD completo. A autenticação é feita via API REST com JWT, e o armazenamento de dados do cliente/pet é feito via localStorage.

## Funcionalidades

### Autenticação e Segurança
- Cadastro de usuários com validação de senha forte (5 regras)
- Login com autenticação JWT (token expira em 24h)
- Validação de formato de email em tempo real
- Ícone de olho para mostrar/ocultar senha
- Hash SHA-256 + bcrypt nas senhas
- Sanitização de inputs (prevenção XSS)
- Interceptor HTTP que adiciona Bearer token automaticamente
- AuthGuard protege todas as rotas do app
- Logout com limpeza de sessão
- **Recuperação de senha** via email (token expirável de 60 min, uso único, armazenado como hash)
- Páginas `esqueci-senha` e `redefinir-senha` com indicador de força de senha

### LGPD (Lei Geral de Proteção de Dados)
- **Consentimento obrigatório** no cadastro (checkbox de aceite da Política de Privacidade)
- **Página de Política de Privacidade** com aviso completo (dados coletados, finalidade, base legal, segurança, direitos do titular, retenção e contato)
- **Princípio da minimização**: coleta apenas de dados mínimos (nome, email, senha)
- **Log de auditoria** das ações de recuperação e redefinição de senha (com IP e data/hora)
- **Retenção e expiração**: tokens de recuperação com validade curta e purga; auditoria com janela de retenção

### Home (Dashboard)
- Mensagem de boas-vindas com o nome do usuário logado
- Contadores de clientes e pets cadastrados
- Acesso rápido para cadastrar cliente ou pet

### Clientes (Tutores)
- **Perfil do tutor logado** exibido em destaque (card azul) no topo da lista
- Edição do próprio perfil (telefone, email, endereço)
- Listagem de todos os outros clientes
- Busca por nome, telefone ou email
- Cadastro, edição e exclusão com confirmação
- Exclusão em cascata (remove pets vinculados)
- Swipe-to-delete em dispositivos móveis
- Pull-to-refresh

### Pets
- Cadastro com nome, espécie, raça, idade e peso
- Vínculo automático ao tutor logado ao cadastrar
- Dropdown de tutor com indicador "Eu (nome)" para o perfil do usuário
- Listagem com nome do tutor
- Busca por nome, espécie, raça ou tutor
- Edição e exclusão com confirmação
- Ícones por espécie (cachorro, gato, ave, peixe, réptil)
- Swipe-to-delete e pull-to-refresh

### Regras de Senha (Cadastro)
Todas as regras são obrigatórias e validadas em tempo real com indicador visual:

| Regra | Exemplo válido |
|-------|---------------|
| Pelo menos 8 caracteres | `MinhaSenh@1` |
| 1 letra maiúscula | `A` |
| 1 letra minúscula | `a` |
| 1 número | `1` |
| 1 caractere especial | `@#!$%` |

## Arquitetura

### Frontend (`myApp/`)

```
myApp/src/app/
├── models/                    # Interfaces TypeScript
│   ├── cliente.model.ts       # Cliente (com usuario_id)
│   ├── pet.model.ts           # Pet / PetComTutor
│   └── usuario.model.ts       # Usuário
├── services/                  # Serviços
│   ├── storage.service.ts     # Wrapper do localStorage
│   ├── auth.service.ts        # Login/cadastro/logout + JWT + auto-criação de cliente
│   ├── cliente.service.ts     # CRUD de clientes
│   └── pet.service.ts         # CRUD de pets
├── guards/
│   └── auth.guard.ts          # Proteção de rotas
├── interceptors/
│   └── jwt.interceptor.ts     # Adiciona Bearer token às requests
├── utils/
│   └── sanitize.ts            # Sanitização de inputs
├── pages/
│   ├── auth/
│   │   ├── login/             # Login com toggle senha + validação email
│   │   └── cadastro/          # Cadastro com indicador de força
│   ├── clientes/
│   │   ├── cliente-list/      # Lista com perfil do tutor em destaque
│   │   └── cliente-form/      # Formulário criar/editar
│   └── pets/
│       ├── pet-list/          # Lista com tutor
│       └── pet-form/          # Formulário com tutor pré-selecionado
├── tabs/                      # Navegação por abas (Home, Clientes, Pets, Sair)
└── tab1/                      # Dashboard com boas-vindas
```

### Backend (`server/`)

```
server/
├── index.js                   # Express + JWT + bcrypt + recuperação de senha + auditoria LGPD
├── package.json               # Dependências do servidor (inclui nodemailer)
├── ssl/                       # Certificados auto-assinados (HTTPS)
│   ├── cert.pem
│   └── key.pem
└── db.json                    # Persistência em arquivo (gitignored)
```

> Envio de email de recuperação usa **SMTP** via variáveis de ambiente (`SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASS`, `SMTP_FROM`). Sem SMTP configurado, o link é exibido no console (modo dev).

#### Endpoints da API

| Método | Rota | Descrição | Auth |
|--------|------|-----------|------|
| `POST` | `/api/auth/register` | Cadastro de usuário (exige aceite LGPD) | Não |
| `POST` | `/api/auth/login` | Login (retorna JWT) | Não |
| `GET` | `/api/auth/me` | Dados do usuário logado | JWT |
| `POST` | `/api/auth/forgot-password` | Solicita recuperação de senha (envia token por email) | Não |
| `POST` | `/api/auth/reset-password` | Redefine a senha com o token recebido | Não |
| `GET` | `/api/health` | Health check | Não |

#### Portas

| Porta | Protocolo | Uso |
|-------|-----------|-----|
| `3000` | HTTPS | Mobile / produção (Capacitor) |
| `3001` | HTTP | Desenvolvimento (ng serve) |

### Fluxo de Recuperação de Senha

1. Usuário acessa "Esqueci a senha?" e informa o email
2. Backend gera token de recuperação (válido por 60 min), armazena como hash (SHA-256) e registra auditoria `password_reset_request`
3. Backend envia email com link para `/redefinir-senha?token=...` (em dev, o link é exibido no console)
4. Usuário define nova senha (validação das 5 regras de senha forte)
5. Backend valida o token (expiração e uso único), atualiza a senha com bcrypt e registra auditoria `password_reset_completed`
6. Link de recuperação usa **resposta genérica** para não revelar se um email está cadastrado

### Fluxo de Cadastro → Login → Tutor

1. Usuário se cadastra via formulário (validação de senha forte + email)
2. Backend cria usuário com senha hasheada (bcrypt)
3. Usuário faz login → recebe JWT
4. Frontend verifica se existe `Cliente` com `usuario_id` do usuário
5. Se não existir, cria automaticamente (nome + email)
6. Tutor aparece em destaque na lista de clientes
7. Ao cadastrar pet, tutor já vem pré-selecionado

## Pré-requisitos

- [Node.js](https://nodejs.org/) (versão 20 ou superior)
- [npm](https://www.npmjs.com/)
- [Ionic CLI](https://ionicframework.com/docs/intro/cli) (opcional)
- JDK 21+ (Capacitor 8) e Android SDK configurados
- [Android Studio](https://developer.android.com/studio)

## Como rodar

### 1. Instalar dependências

```bash
npm install          # Raiz (scripts)
cd myApp && npm install
cd ../server && npm install
```

### 2. Iniciar backend (API)

```bash
cd server
npm start
```

A API sobe em:
- `https://localhost:3000` (HTTPS)
- `http://localhost:3001` (HTTP fallback para dev)

#### Variáveis de ambiente do backend

| Variável        | Descrição                                                    | Padrão                 |
| --------------- | ------------------------------------------------------------ | ---------------------- |
| `PORT`          | Porta da API (HTTPS)                                         | `3000`                 |
| `JWT_SECRET`    | Chave secreta para assinatura dos tokens JWT                 | `valor dev`            |
| `SMTP_HOST`     | Servidor SMTP para envio de email de recuperação             | *(vazio = modo dev)*   |
| `SMTP_PORT`     | Porta SMTP (587 para TLS, 465 para SSL)                      | `587`                  |
| `SMTP_USER`     | Usuário do SMTP                                              | —                      |
| `SMTP_PASS`     | Senha/App password do SMTP                                   | —                      |
| `SMTP_FROM`     | E-mail remetente do email de recuperação                     | `SMTP_USER`            |
| `APP_URL`       | URL pública do frontend (base do link de recuperação)        | `http://localhost:4200`|

> Sem `SMTP_HOST` configurado, o link de recuperação é exibido no console do servidor (modo desenvolvimento).

### 3. Iniciar frontend (Angular)

```bash
cd myApp
npm start
```

Disponível em `http://localhost:4200`.

### 4. Build de produção

```bash
cd myApp
npm run build
```

### 5. Rodar no dispositivo móvel

```bash
cd myApp
npm run build
npx cap sync android
npx cap open android
```

### Atalhos da raiz

| Comando | Descrição |
|---------|-----------|
| `npm start` | Frontend em localhost:4200 |
| `npm run server` | Backend em :3000/:3001 |
| `npm run dev` | Backend + frontend juntos |

## Git Flow

| Branch      | Uso                    |
| ----------- | ---------------------- |
| `main`      | Produção estável       |
| `develop`   | Integração de features |
| `feature/*` | Nova funcionalidade    |
| `hotfix/*`  | Correção urgente       |

### Fluxo de trabalho (1 issue = 1 branch = 1 PR)

Cada implementação segue o padrão: **uma issue no GitHub → uma branch de feature → um Pull Request para `develop`**.

1. Criar a issue descrevendo a implementação e seus critérios de aceite.
2. Criar a branch a partir de `develop`:
   ```bash
   git checkout develop && git pull
   git checkout -b feature/nome-da-feature
   ```
3. Implementar e commitar com a convenção Angular.
4. Enviar a branch e abrir o Pull Request:
   ```bash
   git push -u origin feature/nome-da-feature
   gh pr create --base develop --head feature/nome-da-feature
   ```
5. Após review e merge em `develop`, deletar a branch (local e remota).

> Manter `develop` sempre sincronizada com `main` (fast-forward) para que as features saiam de um tronco atualizado.

### Commits

Padrão Angular:
```
feat(scope): descrição
fix(scope): descrição
docs: descrição
refactor(scope): descrição
```

## Versões

| Pacote                        | Versão  |
| ----------------------------- | ------- |
| Angular                       | 20.3.27 |
| Angular CLI                   | 20.3.33 |
| Ionic                         | 8.8.19  |
| Capacitor                     | 8.5.0   |
| TypeScript                    | 5.9.3   |
| Express                       | 4.21.0  |
| jsonwebtoken                  | 9.0.2   |
| bcryptjs                      | 2.4.3   |
| nodemailer                    | 9.0.6   |

## Scripts disponíveis

| Comando              | Descrição                                    |
| -------------------- | -------------------------------------------- |
| `npm start`          | Frontend (ng serve)                          |
| `npm run server`     | Backend (Express)                            |
| `npm run dev`        | Backend + frontend simultâneos               |
| `npm run build`      | Build de produção                            |
| `npm test`           | Testes unitários                             |
| `npm run lint`       | Linter (ESLint)                              |

## Contribuindo

Consulte o arquivo [CONTRIBUTING.md](CONTRIBUTING.md) para mais informações sobre o fluxo de desenvolvimento e convenções do projeto.
