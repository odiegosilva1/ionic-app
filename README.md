# PetShop

Aplicativo mobile para gestão de pet shop construído com **Ionic**, **Angular** e **Capacitor**, utilizando **localStorage** para armazenamento local de dados.

## Tecnologias

![Ionic](https://img.shields.io/badge/Ionic-3880FF?style=for-the-badge&logo=ionic&logoColor=white)
![Angular](https://img.shields.io/badge/Angular-DD0031?style=for-the-badge&logo=angular&logoColor=white)
![Capacitor](https://img.shields.io/badge/Capacitor-119EFF?style=for-the-badge&logo=capacitor&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white)
![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white)
![SCSS](https://img.shields.io/badge/SCSS-CC6699?style=for-the-badge&logo=sass&logoColor=white)
![Android](https://img.shields.io/badge/Android-3DDC84?style=for-the-badge&logo=android&logoColor=white)

## Sobre o projeto

O **PetShop** é um aplicativo híbrido que roda no navegador e em dispositivos móveis (Android/iOS) por meio do Capacitor. O app permite gerenciar clientes e pets de uma pet shop com CRUD completo, utilizando localStorage para armazenamento local.

### Funcionalidades

- **Autenticação**: Cadastro e login de usuários com validação de senha forte
- **Home**: Dashboard com contadores de clientes e pets, e acessos rápidos
- **Clientes**: Cadastro, listagem, edição e exclusão de clientes
- **Pets**: Cadastro, listagem, edição e exclusão de pets com vínculo ao tutor

### Regras de Senha

O cadastro exige senhas que atendam todos os seguintes critérios:

- Pelo menos 8 caracteres
- Pelo menos 1 letra maiúscula
- Pelo menos 1 letra minúscula
- Pelo menos 1 número
- Pelo menos 1 caractere especial (!@#$%...)

### Estrutura do Projeto

```
myApp/src/app/
├── models/                    # Interfaces TypeScript
│   ├── cliente.model.ts       # Interface Cliente
│   ├── pet.model.ts           # Interface Pet
│   └── usuario.model.ts       # Interface Usuario
├── services/                  # Serviços de lógica e armazenamento
│   ├── storage.service.ts     # Wrapper do localStorage
│   ├── auth.service.ts        # Autenticação (login/cadastro/logout)
│   ├── cliente.service.ts     # CRUD de clientes
│   └── pet.service.ts         # CRUD de pets
├── guards/                    # Guards de rotas
│   └── auth.guard.ts          # Proteção de rotas autenticadas
├── pages/                     # Páginas (componentes standalone)
│   ├── auth/
│   │   ├── login/             # Página de login
│   │   └── cadastro/          # Página de cadastro
│   ├── clientes/
│   │   ├── cliente-list/      # Lista de clientes
│   │   └── cliente-form/      # Formulário criar/editar
│   └── pets/
│       ├── pet-list/          # Lista de pets
│       └── pet-form/          # Formulário criar/editar
├── tabs/                      # Navegação por abas
│   ├── tabs.routes.ts         # Rotas da aplicação
│   └── tabs.page.html         # Layout das abas
├── tab1/                      # Página Home (dashboard)
└── app.routes.ts              # Rotas principais
```

### Armazenamento

O app utiliza **localStorage** para persistência de dados:

| Chave               | Descrição         |
| ------------------- | ----------------- |
| `petshop_clientes`  | Lista de clientes |
| `petshop_pets`      | Lista de pets     |
| `petshop_usuarios`  | Lista de usuários |
| `petshop_session`   | Sessão do usuário |

## Pré-requisitos

- [Node.js](https://nodejs.org/) (versão 20 ou superior)
- [npm](https://www.npmjs.com/)
- [Ionic CLI](https://ionicframework.com/docs/intro/cli) (opcional, mas recomendado)
- JDK 21+ (exigido pelo Capacitor 8) e Android SDK configurados
- [Android Studio](https://developer.android.com/studio) (para abrir/editar o projeto nativo)

## Como rodar o projeto

### 1. Instalar as dependências

```bash
cd myApp
npm install
```

### 2. Rodar no navegador (desenvolvimento)

```bash
npm start
```

A aplicação estará disponível em `http://localhost:4200`.

### 3. Build de produção

```bash
npm run build
```

O build será gerado na pasta `www/`.

### 4. Rodar no dispositivo móvel (Capacitor)

A plataforma **Android** já está configurada na pasta `android/`. Para sincronizar o build web com o projeto nativo:

```bash
npm run build
npx cap sync android
```

### 5. Executar num dispositivo ou emulador

```bash
npx cap open android
```

Ou rode direto num dispositivo/emulador conectado:

```bash
npx cap run android
```

## Git Flow

O projeto segue o fluxo Git Flow para controle de versão:

| Branch      | Uso                    |
| ----------- | ---------------------- |
| `main`      | Produção estável       |
| `develop`   | Integração de features |
| `feature/*` | Nova funcionalidade    |
| `hotfix/*`  | Correção urgente       |

### Commits

A convenção de commits segue o padrão Angular:

```
feat(scope): descrição
fix(scope): descrição
docs: descrição
```

## Versões

| Pacote                        | Versão  |
| ----------------------------- | ------- |
| Angular                       | 20.3.27 |
| Angular CLI                   | 20.3.33 |
| @angular-devkit/build-angular | 20.3.34 |
| Ionic                         | 8.8.19  |
| Capacitor                     | 8.5.0   |
| TypeScript                    | 5.9.3   |

## Solução de problemas

- **Erro `The current version of "@angular/build" supports Angular versions ^22.0.0`**: as versões de `@angular-devkit/build-angular`, `@angular/cli` e dos pacotes `@angular/*` devem estar alinhadas na mesma versão major/minor do Angular (neste projeto, 20.x). Se o `package.json` tiver `@angular-devkit/build-angular` com caret em outra major (ex.: `^22.1.5`), corrija para `~20.x` e rode `rm -rf node_modules package-lock.json && npm install`.
- **Porta do dev server**: como o script `start` usa `ng serve` diretamente (e não o Ionic CLI), a porta padrão é **4200**, e não 8100.

## Scripts disponíveis

| Comando              | Descrição                             |
| -------------------- | ------------------------------------- |
| `npm start`          | Sobe o servidor de desenvolvimento    |
| `npm run build`      | Gera o build de produção              |
| `npm test`           | Executa os testes unitários           |
| `npm run lint`       | Executa o linter (ESLint)             |

## Contribuindo

Consulte o arquivo [CONTRIBUTING.md](CONTRIBUTING.md) para mais informações sobre o fluxo de desenvolvimento e convenções do projeto.
