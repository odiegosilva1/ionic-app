# Contribuindo - Pet Shop App

## Fluxo de Desenvolvimento (Git Flow)

### Branches

| Branch | Uso | Origem | Merge em |
|--------|-----|--------|----------|
| `main` | Produção estable | - | - |
| `develop` | Integração de features | `main` | `main` (via release) |
| `feature/*` | Nova funcionalidade | `develop` | `develop` |
| `hotfix/*` | Correção urgente em produção | `main` | `main` + `develop` |

### Criando uma feature

```bash
# 1. Criar branch a partir de develop
git checkout develop
git checkout -b feature/nome-da-feature

# 2. Desenvolver e commitar
git add .
git commit -m "feat(scope): descrição"

# 3. Push e PR para develop
git push -u origin feature/nome-da-feature
# Abrir Pull Request para develop

# 4. Após review e CI verde, merge em develop
```

### Criando um hotfix

```bash
git checkout main
git checkout -b hotfix/corrigir-bug
# ... correção ...
git commit -m "fix(scope): descrição"
git checkout main && git merge hotfix/corrigir-bug
git checkout develop && git merge hotfix/corrigir-bug
```

### Finalizando uma release

```bash
git checkout develop
git checkout -b release/1.0.0
# ... preparação ...
git checkout main && git merge release/1.0.0
git tag -a v1.0.0 -m "Release 1.0.0"
git checkout develop && git merge release/1.0.0
```

## Convenção de Commits

Formato: `<type>(<scope>): <descrição>`

### Types
- `feat`: Nova funcionalidade
- `fix`: Correção de bug
- `docs`: Documentação
- `style`: Formatação (sem mudança de código)
- `refactor`: Refatoração
- `test`: Adição/correção de testes
- `chore`: Configurações, dependências

### Exemplos
```
feat(pets): adicionar formulário de cadastro de pet
fix(clientes): corrigir validação de telefone
docs: adicionar CONTRIBUTING.md com fluxo Git Flow
```

## Estrutura do Projeto

```
src/app/
├── models/          # Interfaces TypeScript
├── services/        # Serviços de banco de dados e lógica
├── pages/           # Páginas (componentes standalone)
│   ├── home/
│   ├── clientes/
│   └── pets/
└── tabs/            # Navegação por abas
```

## Tecnologias

- **Ionic 8** - UI Framework
- **Angular 20** - Framework SPA
- **Capacitor 8** - Bridge para nativo (Android/iOS)
- **SQLite** (`@capacitor-community/sqlite`) - Banco local

## Pré-requisitos

- Node.js >= 20
- npm >= 10
- Angular CLI >= 20
- Android Studio (para build Android)
