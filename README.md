#  IELTS Booster - AI-Powered IELTS Practice Platform

An intelligent IELTS preparation platform featuring AI-powered scoring, real-time feedback, and comprehensive practice modules for all four IELTS sections.

## Project Overview

IELTS Booster is a full-stack web application designed to help students achieve their target IELTS band scores through:
- **AI-Powered Scoring**: Automated essay and speaking evaluation
- **Comprehensive Practice**: All 4 IELTS modules (Reading, Writing, Listening, Speaking)
- **Real-time Feedback**: Instant performance insights and improvement suggestions
- **Progress Tracking**: Detailed analytics and score history
- **Study Material**: List of necessary materials for IELTS
- **Individual Project** | Full-stack Project | 2025-2026

---

## New Features 
Exam Library:
- Filterable and searchable test grid with tab categories
- Sort by recency, difficulty and duration
- Custom SortDropdown UI component shared across pages

Pre-Exam Page (`/exam-library/[testId]`):
- Per-skill selectable sub-parts (Listening sections, Reading passages, Writing tasks, Speaking parts)
- Full IELTS general test with 4 top-level sections
- Timed vs Practice mode toggle
- Live expected duration counter
- Split into focused components: TestInfoCard, TestPartsList, TestModeSelector, InstructionsCard, ExamCTA

Study Materials Page (`/material`):
- Sidebar filters: category, difficulty level, file format
- Material cards with real thumbnail images, star ratings, hover overlays
- Shared SortDropdown for consistent UX across pages
- Pagination reused from Exam Library

TypeScript Migration:
- Full codebase migrated from JavaScript (.jsx/.js) to TypeScript (.tsx/.ts)
- Strict typing across all components, API routes, services and shared utilities

Security:
- Password hashing with bcryptjs (12 rounds)
- Input sanitization
- Rate limiting
- SQL injection prevention (Prisma ORM)
- Protected API routes
- Environment variables secured

![LoginPage](./docs/screenshots/login-page.png)
![SignUpPage](./docs/screenshots/sign-up-page.png)
![LandingPage](./docs/screenshots/landing-page1.png)
![LandingPage](./docs/screenshots/landing-page.png)
![DashboardPage](./docs/screenshots/dashboard-page.png)

##  Tech Stack

### Frontend
- **Framework**: Next.js 15 (App Router)
- **Styling**: Tailwind CSS
- **UI Components**: Custom component library, MUI
- **State Management**: React Hooks

### Backend (Planed)
- **Authentication**: NextAuth.js v5
- **Database**: Prisma ORM with SQLite (dev) / PostgreSQL (production)
- **Password Security**: bcrypt
- **API**: Next.js API Routes

### AI Integration (Planned)
- **Essay Scoring**: OpenAI GPT-4 / Claude API
- **Speech-to-Text**: OpenAI Whisper API
- **Feedback Generation**: Custom prompts with LLM
