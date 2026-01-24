# ChirpyNosh Backend

Production-ready Express/TypeScript backend for the ChirpyNosh food redistribution platform.

## Tech Stack

- **Runtime**: Node.js 18+
- **Framework**: Express.js
- **Language**: TypeScript
- **Database**: PostgreSQL
- **ORM**: Prisma
- **Authentication**: JWT + bcrypt
- **Validation**: Zod

## Quick Start

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure Environment

Copy the example environment file and configure it:

```bash
cp .env.example .env
```

Edit `.env` with your database credentials:

```env
DATABASE_URL="postgresql://username:password@localhost:5432/chirpynosh"
JWT_SECRET="your-secure-secret-key"
```

### 3. Setup Database

Generate Prisma client and run migrations:

```bash
npm run db:generate
npm run db:migrate
```

### 4. Start Development Server

```bash
npm run dev
```

Server runs at `http://localhost:3000`.

## API Endpoints

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/api/health` | No | Health check |
| POST | `/api/auth/register` | No | Register user |
| POST | `/api/auth/login` | No | Login |
| GET | `/api/auth/me` | Yes | Current user |
| GET | `/api/partners` | No | List partners |
| POST | `/api/partners` | Yes | Create partner |
| GET | `/api/recipients` | No | List recipients |
| POST | `/api/recipients` | Yes | Create recipient |
| GET | `/api/listings` | No | List listings (paginated) |
| POST | `/api/listings` | Yes | Create listing |
| GET | `/api/claims` | Yes | User's claims |
| POST | `/api/claims` | Yes/No | Create claim |
| PATCH | `/api/claims/:id/status` | Yes | Update claim status |
| GET | `/api/expirations` | Yes | List expirations |
| POST | `/api/expirations` | Yes | Create expiration |
| GET | `/api/notifications` | Yes | List notifications |
| PATCH | `/api/notifications/:id/read` | Yes | Mark as read |

## Project Structure

```
src/
├── app.ts              # Express app setup
├── server.ts           # Server entry point
├── config/
│   └── env.ts          # Environment configuration
├── lib/
│   └── prisma.ts       # Prisma client singleton
├── types/
│   └── index.ts        # TypeScript types
├── middleware/
│   ├── auth.ts         # JWT authentication
│   ├── errorHandler.ts # Error handling
│   └── validate.ts     # Zod validation
├── validators/         # Request validation schemas
├── services/           # Business logic
├── controllers/        # Request handlers
└── routes/             # API routes
```

## Scripts

| Script | Description |
|--------|-------------|
| `npm run dev` | Start dev server with hot reload |
| `npm run build` | Build for production |
| `npm start` | Run production build |
| `npm run db:generate` | Generate Prisma client |
| `npm run db:migrate` | Run database migrations |
| `npm run db:studio` | Open Prisma Studio |

## License

MIT
