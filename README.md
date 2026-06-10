# smart-track

<p align="center">
  <strong>Stop losing track of your deadlines. Know your tasks, master your habits, and perform with clarity.</strong>
</p>

<p align="center">
  smart-track gives you a clear, calm view of your entire academic and daily life—exams, assignments, and habits—all in one place. No more switching between apps, lost sticky notes, or forgotten routines. Just open smart-track, plan your day, build your streaks, and focus on what actually matters.
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Next.js-15-black?style=flat&logo=nextdotjs" alt="Next.js" />
  <img src="https://img.shields.io/badge/React-19-%2361DAFB?style=flat&logo=react&logoColor=black" alt="React" />
  <img src="https://img.shields.io/badge/Tailwind-CSS-%2306B6D4?style=flat&logo=tailwindcss&logoColor=white" alt="Tailwind" />
  <img src="https://img.shields.io/badge/TypeScript-Strict-%233178C6?style=flat&logo=typescript&logoColor=white" alt="TypeScript" />
  <img src="https://img.shields.io/badge/Auth.js-V5-%23000000?style=flat&logo=nextdotjs&logoColor=white" alt="Auth.js" />
  <img src="https://img.shields.io/badge/PostgreSQL-Neon-%234169E1?style=flat&logo=postgresql&logoColor=white" alt="PostgreSQL" />
  <img src="https://img.shields.io/badge/Stripe-Billing-%23008CFF?style=flat&logo=stripe&logoColor=white" alt="Stripe" />
</p>

## The Story Behind smart-track

Students and self-learners handle multiple streams of complex information every day—upcoming exams, homework assignments, daily routines, and notes. When these get scattered across different apps, physical notebooks, and reminders, it quickly leads to mental fatigue, stress, and missed deadlines.

We built **smart-track** to unify these streams into a single, cohesive, and calm workspace. It acts as a digital anchor for your goals. Whether you are prepping for midterms, building a daily reading habit, or tracking a project, smart-track organizes the chaos so you can learn and build with peace of mind.


## Table of Contents

- [Why It Matters](#why-it-matters)
- [User Experience](#user-experience)
- [How It Works](#how-it-works)
- [The Architecture](#the-architecture)
- [Project Structure](#project-structure)
- [Technology Stack](#technology-stack)
- [Getting Started](#getting-started)
- [Project Lead](#project-lead)


## Why It Matters

Most planner applications feel overly complex and cluttered. They force you to spend more time setting up templates and checking off boxes than actually doing the real work. Over time, these planners get abandoned because they add to the overwhelm.

**smart-track** changes that by keeping things simple, direct, and focused on execution:
- **Clarity Over Chaos:** Your daily habits, assignment deadlines, and exam milestones live side-by-side, giving you an immediate picture of your day.
- **Consistent Habits:** Visual streak counters motivate you to maintain consistency in your daily routines, from physical health to learning schedules.
- **Proactive Planning:** Dedicated exam countdown panels prevent last-minute cramming by showing you exactly how many days you have left to prepare.
- **Responsive by Default:** Transitions seamlessly from planning on your desktop to executing your tasks on your phone, resolving broken mobile navigation patterns.


## User Experience

smart-track answers the questions that keep you organized in your day-to-day life:

- "What exam do I need to prepare for next, and how much time do I have left?"
- "Which of my habits have I maintained today, and which ones need attention?"
- "What are my highest priority assignments for this week?"
- "How can I quickly manage my calendar on my mobile phone while working on my laptop?"


## How It Works

```mermaid
flowchart LR
  A["Set Up Your Account"] --> B["Define Dynamic Habits"]
  B --> C["Log Exams & Assignments"]
  C --> D["Track Daily Progress"]
  D --> E["Analyze & Build Streaks"]
  F["Export PDF Schedules"] --- E
```


## The Architecture

### Infrastructure & Data Flow

```mermaid
graph TB
    %% Styling Definitions
    classDef compNode fill:#18181B,stroke:#52525B,stroke-width:1px,color:#F4F4F5
    classDef dbNode fill:#18181B,stroke:#D97706,stroke-width:1.5px,color:#FBBF24
    classDef secureNode fill:#18181B,stroke:#EF4444,stroke-width:1.5px,color:#FCA5A5
    classDef extNode fill:#18181B,stroke:#06B6D4,stroke-width:1.5px,color:#67E8F9
    classDef noteNode fill:#FEF08A,stroke:#CA8A04,stroke-width:1px,color:#854D0E,font-style:italic

    %% --- 1. DEPLOYMENT LAYER ---
    subgraph Deploy ["1. DEPLOYMENT & HOSTING ENVIRONMENT"]
        Vercel["Vercel Cloud Platform <br/> (Edge & Serverless Runtimes)"]:::compNode
        NeonCloud["Neon DB Cluster <br/> (Serverless Postgres Instance)"]:::compNode
    end

    %% --- 2. CLIENT LAYER ---
    subgraph Client ["2. CLIENT LAYER (React 19 Frontend)"]
        UI["Dashboard UI View <br/> (Component Layout Grid)"]:::compNode
        Nav["Responsive Navigation <br/> (Sidebar / Mobile Sheet Menu)"]:::compNode
        AuthC["NextAuth Context <br/> (Client Session State)"]:::compNode
        OptState["Optimistic UI Engine <br/> (Immediate state updates)"]:::compNode
    end

    %% --- 3. SECURE MIDDLEWARE & WEBHOOKS ---
    subgraph Gateways ["3. SECURE GATEWAYS & API BOUNDARIES"]
        Middleware["Auth.js Middleware <br/> (Route Access Verification)"]:::secureNode
        StripeCheckout["Stripe Checkout Client <br/> (Redirects to billing gateway)"]:::extNode
        StripeWebhook["Stripe Webhook Handler <br/> (Validates cryptographic signature)"]:::secureNode
    end

    %% --- 4. BACKEND LAYER ---
    subgraph Backend ["4. BACKEND LAYER (Next.js 15 Server Actions)"]
        SessionCheck["Server Session Checker <br/> (NextAuth token validation)"]:::secureNode
        LimitEngine["Usage Limit Evaluator <br/> (Checks item counts for free-tier users)"]:::compNode
        ServerActions["Next.js Server Actions <br/> (Direct server-side operations)"]:::compNode
        ORM["Drizzle ORM Engine <br/> (Type-safe SQL query generation)"]:::compNode
    end

    %% --- 5. EXTERNAL SERVICES ---
    subgraph CloudServices ["5. EXTERNAL SERVICES"]
        GoogleAuth["Google Identity Server <br/> (OAuth Identity Verification)"]:::extNode
        StripeBilling["Stripe Payment Engine <br/> (Subscription status management)"]:::extNode
    end

    %% --- 6. DATABASE TIER ---
    subgraph DB ["6. DATABASE TIER (Neon PostgreSQL)"]
        NeonDB[("Neon Serverless Database")]:::dbNode
        T_Users["users table"]:::dbNode
        T_Subs["subscriptions table"]:::dbNode
        T_Habits["habits table"]:::dbNode
        T_Tasks["tasks table"]:::dbNode
    end

    %% --- SYSTEM DESIGN NOTES (STICKIES) ---
    NoteStripe["Stripe enforces billing tier status <br/> and limits free users <br/> to max 5 active habits." ]:::noteNode
    NoteAuth["NextAuth v5 handles session validation <br/> and JWT caching at Vercel's <br/> Edge Serverless level."]:::noteNode

    %% --- LAYER FLOW CONNECTIONS ---
    
    %% Client Routing & Security
    UI -->|1. Path Request| Middleware
    Middleware -->|2. Path Access Granted| UI
    AuthC -.->|OAuth Token Request| GoogleAuth

    %% Stripe Upgrade Pipeline
    UI -.->|3. Trigger Premium Upgrade| StripeCheckout
    StripeCheckout -->|Redirect Client| StripeBilling
    StripeBilling -.->|Async Callback| StripeWebhook
    StripeWebhook -->|4. Update Subscription Model| ORM

    %% Server Mutation & Database Pipeline
    UI ===>|5. Submit Form / Action| SessionCheck
    SessionCheck -->|6. Authorize user_id| LimitEngine
    LimitEngine -->|7. Verify item count limit| ServerActions
    ServerActions -->|8. Generate SQL Query| ORM
    ORM ===>|9. Execute Transaction| NeonDB

    %% Database Tables Structure
    NeonDB --- T_Users
    NeonDB --- T_Subs
    NeonDB --- T_Habits
    NeonDB --- T_Tasks

    %% Dynamic UI Update Loop
    NeonDB -.->|10. revalidatePath Event| UI
    UI -.->|11. Immediate Update| OptState

    %% Annotations Connections
    LimitEngine --- NoteStripe
    SessionCheck --- NoteAuth
```

## Project Structure

```text
smart-track/
├── app/                # Next.js 15 App Router Pages & Actions
│   ├── (dashboard)/    # Core views: Dashboard, Calendar, Planner, Trackers
│   ├── login/          # Secure Authentication Entry point
│   ├── onboarding/     # Post-signup user setup details
│   ├── api/            # API Route Handlers (Stripe webhooks)
│   └── globals.css     # Global Design Tokens & Tailwind Styles
├── components/         # Reusable Component blocks
│   ├── ui/             # Atomic design elements (shadcn/ui primitives)
│   ├── app-layout.tsx  # Dynamic side-drawer responsive layout wrapper
│   └── mode-toggle.tsx # Live Dark/Light mode toggle
├── db/                 # Database schema definitions and config
│   ├── index.ts        # Database client entry point
│   └── schema.ts       # Unified Drizzle ORM Schema
├── lib/                # Shared utilities & billing integrations
│   ├── auth.ts         # Auth.js (NextAuth v5) Google configuration
│   └── stripe.ts       # Stripe API configurations and webhook handlers
└── public/             # Icons, static images, and brand assets
```

## Technology Stack

- **Framework:** Next.js 16 (App Router & Streaming)
- **State:** React 19 (Server Components & Actions)
- **Database:** Neon (Serverless PostgreSQL)
- **ORM:** Drizzle ORM (Type-Safe Schema)
- **Auth:** Auth.js (v5 Session management with Google OAuth)
- **Payments:** Stripe (Secure Checkouts & Webhook sync)
- **Styling:** Tailwind CSS 4 (The Future of CSS)
- **Validation:** Zod (Reliable Data Integrity)

## Getting Started

### 1. Requirements
You will need a `Neon` database connection string, `Google OAuth` developer keys, and a `Stripe` account to run this dashboard locally.

### 2. Install Dependencies

```bash
bun install
```

### 3. Environment Setup

Configure your `.env.local` with the following variables:

```
# Database Credentials
DATABASE_URL=your_neon_postgres_url

# Auth.js Configuration
AUTH_SECRET=your_auth_secret_hash
AUTH_GOOGLE_ID=your_google_id
AUTH_GOOGLE_SECRET=your_google_secret

# Stripe Billing Details
STRIPE_API_KEY=your_stripe_secret_key
STRIPE_WEBHOOK_SECRET=your_stripe_webhook_signing_secret
```

### 4. Push Database Schema

```bash
bun drizzle-kit push
```

### 5. Start the App

```bash
bun dev
```

## Project Lead 

Crafted with passion by **[Abdul Rahman](https://github.com/abdul-rahman-0x)**  

