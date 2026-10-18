# Examsharp - Intelligent Exam Preparation Platform

A comprehensive exam preparation platform built with React, Next.js, and TypeScript. Features real exam papers, detailed answer explanations, progress tracking, and group exam functionality.

## Features

### Authentication & User Management
- Sign up and sign in pages with form validation
- User profile with plan information (Free/Pro)
- Session management using Zustand store with localStorage persistence

### Dashboard
- Personalized welcome message
- **Progress Statistics**:
  - Exams completed counter
  - Average accuracy percentage
  - Highest score tracking
  - Current streak indicator
- Grade-based exam filtering (All Grades, Grade 9, Grade 10, Grade 12)
- Exam cards showing difficulty, duration, question count, and best scores
- Responsive grid layout (1 column mobile, 2 columns tablet, 3 columns desktop)

### Exam Taking
- Full-featured exam interface with:
  - Multiple choice questions with visual selection
  - Real-time countdown timer with color-coded warning
  - Progress bar showing exam completion
  - Navigation between questions
  - Auto-submit on time expiration
- Detailed answer review after completion
- Score calculation with percentage and accuracy metrics

### Answer Review & Explanations
- Comprehensive review page showing:
  - Correct answer for each question
  - User's selected answer
  - Detailed explanation for why the answer is correct
  - Line-by-line explanation for each option (why each is right/wrong)
  - Visual indicators for correct/incorrect answers
  - Expandable sections for detailed analysis

### Pricing & Upgrade System
- **Free Plan**:
  - 5 exams per month
  - Basic answer review
  - Progress tracking
- **Pro Plan**:
  - Unlimited exams
  - Group exams with leaderboard
  - Detailed answer explanations
  - Priority support
  - Progress analytics
- Prominent upgrade CTA on dashboard
- One-click upgrade functionality

### Group Exams (Pro Feature)
- Create group exams with unique invite codes
- Join group exams using codes
- Real-time participant list
- Score tracking for all participants
- Leaderboard functionality

## Tech Stack

- **Frontend**: React 19, Next.js 16 (App Router)
- **Styling**: Tailwind CSS v4
- **State Management**: Zustand with localStorage persistence
- **Icons**: Lucide React
- **UUID Generation**: uuid library
- **Type Safety**: TypeScript

## Project Structure

```
examsharp/
├── app/
│   ├── dashboard/
│   │   └── page.tsx          # Main student dashboard
│   ├── exam/
│   │   └── [id]/
│   │       └── page.tsx      # Exam taking interface
│   ├── sign-in/
│   │   └── page.tsx          # Sign in page
│   ├── sign-up/
│   │   └── page.tsx          # Sign up page
│   ├── layout.tsx            # Root layout
│   └── page.tsx              # Landing page
├── components/
│   ├── dashboard-header.tsx  # Header with user info
│   ├── exam-review.tsx       # Answer review component
│   ├── group-exam.tsx        # Group exam interface
│   ├── pricing-card.tsx      # Upgrade CTA card
│   ├── progress-stats.tsx    # Progress statistics display
│   └── ui/
│       └── button.tsx        # Reusable button component
├── lib/
│   ├── auth-store.ts         # Authentication state management
│   ├── exam-store.ts         # Exam data and functionality
│   └── utils.ts              # Utility functions
└── public/                   # Static assets
```

## Key Components

### Auth Store (lib/auth-store.ts)
Manages user authentication with:
- Login/signup functionality
- Plan management (free/pro)
- User session persistence

### Exam Store (lib/exam-store.ts)
Handles all exam-related data:
- Exam papers with questions and explanations
- Exam attempts and scoring
- Group exam management
- User progress tracking

### Dashboard Page (app/dashboard/page.tsx)
The main hub featuring:
- Welcome greeting
- Progress statistics
- Pricing upgrade card
- Exam listing with filters
- Grade-based filtering

### Exam Page (app/exam/[id]/page.tsx)
Complete exam interface with:
- Question navigation
- Timer functionality
- Answer selection
- Results page with score breakdown
- Answer review option

### Exam Review Component (components/exam-review.tsx)
Detailed answer analysis showing:
- All questions with answers marked correct/incorrect
- Full explanations for correct answers
- Why each option matters
- Expandable Q&A sections

## Design System

### Color Palette
- **Primary**: Educational blue (#5169D9)
- **Background**: Off-white (#FAFAF9)
- **Border**: Light gray (#E4E4E3)
- **Text**: Dark gray (#201D1D)
- **Accents**: Green (Easy), Amber (Medium), Red (Hard)

### Typography
- Headers: Geist font family
- Body: Geist font family
- Semantic sizing with proper contrast

### Layout Philosophy
- Mobile-first responsive design
- Flexbox for most layouts
- CSS Grid for complex 2D layouts
- Generous whitespace and breathing room
- Clear visual hierarchy

## Getting Started

### Installation
```bash
npm install
# or
pnpm install
```

### Running Development Server
```bash
npm run dev
# or
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) to view the app.

### Demo Credentials
- Email: any@email.com
- Password: any password

## Data Persistence

All user data is stored using Zustand's localStorage middleware:
- User authentication persists across sessions
- Exam attempts and scores are saved
- Progress statistics update in real-time
- Group exam participation is tracked

## Limited Demo Features

Currently, detailed questions are included for:
1. **Algebra Fundamentals** (Grade 9) - 2 questions with full explanations
2. **Physics Basics** (Grade 10) - 1 question with full explanations

Other exams display "Limited Demo" state to show the full range of available content in production.

## Future Enhancements

- Backend API integration with database
- Real-time group exam leaderboards
- Advanced analytics and insights
- Adaptive difficulty based on performance
- Mock test schedules
- Performance trend graphs
- PDF export of results
- Mobile app

## Browser Support

- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)
- Mobile browsers (iOS Safari, Chrome Mobile)

---

Built with love for students preparing for exams.

## Setup
Copy `.env.example` to `.env.local` and fill in your Supabase URL and anon key. Run `npm install` then `npm run dev`.
