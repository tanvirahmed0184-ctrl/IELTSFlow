# IELTS Flow - AI-Powered IELTS Mock Test Platform

A production-ready web platform for IELTS candidates to practice and take mock tests, featuring AI-predicted band scores, AI speaking interviews, and instructor-led sessions.

## Tech Stack

- **Framework**: Next.js 16+ (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS + shadcn/ui
- **Database**: Supabase (PostgreSQL) + Prisma ORM
- **Vector DB**: pgvector (via Supabase)
- **Cache/Queue**: Upstash Redis + BullMQ
- **Payments**: Stripe (test mode)
- **AI**: Google Gemini API
- **Voice**: Web Speech API + Groq Whisper

## Getting Started

```bash
# Install dependencies
npm install

# Copy environment variables
cp .env .env.local
# Fill in your API keys in .env.local

# Run development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
├── app/                     # Next.js App Router
│   ├── (marketing)/         # Public website pages
│   ├── (auth)/              # Authentication pages
│   ├── dashboard/           # Student, Instructor, Admin dashboards
│   ├── test-engine/         # IELTS exam engine
│   └── api/                 # API routes
├── components/              # UI components
├── features/                # Feature modules
├── lib/                     # Core logic & utilities
├── ai/                      # AI evaluation pipelines
├── ingestion/               # RAG resource pipeline
├── workers/                 # Background job processors
├── hooks/                   # React hooks
├── utils/                   # Utility functions
├── prisma/                  # Database schema & migrations
├── scripts/                 # CLI scripts
├── docker/                  # Docker configuration
└── tests/                   # Automated tests
```

## User Roles

- **Guest** - Browse public pages
- **Student** - Take tests, view scores, track progress
- **Instructor** - Manage availability, conduct speaking sessions
- **Admin** - Upload resources, generate tests, manage users
- **Super Admin** - Full platform control
