# Resume Analyzer Application

## Overview

This is a full-stack web application that serves as an AI-powered resume analyzer. Users can upload PDF resumes to receive automated analysis and feedback. The application features two main functionalities: live resume analysis with AI-powered insights and a historical viewer for previously analyzed resumes. Built with React and Node.js, it uses Google's Gemini AI for intelligent resume evaluation and provides structured feedback including skill assessment, improvement suggestions, and numerical scoring.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React with TypeScript using Vite as the build tool
- **UI Framework**: Shadcn/ui components built on Radix UI primitives with Tailwind CSS for styling
- **State Management**: TanStack Query (React Query) for server state management and data fetching
- **Routing**: Wouter for lightweight client-side routing
- **Form Handling**: React Hook Form with Zod for validation
- **File Handling**: Native HTML5 file input with drag-and-drop support for PDF uploads

### Backend Architecture
- **Runtime**: Node.js with Express.js framework
- **Language**: TypeScript with ES modules
- **API Design**: RESTful API with JSON responses
- **File Processing**: Multer for multipart form handling, pdf-parse for PDF text extraction
- **Error Handling**: Centralized error middleware with status code management
- **Development Tools**: Vite integration for development server with hot module replacement

### Database Layer
- **ORM**: Drizzle ORM for type-safe database operations
- **Database**: PostgreSQL with Neon serverless connection pooling
- **Schema**: JSON columns for storing structured resume data (personal details, content, skills)
- **Connection**: WebSocket-based connection for serverless environments

### AI Integration
- **Provider**: Google Gemini AI for resume analysis
- **Functionality**: Structured data extraction, skill categorization, performance scoring, and improvement recommendations
- **Data Processing**: PDF text extraction followed by AI-powered analysis with structured JSON output

### Authentication & Session Management
- **Session Storage**: PostgreSQL-based session store using connect-pg-simple
- **User Management**: Basic user authentication system with password hashing

## External Dependencies

### Core Technologies
- **Database**: PostgreSQL (configured for Neon serverless)
- **AI Service**: Google Gemini API for resume analysis
- **File Processing**: PDF parsing capabilities through pdf-parse library

### Development & Deployment
- **Build System**: Vite for frontend bundling and development server
- **Runtime Environment**: Node.js with TypeScript compilation via tsx
- **Package Management**: npm with lockfile for dependency management
- **Development Tools**: Replit integration with live development features

### UI & Styling
- **Component Library**: Radix UI primitives for accessible components
- **Styling**: Tailwind CSS with CSS variables for theming
- **Icons**: Lucide React for consistent iconography
- **Fonts**: Google Fonts integration (Open Sans, Georgia, Menlo)

### Data & API Layer
- **HTTP Client**: Native fetch API with TanStack Query for caching and state management
- **Validation**: Zod for runtime type checking and validation
- **Database Migrations**: Drizzle Kit for schema management and migrations