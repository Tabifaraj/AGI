# replit.md

## Overview

This is a full-stack family safety and parental control application built with React, Express, and TypeScript. The application provides an AGI (Artificial General Intelligence) Control System interface for parents to monitor and control their family's device usage, app access, and digital safety. The system includes real-time communication, voice commands, AI-powered safety recommendations, and comprehensive family member management.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **UI Library**: Radix UI components with shadcn/ui styling system
- **Styling**: Tailwind CSS with custom AGI-themed color palette
- **State Management**: TanStack React Query for server state, React hooks for local state
- **Routing**: Wouter for client-side routing
- **Real-time Communication**: WebSocket connection for live updates

### Backend Architecture
- **Runtime**: Node.js with Express.js
- **Language**: TypeScript with ES modules
- **API Design**: RESTful endpoints with WebSocket support
- **Session Management**: Express sessions with PostgreSQL storage
- **AI Integration**: OpenAI GPT-4o for voice command processing and safety recommendations

### Database Layer
- **Database**: PostgreSQL (configured for Neon serverless)
- **ORM**: Drizzle ORM with Drizzle Kit for migrations
- **Schema**: Comprehensive family safety data model with users, family members, devices, security settings, activities, and emergency events

## Key Components

### Authentication & User Management
- User registration and authentication system
- Family member profiles with role-based permissions
- Profile management with avatar support

### Device Control System
- Multi-device management (phones, tablets, computers)
- Device locking/unlocking capabilities
- Biometric authentication controls
- Real-time device status monitoring

### Parental Controls
- App access restrictions with time-based controls
- Network access management
- Contact list restrictions
- Location tracking and geofencing

### AI-Powered Features
- Voice command processing for natural language device control
- AI-generated safety recommendations
- Emergency response system with automatic lockdowns
- Intelligent activity monitoring and alerts

### Real-time Communication
- WebSocket server for instant notifications
- Live status updates across all connected clients
- Emergency alert broadcasting

## Data Flow

1. **User Interaction**: Users interact through the React frontend with voice commands or UI controls
2. **API Processing**: Express server processes requests and validates permissions
3. **AI Processing**: Voice commands are sent to OpenAI for interpretation and command extraction
4. **Database Operations**: Drizzle ORM handles all database interactions with PostgreSQL
5. **Real-time Updates**: WebSocket server broadcasts changes to all connected clients
6. **Response Delivery**: Updated data flows back through React Query to update the UI

## External Dependencies

### Core Dependencies
- **@neondatabase/serverless**: PostgreSQL serverless database connection
- **drizzle-orm**: Database ORM and query builder
- **@tanstack/react-query**: Server state management
- **openai**: AI service integration for voice commands and recommendations

### UI and Styling
- **@radix-ui/**: Comprehensive UI component primitives
- **tailwindcss**: Utility-first CSS framework
- **class-variance-authority**: Component variant management

### Development Tools
- **vite**: Frontend build tool and development server
- **tsx**: TypeScript execution for development
- **esbuild**: Production build bundling

## Deployment Strategy

### Development Environment
- Vite development server with HMR for frontend
- tsx for running TypeScript server code directly
- WebSocket server runs alongside Express server
- Replit-specific plugins for development environment integration

### Production Build
- Frontend: Vite builds optimized React bundle to `dist/public`
- Backend: esbuild bundles server code to `dist/index.js`
- Single-process deployment with Express serving both API and static files
- PostgreSQL database with Drizzle migrations

### Environment Configuration
- `DATABASE_URL`: PostgreSQL connection string (required)
- `OPENAI_API_KEY`: OpenAI API key for AI features
- `NODE_ENV`: Environment mode (development/production)

## Changelog

```
Changelog:
- July 2, 2025. Added native mobile app development with device permissions
  - Created React Native mobile app structure with native permission handling
  - Implemented real device permission requests (location, camera, microphone, contacts)
  - Added background location tracking with geofencing alerts
  - Built voice stress monitoring for bullying detection
  - Created remote device control system (lock/unlock, permissions, emergency mode)
  - Added mobile app integration page to web interface
  - Integrated WebSocket communication between mobile app and parent control system
  - Added backend APIs for mobile device management and real-time updates
- July 1, 2025. Added PostgreSQL database integration
  - Migrated from in-memory storage to persistent database
  - Created database schema with Drizzle ORM
  - Seeded database with default family data
  - Maintained all existing functionality with database persistence
- June 30, 2025. Initial setup
```

## User Preferences

```
Preferred communication style: Simple, everyday language.
```