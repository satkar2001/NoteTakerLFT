# NoteTakerLFT - Full-Stack Note Taking Application

A minimal but featureful Full Stack web application created using React, TypeScript, and Node.js that helps you create, organize, and manage your notes with a clean interface.

##demo:
![Demo](demo.gif)


## What It Does

This app lets you create and manage notes with user authentication and real-time synchronization. You can write, edit, and organize your notes while they sync to your account when you're logged in , so that you can access it on any of your devices.

Key features include user registration and login, a rich text editor for formatting, search functionality to find notes quickly, and a responsive design that works on both desktop and mobile devices.

## How It's Built

The frontend uses React with TypeScript, built with Vite for fast development. Tailwind CSS was used for styling along with shadcn/ui components for a consistent look.

The backend runs on Node.js with Express, using Prisma as the database ORM to connect to PostgreSQL. Authentication is handled with JWT tokens, and bcrypt for secure password hashing. The API is documented with Swagger for easy reference.

## Getting Started

You'll need Node.js 18 or higher, npm or pnpm, and access to a PostgreSQL database.

First, clone the repository and install dependencies:

```bash
git clone https://github.com/yourusername/NoteTakerLFT.git
cd NoteTakerLFT
npm install

# Install backend dependencies
cd backend
npm install

# Install frontend dependencies  
cd ../frontend
npm install
```

Set up your environment by creating a `.env` file in the backend directory:

```env
DATABASE_URL="postgresql://username:password@localhost:5432/notetaker"
JWT_SECRET="your-super-secret-jwt-key"
NODE_ENV="development"
PORT=5000
```

Initialize the database:

```bash
cd backend
npx prisma migrate dev
npx prisma generate
```

Start both the backend and frontend servers:

```bash
# Terminal 1 - Backend
cd backend
npm run dev

# Terminal 2 - Frontend
cd frontend
npm run dev
```

Open your browser to http://localhost:5173 for the app, or http://localhost:5000/api-docs to view the API documentation.

## Project Organization

The codebase is split into two main directories. The frontend contains all React components, pages, custom hooks, and TypeScript definitions. The backend houses the Express server with controllers, middleware, API routes, and database configuration.

Both parts of the application include comprehensive logging for debugging. In development, logs appear in your console, while production logs are saved to files.

## Development Commands

For the backend:
- `npm run dev` - Start development server with hot reload
- `npm run build` - Build for production
- `npm run start` - Start production server

For the frontend:
- `npm run dev` - Start development server
- `npm run build` - Create production build
- `npm run preview` - Preview the production build

