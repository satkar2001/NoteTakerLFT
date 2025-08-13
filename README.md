# 📝 NoteTaker - Full-Stack Note Management Application

A modern, responsive note-taking application built with React, TypeScript, and Node.js. Features user authentication, real-time note management, and a clean, intuitive interface.

## ✨ Features

- **User Authentication**: Secure email/password registration and login
- **Note Management**: Create, edit, delete, and organize notes
- **Rich Text Editor**: Full-featured editor with formatting options
- **Search & Filter**: Find notes quickly with search and tag filtering
- **Responsive Design**: Works seamlessly on desktop and mobile
- **Offline Support**: Notes are saved locally when not authenticated
- **Real-time Sync**: Notes sync across devices when logged in

## 🏗️ Architecture

### Frontend (React + TypeScript)
- **React 18** with functional components and hooks
- **TypeScript** for type safety and better development experience
- **Vite** for fast development and optimized builds
- **Tailwind CSS** for styling with shadcn/ui components
- **React Router** for client-side routing
- **Local Storage** for offline note persistence

### Backend (Node.js + Express)
- **Express.js** REST API with TypeScript
- **Prisma ORM** for database operations
- **PostgreSQL** for data persistence
- **JWT** for secure authentication
- **Swagger** for API documentation
- **Winston** for structured logging

### Database
- **PostgreSQL** hosted on Render
- **Prisma Migrations** for schema management
- **User and Note models** with proper relationships

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- npm or pnpm
- PostgreSQL database

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/NoteTakerLFT.git
   cd NoteTakerLFT
   ```

2. **Install dependencies**
   ```bash
   # Install root dependencies
   npm install
   
   # Install backend dependencies
   cd backend
   npm install
   
   # Install frontend dependencies
   cd ../frontend
   npm install
   ```

3. **Set up environment variables**
   
   Create `.env` file in the `backend` directory:
   ```env
   DATABASE_URL="postgresql://username:password@localhost:5432/notetaker"
   JWT_SECRET="your-super-secret-jwt-key"
   NODE_ENV="development"
   PORT=5000
   ```

4. **Set up the database**
   ```bash
   cd backend
   npx prisma migrate dev
   npx prisma generate
   ```

5. **Run the application**
   ```bash
   # Terminal 1 - Start backend
   cd backend
   npm run dev
   
   # Terminal 2 - Start frontend
   cd frontend
   npm run dev
   ```

6. **Open your browser**
   - Frontend: http://localhost:5173
   - Backend API: http://localhost:5000
   - API Docs: http://localhost:5000/api-docs

## 📚 Key Libraries & Technologies

### Frontend
- **React 18**: UI framework with hooks
- **TypeScript**: Type-safe JavaScript
- **Vite**: Build tool and dev server
- **Tailwind CSS**: Utility-first CSS framework
- **shadcn/ui**: Reusable component library
- **React Router**: Client-side routing
- **Lucide React**: Icon library

### Backend
- **Express.js**: Web framework
- **Prisma**: Database ORM
- **PostgreSQL**: Relational database
- **JWT**: Authentication tokens
- **bcrypt**: Password hashing
- **Winston**: Logging library
- **Swagger**: API documentation

### Development Tools
- **ESLint**: Code linting
- **TypeScript**: Static type checking
- **Prisma Studio**: Database GUI
- **Render**: Deployment platform

## 🔧 Development

### Project Structure
```
NoteTakerLFT/
├── frontend/                 # React frontend
│   ├── src/
│   │   ├── components/      # Reusable UI components
│   │   ├── pages/          # Page components
│   │   ├── lib/            # Utility functions
│   │   ├── hooks/          # Custom React hooks
│   │   └── types/          # TypeScript type definitions
│   └── public/             # Static assets
├── backend/                 # Express backend
│   ├── src/
│   │   ├── controllers/    # Request handlers
│   │   ├── middleware/     # Express middleware
│   │   ├── routes/         # API routes
│   │   ├── lib/            # Database and utilities
│   │   └── config/         # Configuration files
│   └── prisma/             # Database schema and migrations
└── README.md
```

### Available Scripts

**Backend:**
```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run migrate      # Run database migrations
```

**Frontend:**
```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run preview      # Preview production build
```

## 📊 Logging

The backend implements comprehensive logging using Winston:

- **Request Logging**: All HTTP requests are logged with method, URL, status, and duration
- **Error Logging**: Detailed error logs with stack traces
- **Database Logging**: Connection status and query errors
- **Authentication Logging**: Login attempts and failures

**View logs:**
- **Development**: Logs appear in the console
- **Production**: Logs are written to `backend/logs/app.log`
