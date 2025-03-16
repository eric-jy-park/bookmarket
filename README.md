# Bookmarket

![screenshot-with-background (2)](https://github.com/user-attachments/assets/a59c0c27-e4be-4226-a708-8d2dda4471f7)


## 🚀 Features

- User authentication with JWT and Google OAuth
- Book listing and management
- Search and filter functionality
- Responsive design for all devices
- Error monitoring and reporting

## 📦 Project Structure

This project is a monorepo managed with Turborepo and pnpm, containing:

- **Frontend (Web)**: Next.js application with TypeScript and Tailwind CSS
- **Backend (Server)**: NestJS application with TypeScript, TypeORM, and
  PostgreSQL
- **Shared Packages**: Common utilities and configurations

## 🛠️ Tech Stack

### Frontend

- Next.js
- TypeScript
- Tailwind CSS
- Sentry for error monitoring

### Backend

- NestJS
- TypeScript
- TypeORM with PostgreSQL
- JWT Authentication
- Google Auth integration
- Sentry for error monitoring

## 🏗️ Installation

### Prerequisites

- Node.js (v18 or higher)
- pnpm (v9.0.0 or higher)
- PostgreSQL

### Setup

1. Clone the repository:

   ```
   git clone https://github.com/yourusername/bookmarket.git
   cd bookmarket
   ```

2. Install dependencies:

   ```
   pnpm install
   ```

3. Configure environment variables:

   - Copy `.env.example` to `.env` in both `/apps/web` and `/apps/server`
     directories
   - Update the values in the `.env` files with your configuration

4. Setup the database:
   ```
   cd apps/server
   pnpm run migration:run
   ```

## 🚀 Development

To run the project in development mode:

pnpm dev

This will start both the frontend and backend applications in parallel.

### Frontend Only

```
pnpm --filter bookmarket-web dev
```

### Backend Only

```
pnpm --filter bookmarket-server dev
```

## 🧪 Testing

Run tests across all packages:

```
pnpm test
```

## 🏭 Building for Production

Build all applications:

```
pnpm build
```

## 🧹 Code Quality

This project uses ESLint, Prettier, and TypeScript for code quality:

- Run linting: `pnpm lint`
- Format code: `pnpm format`
- Type checking: `pnpm check-types`

## 🔄 Database Migrations

Generate a new migration:

```
cd apps/server
pnpm run migration:generate migration-name
```

Run migrations:

```
cd apps/server
pnpm run migration:run
```

Revert the last migration:

```
cd apps/server
pnpm run migration:revert
```

## 🤝 Contributing

1. Fork the project
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the [MIT License](LICENSE).

## 📧 Contact

If you have any questions, feel free to reach out!

---
