IELTS Booster - AI-Powered IELTS Practice Platform

A full-stack IELTS preparation platform with AI-powered scoring and practice modules for all four IELTS skills. Individual project, 2025-2026.

Tech Stack: Next.js 15, React 19, Tailwind CSS, MUI, Prisma ORM, PostgreSQL (Supabase), NextAuth.js, Python FastAPI (AI service), Docker

---

Infrastructure

Local development uses Docker Compose with three services alongside the Next.js dev server: PostgreSQL for the database, Redis for caching and rate limiting, and a Python FastAPI service for AI workloads. The AI service runs Whisper for speech-to-text and calls the Claude API for writing and speaking scoring. A production Dockerfile is included using Next.js standalone output.

---

Completed

Authentication: registration, login, NextAuth.js sessions, role-based access (user / admin), bcrypt password hashing, security headers, rate limiting, protected API routes

Exam Library: filterable and searchable grid by skill, difficulty, and duration; SortDropdown component; pagination

Pre-Exam Page: per-skill part selection, timed vs practice mode toggle, expected duration counter

Reading Module: split-panel with drag resizer, full IELTS question type support, timer, question flagging, answered/unanswered pill footer

Listening Module: same split-panel layout as Reading, integrated audio player per section, all listening question types

Writing Module: split-panel with task prompt card, image visual support (charts, maps, diagrams), live word count editor with minimum threshold, Task 1 / Task 2 footer pills

Speaking Module: microphone test screen with live waveform, question card, transcript box, animated record button with countdown and auto-submit, Part 1 / 2 / 3 structure with correct time limits

Admin Exam Builder: form-based exam creation for all four skills replacing raw JSON upload, passage and question group editors, preview modal before saving, Zod validation

AI Service: Whisper transcription endpoint, Claude writing scoring endpoint, Claude speaking scoring endpoint

---

Next Sprint

- Wire Speaking audio output to the Whisper transcription proxy and stream results to the transcript box
- Post-exam results page with band score, feedback, strengths and improvements
- Connect Writing and Speaking submissions to Claude scoring
- Dashboard analytics: band score history, skill breakdown, study goal progress
- Redis session caching and rate limiting middleware
- Upload real exam content for all four skills via the admin builder
