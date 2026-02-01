# 📚 IELTS Booster - AI-Powered IELTS Practice Platform

An intelligent IELTS preparation platform featuring AI-powered scoring, real-time feedback, and comprehensive practice modules for all four IELTS sections.

## 🎯 Project Overview

IELTS Booster is a full-stack web application designed to help students achieve their target IELTS band scores through:
- **AI-Powered Scoring**: Automated essay and speaking evaluation
- **Comprehensive Practice**: All 4 IELTS modules (Reading, Writing, Listening, Speaking)
- **Real-time Feedback**: Instant performance insights and improvement suggestions
- **Progress Tracking**: Detailed analytics and score history
- **Study Material**: List of necessary materials for IELTS
- **Individual Project** | Full-stack Project | 2025-2026

---

## ✨ Features

### ✅ Sprint 2 - Complete Authentication System + Database Integration
-  User signup with validation (8+ chars, uppercase, number, special char)
-  User login with NextAuth.js JWT sessions
-  Password hashing with bcryptjs (12 rounds)
-  Session management with secure httpOnly cookies
-  Route protection via middleware
Pages & UI:
- Landing page (Hero, Features, CTA, Footer)
- Login page with social auth placeholders
- Signup page with real-time password validation
- Dashboard with user session and stats
- Responsive design (mobile + desktop)
![LoginPage](./docs/screenshots/login-page.png)
![SignUpPage](./docs/screenshots/sign-up-page.png)
![LandingPage](./docs/screenshots/landing-page1.png)
![LandingPage](./docs/screenshots/landing-page.png)

Database Integration:
- PostgreSQL connection via Supabase
- Prisma ORM with complete schema
- User model with profile tracking
- Test, Score, Progress, StudyGoal models
- NextAuth session storage in database

Components Created:
- Layout: Header, Footer, Container
- Sections: Hero, Features, CTA
- UI: Button, Input, PasswordInput, Alert, Card
- Auth: LoginForm, SignupForm, SocialLogin
- Providers: ClientProviders (SessionProvider wrapper)

Security Implementations:
- Input sanitization (XSS prevention)
- Password validation (client + server)
- Rate limiting on API routes
- SQL injection prevention (Prisma ORM)
- Environment variables for secrets
- Security headers in responses
- Protected API routes with session checks

### 🚧 In Progress
- 📊 Dashboard with performance analytics
- ✍️ Writing module with AI scoring
- 📖 Reading comprehension tests
- 🎧 Listening practice with audio
- 🗣️ Speaking module with Whisper AI transcription

---

## 🛠️ Tech Stack

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