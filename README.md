# Project Description

This project is a Next.js (v15) application (App Router) that integrates PostgreSQL database access using Sutando and TypeScript. It is designed to support multi-subdomain authentication through parent domain cookies.

## 🧑‍💻 Requirements

- Bun JS
- PostgreSQL

## 🛠️ Setup

### 1. Installation

```bash
bun install
```

### 2. Environment Variables

Create a `.env.local` file based on the provided `.env.local.example`

- `NEXT_PUBLIC_PARENT_DOMAIN` is used to store user authentication tokens in cookies shared across subdomains.
- `DB_*` variables are database connection settings.

### 3. Database Setup Commands

#### Create a New Migration

```bash
bun sutando migrate:make tabe_name
```

#### Run Migrations

```bash
bun sutando migrate:run
```

#### Rollback Migrations

```bash
bun sutando migrate:rollback
```

#### Run Seeds

```bash
bun run seed:run
```

## 📄 License

This project is open-source and available under the [MIT License](LICENSE).
