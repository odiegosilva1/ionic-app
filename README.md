# IONIC APP

Aplicativo mobile inicial construído com **Ionic**, **Angular** e **Capacitor**, seguindo o template oficial com navegação por abas (tabs), com suporte nativo para **Android**.

## Tecnologias

![Ionic](https://img.shields.io/badge/Ionic-3880FF?style=for-the-badge&logo=ionic&logoColor=white)
![Angular](https://img.shields.io/badge/Angular-DD0031?style=for-the-badge&logo=angular&logoColor=white)
![Capacitor](https://img.shields.io/badge/Capacitor-119EFF?style=for-the-badge&logo=capacitor&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white)
![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white)
![SCSS](https://img.shields.io/badge/SCSS-CC6699?style=for-the-badge&logo=sass&logoColor=white)
![Karma](https://img.shields.io/badge/Karma-2C3E50?style=for-the-badge&logo=karma&logoColor=white)
![Android](https://img.shields.io/badge/Android-3DDC84?style=for-the-badge&logo=android&logoColor=white)
![Gradle](https://img.shields.io/badge/Gradle-02303A?style=for-the-badge&logo=gradle&logoColor=white)

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

android/               # Projeto nativo Android (Capacitor/Gradle)
```

## Pré-requisitos

- [Node.js](https://nodejs.org/) (versão 20 ou superior)
- [npm](https://www.npmjs.com/)
- [Ionic CLI](https://ionicframework.com/docs/intro/cli) (opcional, mas recomendado)
- [Android Studio](https://developer.android.com/studio) (para build nativo Android)
- JDK 21+ e Android SDK configurados
- Variáveis de ambiente: `JAVA_HOME`, `ANDROID_HOME`

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

A plataforma **Android** já está configurada na pasta `android/`. Para sincronizar o build web com o projeto nativo:

```bash
npm run build
npx cap sync android
```

Abra o projeto nativo no Android Studio:

```bash
npx cap open android
```

Ou rode direto num dispositivo/emulador conectado:

```bash
npx cap run android
```

> **Nota:** para instalar novos plugins, instale o pacote via npm (`npm install <plugin>`) e depois rode `npx cap sync android` novamente.

### 5. Testes

```bash
npm test
```

### 6. Lint

```bash
npm run lint
```

## Versões

| Pacote              | Versão  |
| ------------------- | ------- |
| Angular             | 20.3.27 |
| Angular CLI         | 20.3.33 |
| Ionic               | 8.x     |
| Capacitor           | 8.5.0   |
| Capacitor Android   | 8.5.0   |
| JDK                 | 21      |
| Gradle              | 8.14.3  |

## Scripts disponíveis

| Comando              | Descrição                             |
| -------------------- | ------------------------------------- |
| `npm start`          | Sobe o servidor de desenvolvimento    |
| `npm run build`      | Gera o build de produção              |
| `npm test`           | Executa os testes unitários (Karma)   |
| `npm run lint`       | Executa o linter (ESLint)             |
| `npm run watch`      | Build em modo watch (desenvolvimento) |
