# NoteTakerLFT

A modern full-stack note-taking application that helps you capture, organize, and manage your thoughts with a clean and intuitive interface. Built with React, TypeScript, and Node.js, this app provides both online and offline note-taking capabilities.

## Live Demo

![Demo](/frontend/public/demo.gif)

**Try it live:** https://notetaker-backend-jpgb.onrender.com

**API Documentation:** https://notetaker-backend-jpgb.onrender.com/api-docs/

## What This App Does

NoteTakerLFT is designed to be your personal digital notebook that works everywhere. You can create and edit notes even without an internet connection, and when you sign up for an account, all your notes sync seamlessly across your devices. The app automatically saves your work as you type, so you never lose your thoughts.

Whether you're jotting down quick ideas, writing detailed project plans, or organizing your daily tasks, this app adapts to your workflow with powerful search capabilities and flexible organization features.

## Key Features

**User Authentication & Account Management**
- Secure user registration and login using JWT tokens and bcrypt password hashing
- Password reset functionality with email-based OTP verification using Nodemailer
- Google OAuth integration for quick sign-in
- User profile management with customizable settings

**Note Creation & Management**
- Rich text editor powered by TipTap with formatting options like bold, italic, headers, and lists
- Auto-save functionality that saves your work as you type
- Drag-and-drop note organization with intuitive controls
- Note tagging system for better categorization

**Search & Discovery**
- Real-time search across all notes using fuzzy matching algorithms
- Advanced filtering options by tags, favorites, and creation date
- Sort notes by various criteria including date, alphabetical, and custom order
- Quick access to recently edited notes

**Offline Capability**
- Local storage integration that works without internet connection
- Automatic sync when you go online and create an account
- Progressive Web App (PWA) features for mobile installation
- Seamless transition between offline and online modes

**User Experience**
- Responsive design built with Tailwind CSS and shadcn/ui components
- Dark and light theme support with system preference detection
- Mobile-first design that works perfectly on phones, tablets, and desktops
- Keyboard shortcuts for power users

**Technical Features**
- RESTful API design with comprehensive Swagger documentation
- PostgreSQL database with Prisma ORM for reliable data management
- Email service integration supporting both Gmail and Resend
- Comprehensive error handling and logging throughout the application
- Type-safe development with TypeScript on both frontend and backend

## Technical Architecture

![Architecture](/frontend/public/architecture.png)

The application follows a modern full-stack architecture with clear separation of concerns. The frontend is a React single-page application that communicates with a Node.js REST API. User data is stored in PostgreSQL, with local browser storage providing offline functionality.

**Frontend Stack:**
- React 18 with TypeScript for type-safe component development
- Vite for fast development and optimized production builds
- Tailwind CSS for utility-first styling
- shadcn/ui for consistent, accessible component library
- TipTap editor for rich text editing capabilities
- Axios for HTTP client with interceptors

**Backend Stack:**
- Node.js with Express framework for the REST API
- Prisma ORM for database operations and migrations
- PostgreSQL for reliable data persistence
- JWT for stateless authentication
- bcrypt for secure password hashing
- Nodemailer for email functionality
- Swagger/OpenAPI for API documentation

## Getting Started

### Prerequisites

Before setting up the application, you'll need:

- Node.js 18 or higher
- npm or pnpm package manager
- PostgreSQL database (local or cloud-hosted like Supabase, Railway, or Neon)

### Required Accounts & API Keys

To run the full application, you'll need to set up:

**Database:**
- PostgreSQL database URL (you can use free tiers from Supabase, Railway, or Neon)

**Email Service (for password reset):**
- Gmail account with App Password enabled, OR
- Resend account with API key

**Optional:**
- Google OAuth credentials for social login

### Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/NoteTakerLFT.git
cd NoteTakerLFT
```

2. Install dependencies for the entire project:
```bash
npm install
```

3. Set up the backend and frontend environments by following the detailed setup instructions:
   - **Backend setup:** See `backend/README.md` for environment variables and database configuration
   - **Frontend setup:** See `frontend/README.md` for environment configuration

4. Both README files contain step-by-step instructions for setting up the development environment, configuring environment variables, and running the application locally.

## Project Structure

The codebase is organized into two main parts:

**Frontend (`/frontend`)**
- React components organized by feature and reusability
- Custom hooks for state management and API calls
- TypeScript interfaces and types for type safety
- Utility functions for common operations

**Backend (`/backend`)**
- Express routes organized by feature areas
- Database models and Prisma schema definitions
- Authentication middleware and security utilities
- Email services and external integrations

**Shared Configuration**
- Workspace configuration for monorepo management
- Shared development tools and linting rules
- Documentation and deployment configurations

## Development Workflow

This project uses a monorepo structure with npm workspaces. You can run commands for both frontend and backend from the root directory, or work on each part independently. The development servers support hot reloading, so changes are reflected immediately as you code.

The application includes comprehensive logging and error handling to help with debugging during development. API endpoints are thoroughly documented with Swagger, making it easy to understand and test the backend functionality.

## Contributing

Feel free to contribute to this project by submitting issues, feature requests, or pull requests. The codebase follows modern development practices with TypeScript for type safety, ESLint for code quality, and clear component organization.

