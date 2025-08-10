# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

- `npm run dev` - Start development server with Turbopack (faster builds)
- `npm run dev:prod-api` - Start development server with production API environment
- `npm run build` - Build the application for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint to check code quality

## Architecture Overview

This is a Next.js 15 application built for an exam question bank system. The app follows a modern React architecture with these key components:

### Tech Stack
- **Framework**: Next.js 15 with App Router
- **UI Components**: Radix UI primitives with custom components
- **Styling**: Tailwind CSS v4
- **State Management**: Redux Toolkit for global state, React Query for server state
- **Authentication**: Clerk
- **Rich Text**: TipTap editor for question content
- **Form Handling**: React Hook Form with Zod validation

### Project Structure

**State Management**:
- `rtk/` - Redux Toolkit store and slices for client state (questions, filters, class/subject selection)
- `react-query-hooks/` - TanStack Query hooks for server state management and API calls
- Uses dual state approach: Redux for UI state, React Query for server data

**API Integration**:
- `config/api.ts` - Centralized API endpoint configuration supporting environment-based URLs
- `api-handler/` - API service functions for questions and exam papers
- Environment variables: `NEXT_PUBLIC_API_BASE_URL` (defaults to localhost:8000/local)

**Component Organization**:
- `components/ui/` - Reusable UI primitives (buttons, forms, dialogs)
- `components/common/` - Shared business components (text editor, image viewer, selectors)
- `components/questions/` - Question-specific components (cards, filters, forms)
- `components/exam-papers/` - Exam paper management components

**Application Routes**:
- `/questions` - Question management (list, create, filter)
- `/exam-papers` - Exam paper management with detailed views
- `/dashboard` - Main dashboard view
- Dynamic routes use Next.js App Router conventions

### Key Features

**Question Management**:
- Rich text editor with image support (TipTap)
- Advanced filtering by class, subject, topic, difficulty
- File uploads via S3 presigned URLs
- Question type support (MCQ, descriptive, etc.)

**Exam Paper Management**:
- Paper creation with question selection
- Detailed view with full question information
- Export capabilities to various formats

**Data Flow**:
- React Query handles all server state with 1-minute stale time
- Redux manages UI state like active filters and selections
- Clerk provides authentication context throughout the app
- API calls are authenticated and centrally configured

The application uses a sidebar navigation layout with responsive design and follows modern React patterns with TypeScript support throughout.