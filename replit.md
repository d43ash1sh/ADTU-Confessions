# Overview

This is a full-stack confession website for Assam Down Town University (ADTU) built with Express.js backend, React frontend, and PostgreSQL database. The application allows users to submit anonymous confessions that go through admin approval before being published to a public feed. Users can react to approved confessions with emoji reactions, and administrators can manage pending submissions through a dedicated admin panel.

# User Preferences

Preferred communication style: Simple, everyday language.

# System Architecture

## Frontend Architecture
- **React with TypeScript**: Modern component-based UI using functional components and hooks
- **Wouter**: Lightweight client-side routing replacing React Router for better performance
- **TanStack Query**: Server state management, caching, and data synchronization
- **Vite**: Fast build tool and development server with hot module replacement
- **Tailwind CSS + shadcn/ui**: Utility-first styling with pre-built accessible component library
- **Theme System**: Dark/light mode support with system preference detection

## Backend Architecture
- **Express.js**: RESTful API server with middleware-based request handling
- **TypeScript**: Full type safety across server-side code
- **Drizzle ORM**: Type-safe database queries with PostgreSQL dialect
- **JWT Authentication**: Token-based admin authentication system
- **bcrypt**: Password hashing for secure admin credential storage

## Database Design
- **PostgreSQL**: Primary database with Neon serverless hosting
- **Drizzle Schema**: Type-safe schema definitions with enums for status and categories
- **Tables**: 
  - `confessions`: Stores confession text, category, approval status, reactions, and display IDs
  - `admins`: Stores admin credentials with hashed passwords
- **Status Flow**: Confessions start as 'pending', then move to 'approved' or 'rejected'

## API Architecture
- **RESTful Endpoints**: 
  - `GET /api/confessions` - Fetch approved confessions with filtering
  - `POST /api/confessions` - Submit new confessions
  - `PATCH /api/confessions/:id/reactions` - Update reaction counts
  - `POST /api/admin/login` - Admin authentication
  - `GET /api/admin/confessions` - Fetch pending confessions (auth required)
  - `PATCH /api/admin/confessions/:id/status` - Approve/reject confessions
- **Middleware**: Request logging, JSON parsing, error handling, and JWT verification

## Authentication & Authorization
- **Admin-Only Access**: Simple username/password system for admin panel
- **JWT Tokens**: Stateless authentication stored in localStorage
- **Environment Variables**: Admin credentials configurable via environment
- **Route Protection**: Middleware validates admin tokens for protected endpoints

## State Management
- **TanStack Query**: Handles server state, caching, and optimistic updates
- **Local State**: React hooks for component-level state management
- **Form Handling**: React Hook Form with Zod validation schemas
- **Theme Context**: React context for theme persistence and switching

# External Dependencies

## Database Services
- **Neon Database**: Serverless PostgreSQL hosting with connection pooling
- **Drizzle Kit**: Database migrations and schema management tools

## UI Components & Styling
- **Radix UI**: Headless accessible component primitives
- **Tailwind CSS**: Utility-first CSS framework with custom design system
- **Lucide React**: Consistent icon library with tree-shaking support
- **Google Fonts**: Inter font family for typography

## Development Tools
- **Vite**: Build tooling with plugin ecosystem for React and TypeScript
- **ESBuild**: Fast JavaScript bundler for production builds
- **PostCSS**: CSS processing with Tailwind and Autoprefixer plugins

## Authentication & Security
- **bcryptjs**: Password hashing with configurable salt rounds
- **jsonwebtoken**: JWT token generation and verification
- **Zod**: Runtime type validation for API inputs and forms

## Form Management
- **React Hook Form**: Performant form handling with minimal re-renders
- **Hookform Resolvers**: Zod integration for form validation schemas

The application follows a traditional three-tier architecture with clear separation between presentation (React), business logic (Express API), and data persistence (PostgreSQL). The system is designed for deployment on platforms like Vercel with serverless PostgreSQL hosting.