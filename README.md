# myApp

Aplicativo mobile inicial construído com **Ionic**, **Angular** e **Capacitor**, seguindo o template oficial com navegação por abas (tabs).

## Tecnologias

![Ionic](https://img.shields.io/badge/Ionic-3880FF?style=for-the-badge&logo=ionic&logoColor=white)
![Angular](https://img.shields.io/badge/Angular-DD0031?style=for-the-badge&logo=angular&logoColor=white)
![Capacitor](https://img.shields.io/badge/Capacitor-119EFF?style=for-the-badge&logo=capacitor&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white)
![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white)
![SCSS](https://img.shields.io/badge/SCSS-CC6699?style=for-the-badge&logo=sass&logoColor=white)
![Karma](https://img.shields.io/badge/Karma-2C3E50?style=for-the-badge&logo=karma&logoColor=white)

## Sobre o projeto

O `myApp` é um aplicativo híbrido que roda no navegador e em dispositivos móveis (Android/iOS) por meio do Capacitor. Ele foi gerado com o template de tabs do Ionic, contendo três abas (`Tab 1`, `Tab 2` e `Tab 3`) com navegação inferior, prontas para serem adaptadas às funcionalidades do projeto.

### Estrutura

```
src/
└── app/
    ├── tabs/          # Container de navegação com as abas
    ├── tab1/          # Página da aba 1
    ├── tab2/          # Página da aba 2
    ├── tab3/          # Página da aba 3
    ├── explore-container/  # Componente de placeholder das abas
    ├── app.component.* # Componente raiz
    └── app.routes.ts   # Rotas da aplicação
```

## Pré-requisitos

- [Node.js](https://nodejs.org/) (versão 20 ou superior)
- [npm](https://www.npmjs.com/)
- [Ionic CLI](https://ionicframework.com/docs/intro/cli) (opcional, mas recomendado)

## Como rodar o projeto

### 1. Instalar as dependências

```bash
npm install
```

### 2. Rodar no navegador (desenvolvimento)

```bash
npm start
```

Ou, usando o Ionic CLI:

```bash
ionic serve
```

A aplicação estará disponível em `http://localhost:8100`.

### 3. Build de produção

```bash
npm run build
```

O build será gerado na pasta `www/`.

### 4. Rodar no dispositivo móvel (Capacitor)

Adicione a plataforma desejada e sincronize o projeto:

```bash
npx cap add android   # ou: npx cap add ios
npx cap sync
```

Depois abra o projeto nativo:

```bash
npx cap open android  # ou: npx cap open ios
```

### 5. Testes

```bash
npm test
```

### 6. Lint

```bash
npm run lint
```

## Scripts disponíveis

| Comando              | Descrição                             |
| -------------------- | ------------------------------------- |
| `npm start`          | Sobe o servidor de desenvolvimento    |
| `npm run build`      | Gera o build de produção              |
| `npm test`           | Executa os testes unitários (Karma)   |
| `npm run lint`       | Executa o linter (ESLint)             |
| `npm run watch`      | Build em modo watch (desenvolvimento) |
