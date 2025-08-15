# NoteTakerLFT

A minimal but feature-rich and elegant full-stack note-taking application that helps you create, organize, and manage your notes with a clean and intuitive interface. Built with React, TypeScript, and Node.js(Express).

## Live Demo

![Demo](/frontend/public/Notedemo.gif)

**Try it live:** https://notetaker-frontend.onrender.com/

**API Documentation:** https://notetaker-backend-jpgb.onrender.com/api-docs/#/

![APIDocumentation](/frontend/public/swagger.png)

### Mobile View
![Mobileview](/frontend/public/mobileview.png)


## What This App Does

NoteTakerLFT is a personal notetaking application that you can use on any platform(Mobile/PC). You can create, edit, save, and organize your notes by favorites , categories etc and also sort them according to created date, albhabetical order etc.
The best part? You don't need to sign up to start using it. Your notes are saved in your browser until you clear the cache. When you do create an account later, all your previous notes will automatically transfer over and be saved permanently so you never lose anything you've written.

## Key Features

**User Authentication & Account Management**
- Secure user registration and login using JWT tokens and bcrypt password hashing
- Password reset functionality with email-based OTP verification using Nodemailer

**Note Creation & Management**
- Simple text editor 
- Note tagging/category system for categorization

**Search & Discovery**
- Searching across notes by title, content and tags.
- Sort notes by various criteria including date, updated time and alphabetical order.

**Note saving**
- Local storage integration to allow saving notes without logging in.

**User Experience**
- Responsive design built with Tailwind CSS and shadcn/ui components

**Logging**
- logging feature implemented for backend logs using app.log file for local and on render console after deployment. 

**Technical Features**
- RESTful API design with Swagger documentation
- PostgreSQL database with Prisma ORM 
- Email service integration supporting Gmail
- Comprehensive error handling and logging throughout the application
- Type safe development with TypeScript on both frontend and backend

## Technical Architecture

![Architecture](/frontend/public/architecture.png)

The diagram was created using eraser.io . Visit my workspace :https://app.eraser.io/workspace/KLlaKIo1nF7zZjHwTJC6?origin=share 

The application follows a full-stack architecture. The frontend is a single page React application that communicates with a Node.js backend. User data is stored in PostgreSQL, and localStorage is also used for offline note saving etc.

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
- Swagger for API documentation

## Getting Started

### Prerequisites

Before setting up the application, you'll need:

- Node.js 18+
- npm or pnpm package manager
- PostgreSQL database (local or hosted)

### Required Accounts & API Keys

To run the full application, you'll need to set up:

**Database:**
- PostgreSQL database URL (you can setup using PGAdmin on local machine)

**Email Service (for password reset):**
- Gmail account with App Password from gmail settings.

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

**Frontend**
- React components organized by feature and reusability
- Hooks for state management and API calls
- TypeScript interfaces and types for type safety
- Utility functions for common operations

**Backend**
- Express routes organized by feature areas
- Database models and Prisma schema definitions
- Authentication middleware
- External integrations

## Workflow

This project uses a monorepo structure which means both frontend and backend are inside the same repo though they are deployed differently. You can run commands for both frontend and backend from the root directory, or work on each part independently.
The application includes logging and error handling to help with debugging during development. API endpoints are thoroughly documented with Swagger, making it easy to understand and test the backend functionality.


