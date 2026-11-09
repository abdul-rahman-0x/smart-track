<div align="center">
  <a href="https://smart-track-hub.vercel.app">
    <img src="app/icon.svg" alt="Smart Track Logo" width="72" height="72" />
  </a>

  <h1>SMART TRACK</h1>

  <p><strong>A focused productivity workspace combining task management, daily habit streaks, and academic planning into one fast, distraction-free app.</strong></p>

  <p>
    <a href="https://smart-track-hub.vercel.app"><strong>Explore Live App →</strong></a>
  </p>

  <p>
    <img src="https://img.shields.io/badge/Next.js-16-%23000000?style=flat&logo=nextdotjs&logoColor=white" alt="Next.js 16" />
    <img src="https://img.shields.io/badge/React-19-%2361DAFB?style=flat&logo=react&logoColor=black" alt="React 19" />
    <img src="https://img.shields.io/badge/TypeScript-Strict-%233178C6?style=flat&logo=typescript&logoColor=white" alt="TypeScript" />
    <img src="https://img.shields.io/badge/Drizzle_ORM-Neon_Postgres-%23C5F74F?style=flat&logo=drizzle&logoColor=black" alt="Drizzle ORM" />
    <img src="https://img.shields.io/badge/Stripe-Billing-%23635BFF?style=flat&logo=stripe&logoColor=white" alt="Stripe" />
    <img src="https://img.shields.io/badge/Bun-Runtime-%23FBF0DF?style=flat&logo=bun&logoColor=black" alt="Bun" />
  </p>
</div>

---

## Table of Contents

- [Overview](#overview)
- [Key Features](#key-features)
- [Engineering Highlights](#engineering-highlights)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [License](#license)
- [Author](#author)

---

## Overview

Most people juggle three or four different applications just to get through a normal week: a simple to-do list for errands, a separate mobile app for habits, an academic calendar for deadlines, and spreadsheets for monthly expenses.

**Smart Track** eliminates that fragmentation. It brings planning, daily habit tracking, and goal execution into a single, cohesive dashboard designed for students, developers, and independent creators who value consistency over complicated setup.

---

## Key Features

- **Daily Task Planner**: Organize priorities, set deadlines, and manage progress with optimistic UI updates that keep interactions feeling instant.
- **Habit & Streak Engine**: Log daily habits with automated streak calculations and historical consistency views to build long-term routines.
- **Academic & Project Timelines**: Plan assignments, study blocks, and coding milestones in a unified schedule view.
- **Subscription Management**: Track personal recurring service costs alongside platform tier upgrades powered by Stripe Checkout.
- **Analytics Dashboard**: Get a clear visual breakdown of your daily completion rates and weekly focus trends without clutter or lag.

---

## Engineering Highlights

- **Idempotent Webhook Processing**: Stripe billing events are verified through cryptographic signatures and logged with an idempotency check, ensuring duplicate network deliveries never trigger double-writes or corrupt user tiers.
- **Atomic Database Transactions**: Subscription tier mutations and quota adjustments run inside transactional boundaries (`db.transaction`) via Drizzle ORM, guaranteeing changes either commit fully or rollback safely.
- **Optimized Neon Queries**: High-frequency dashboard operations use composite indexes on `userId` and `habitId`, keeping streak queries fast and predictable as historical data expands.
- **Strict Server-Side Validation**: All incoming request payloads and Server Actions are strictly parsed through **Zod** schemas before reaching the database layer.
- **Zero-Latency Authentication**: Uses **Auth.js v5** sessions validated directly within Next.js server middleware before rendering protected dashboard layouts.

---

## Tech Stack

- **Framework**: Next.js 16 (App Router, Server Actions, React Server Components)
- **Frontend**: React 19, Tailwind CSS v4, shadcn/ui, Lucide Icons
- **Language**: TypeScript (Strict Mode)
- **Database & ORM**: Neon Serverless PostgreSQL, Drizzle ORM
- **Authentication**: Auth.js v5 (Google OAuth)
- **Payments**: Stripe Checkout & Webhook Pipeline
- **Validation**: Zod
- **Runtime & Package Manager**: Bun 1.x

---

## Project Structure

```text
smart-track/
├── app/
│   ├── (dashboard)/        # Authenticated workspace routes
│   ├── api/                # Stripe webhook handlers and endpoints
│   ├── login/              # Authentication view
│   └── onboarding/         # First-time profile configuration
├── components/
│   ├── dashboard/          # Feature viewports (streaks, tasks, analytics)
│   ├── forms/              # Validated input components
│   └── ui/                 # Headless design primitives (shadcn)
├── db/
│   ├── index.ts            # Neon client initialization
│   └── schema.ts           # Drizzle database schemas
├── lib/
│   ├── auth.ts             # Auth.js configuration
│   ├── stripe.ts           # Stripe SDK utilities
│   └── utils.ts            # Shared helpers
└── types/                  # Shared TypeScript interfaces
```

---

## Getting Started

### 1. Prerequisites

Make sure you have the following installed locally:
- [Bun 1.x](https://bun.sh/)
- A free [Neon PostgreSQL](https://neon.tech/) database instance
- Google Cloud OAuth credentials
- A [Stripe](https://stripe.com/) developer account

### 2. Clone and Install

```bash
git clone https://github.com/abdul-rahman-0x/smart-track.git
cd smart-track
bun install
```

### 3. Configure Environment Variables

Create your local `.env.local` file:

```bash
cp .env.example .env.local
```

Fill in your service keys:

```env
# Database
DATABASE_URL="postgresql://username:password@host/neondb?sslmode=require"

# Auth.js
AUTH_SECRET="your-generated-secret-key"
AUTH_GOOGLE_ID="your-google-oauth-client-id"
AUTH_GOOGLE_SECRET="your-google-oauth-client-secret"

# Stripe
STRIPE_SECRET_KEY="your-stripe-secret-key"
STRIPE_WEBHOOK_SECRET="your-stripe-webhook-secret"
STRIPE_PRICE_ID="your-configured-price-id"

# App
NEXT_PUBLIC_APP_URL="http://localhost:3000"
```

### 4. Push Database Schema

Apply your Drizzle schema directly to your Neon database:

```bash
bunx drizzle-kit push
```

### 5. Start the Development Server

```bash
bun dev
```

Open [http://localhost:3000](http://localhost:3000) to view the workspace.

---

## License

Distributed under the [MIT License](LICENSE).

---

## Author

Crafted by **[Abdul Rahman](https://github.com/abdul-rahman-0x)**
