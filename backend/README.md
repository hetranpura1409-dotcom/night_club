# Nightclub App - Backend API

NestJS-based REST API for the Nightclub application.

## 🚀 Quick Start

### 1. Install Dependencies
```bash
npm install
```

### 2. Configure Environment
Copy `.env.example` to `.env` and update the values:
```bash
cp .env.example .env
```

### 3. Start PostgreSQL Database
```bash
# From the root directory
docker-compose up -d
```

### 4. Run Development Server
```bash
npm run start:dev
```

The API will be available at `http://localhost:3000`

## 📁 Project Structure

```
src/
├── modules/
│   ├── auth/           # Authentication & authorization
│   ├── users/          # User management
│   ├── nightclubs/     # Nightclub data
│   ├── events/         # Events management
│   └── notifications/  # Push notifications
├── config/             # Configuration files
├── common/             # Shared utilities
├── app.module.ts       # Root module
└── main.ts            # Application entry point
```

## 🔌 API Endpoints

### Authentication
- `POST /auth/signup` - Register new user
- `POST /auth/verify` - Verify SMS code (mock)
- `POST /auth/login` - User login
- `GET /auth/me` - Get current user

### Users
- `GET /users` - Get all users (admin)
- `GET /users/:id` - Get user by ID
- `PATCH /users/:id/fcm-token` - Update FCM token

### Nightclubs
- `GET /nightclubs` - Get all nightclubs
- `GET /nightclubs/:id` - Get nightclub details

### Events
- `GET /events` - Get all events
- `GET /events/nightclub/:id` - Get events for nightclub

### Notifications
- `POST /notifications/send` - Send push notification

## 🗄️ Database Schema

### Users Table
- id (SERIAL PRIMARY KEY)
- name (VARCHAR)
- mobile (VARCHAR UNIQUE)
- fcm_token (VARCHAR)
- created_at (TIMESTAMP)
- updated_at (TIMESTAMP)

### Nightclubs Table
- id (SERIAL PRIMARY KEY)
- name (VARCHAR)
- description (TEXT)
- address (VARCHAR)
- city (VARCHAR)
- image_url (VARCHAR)
- created_at (TIMESTAMP)

### Events Table
- id (SERIAL PRIMARY KEY)
- nightclub_id (INTEGER FK)
- name (VARCHAR)
- description (TEXT)
- event_date (DATE)
- event_time (TIME)
- price (DECIMAL)
- created_at (TIMESTAMP)

## 🧪 Testing

```bash
# Unit tests
npm run test

# E2E tests
npm run test:e2e

# Test coverage
npm run test:cov
```

## 🔧 Available Scripts

- `npm run start` - Start in production mode
- `npm run start:dev` - Start in development mode with watch
- `npm run build` - Build for production
- `npm run lint` - Run ESLint
- `npm run format` - Format code with Prettier

## 🔐 Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `DATABASE_HOST` | PostgreSQL host | localhost |
| `DATABASE_PORT` | PostgreSQL port | 5432 |
| `DATABASE_USER` | Database username | postgres |
| `DATABASE_PASSWORD` | Database password | postgres |
| `DATABASE_NAME` | Database name | nightclub_poc |
| `JWT_SECRET` | Secret for JWT tokens | - |
| `JWT_EXPIRATION` | JWT expiration time | 7d |
| `FIREBASE_PROJECT_ID` | Firebase project ID | - |
| `FIREBASE_CLIENT_EMAIL` | Firebase client email | - |
| `FIREBASE_PRIVATE_KEY` | Firebase private key | - |
| `PORT` | Server port | 3000 |

## 📦 Dependencies

- **NestJS** - Progressive Node.js framework
- **TypeORM** - ORM for TypeScript
- **PostgreSQL** - Relational database
- **JWT** - Authentication tokens
- **Firebase Admin** - Push notifications
- **Class Validator** - DTO validation
