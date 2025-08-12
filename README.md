# NoteTaker - Full Stack Note-Taking Application

A modern, full-stack note-taking application built with React, TypeScript, Node.js, and PostgreSQL. Features include user authentication, real-time note management, and a clean, responsive UI.

## 🚀 Features

### Core Features
- **User Authentication**: Email/password and Google OAuth support
- **Note Management**: Create, read, update, delete notes
- **Local Storage**: Work offline with local note storage
- **Search & Filter**: Advanced filtering and search capabilities
- **Responsive Design**: Works on desktop and mobile devices

### Technical Features
- **Frontend**: React 19 + TypeScript + Vite
- **Backend**: Node.js + Express + TypeScript
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: JWT + bcrypt + Google OAuth
- **UI**: Shadcn UI + Tailwind CSS
- **Testing**: Jest + React Testing Library
- **API Documentation**: Swagger/OpenAPI
- **Logging**: Structured logging with file output

## 📋 Requirements Fulfilled

### ✅ Core Requirements
- [x] Clean and responsive UI
- [x] Frontend and backend validation
- [x] Proper error handling and display
- [x] Secure authentication mechanism
- [x] Authorization and protected APIs
- [x] RESTful API conventions
- [x] Server-side pagination and filtering
- [x] Normalized database design

### ✅ Preferred Expectations
- [x] **Reusable FE Components**: Shadcn UI components + custom components
- [x] **Unit Tests**: Jest + React Testing Library setup
- [x] **Backend Logging**: Structured logging with file output
- [x] **API Documentation**: Swagger/OpenAPI with interactive UI
- [x] **Database Migrations**: Prisma migrations for schema changes

## 🛠️ Installation & Setup

### Prerequisites
- Node.js 18+ 
- PostgreSQL
- pnpm (recommended) or npm

### 1. Clone the Repository
```bash
git clone <repository-url>
cd NoteTakerLFT
```

### 2. Install Dependencies
```bash
# Install all dependencies (frontend + backend)
pnpm install
```

### 3. Database Setup
```bash
# Navigate to backend
cd backend

# Set up your .env file
cp .env.example .env
# Edit .env with your database credentials

# Run database migrations
pnpm prisma generate
pnpm prisma db push
```

### 4. Environment Variables

#### Backend (.env)
```env
DATABASE_URL="postgresql://username:password@localhost:5432/notetakerlft?schema=public"
JWT_SECRET="your-super-secret-jwt-key"
GOOGLE_CLIENT_ID="your-google-client-id"
GOOGLE_CLIENT_SECRET="your-google-client-secret"
GOOGLE_REDIRECT_URI="http://localhost:5174/auth/google/callback"
PORT=5000
```

### 5. Start Development Servers

#### Terminal 1 - Backend
```bash
cd backend
pnpm run dev
```
Backend will run on: http://localhost:5000

#### Terminal 2 - Frontend
```bash
cd frontend
pnpm run dev
```
Frontend will run on: http://localhost:5174

## 🧪 Testing

### Frontend Tests
```bash
cd frontend
pnpm test              # Run tests
pnpm test:watch        # Run tests in watch mode
pnpm test:coverage     # Run tests with coverage
```

### Backend Tests
```bash
cd backend
pnpm test              # Run tests (when implemented)
```

## 📚 API Documentation

Once the backend is running, visit the interactive API documentation:

**Swagger UI**: http://localhost:5000/api-docs

The API documentation includes:
- All authentication endpoints
- Note CRUD operations
- Request/response schemas
- Interactive testing interface

## 🗄️ Database Schema

### Users Table
```sql
- id (UUID, Primary Key)
- email (String, Unique)
- password (String, Optional - for Google OAuth users)
- name (String, Optional)
- googleId (String, Unique, Optional)
- avatar (String, Optional)
- createdAt (DateTime)
```

### Notes Table
```sql
- id (UUID, Primary Key)
- title (String)
- content (String)
- tags (String Array)
- userId (UUID, Foreign Key)
- createdAt (DateTime)
- updatedAt (DateTime)
```

## 🔧 Available Scripts

### Frontend
```bash
pnpm dev          # Start development server
pnpm build        # Build for production
pnpm preview      # Preview production build
pnpm test         # Run tests
pnpm lint         # Run linter
```

### Backend
```bash
pnpm dev          # Start development server
pnpm build        # Build TypeScript
pnpm start        # Start production server
```

## 🌐 API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/google` - Google OAuth authentication
- `GET /api/auth/google/url` - Get Google OAuth URL

### Notes
- `GET /api/notes` - Get all notes (with pagination/filtering)
- `POST /api/notes` - Create new note
- `GET /api/notes/:id` - Get specific note
- `PUT /api/notes/:id` - Update note
- `DELETE /api/notes/:id` - Delete note
- `POST /api/notes/local` - Create local note (no auth)
- `POST /api/notes/convert-local` - Convert local notes to permanent

## 🔒 Security Features

- **JWT Authentication**: Secure token-based authentication
- **Password Hashing**: bcrypt for password security
- **Input Validation**: Zod schema validation
- **CORS Protection**: Configured for frontend domain
- **Rate Limiting**: Request size limits
- **Error Handling**: Structured error responses

## 📁 Project Structure

```
NoteTakerLFT/
├── frontend/                 # React frontend
│   ├── src/
│   │   ├── components/      # Reusable UI components
│   │   ├── pages/          # Page components
│   │   ├── hooks/          # Custom React hooks
│   │   ├── lib/            # API services
│   │   ├── types/          # TypeScript types
│   │   └── test/           # Test setup
│   └── __tests__/          # Unit tests
├── backend/                 # Node.js backend
│   ├── src/
│   │   ├── controllers/    # Route handlers
│   │   ├── middleware/     # Custom middleware
│   │   ├── routes/         # API routes
│   │   ├── config/         # Configuration files
│   │   └── lib/            # Database and utilities
│   └── prisma/             # Database schema and migrations
└── logs/                   # Application logs
```

## 🚀 Deployment

### Frontend (Vercel/Netlify)
```bash
cd frontend
pnpm build
# Deploy dist/ folder
```

### Backend (Railway/Heroku)
```bash
cd backend
pnpm build
# Deploy with environment variables
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests for new features
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

For support, please check:
1. API Documentation: http://localhost:5000/api-docs
2. Application Logs: `backend/logs/app.log`
3. Database Migrations: `backend/prisma/migrations/`

---

**Note**: This application was built as a coding assignment for Leapfrog Technologies, demonstrating full-stack development skills with modern technologies and best practices.
