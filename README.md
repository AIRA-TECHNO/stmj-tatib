# Project Description

This project is a **Next.js v15 (App Router)** application integrated with **ElysiaJS**, using **PostgreSQL** via **Sutando** and written in **TypeScript**. It supports **multi-subdomain authentication** using shared parent-domain cookies and features a modular architecture with configurable app modules.

## 🧑‍💻 Requirements

* [Bun](https://bun.sh)
* PostgreSQL

## 🧩 Modular System

Modules used in the app are configured via the environment variable:

```
NEXT_PUBLIC_APP_MODULES=module1,module2,module3
```

This allows you to enable or disable specific modules at runtime.

To assist with CLI operations like generating migrations and models, another variable is used:

```
NEXT_PUBLIC_PRIMARY_APP_MODULE=auth
```

- `NEXT_PUBLIC_PRIMARY_APP_MODULE` defines the **target module** when running CLI commands (e.g. `bun sutando migrate:make`).  
- The system will use this to determine the working directory, such as `./app/auth/_backend/`.

## 🛠️ Setup

### 1. Installation

```bash
bun install
```

### 2. Environment Variables

Create a `.env` file based on the provided `.env.example`

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
bun run ./app/[moduleName]/_backend/databases/seeds/index.ts
```

## 📄 License

This project is open-source and available under the [MIT License](LICENSE).
