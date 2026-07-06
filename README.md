# Smart Track

<p align="center">
  <strong>Plan intentionally, build consistent habits, and stay focused on what matters.</strong>
</p>

<p align="center">
  smart-track is a productivity platform designed for students, developers, and self-learners who need more than a simple to-do list. It combines task management, habit tracking, academic planning, and subscription-based productivity tools into a single, structured workspace built for long-term consistency.
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Next.js-16-black?style=flat&logo=nextdotjs" />
  <img src="https://img.shields.io/badge/React-19-%2361DAFB?style=flat&logo=react&logoColor=black" />
  <img src="https://img.shields.io/badge/TypeScript-Strict-%233178C6?style=flat&logo=typescript&logoColor=white" />
  <img src="https://img.shields.io/badge/TailwindCSS-4-%2306B6D4?style=flat&logo=tailwindcss&logoColor=white" />
  <img src="https://img.shields.io/badge/Auth.js-v5-black?style=flat" />
  <img src="https://img.shields.io/badge/Drizzle-ORM-%23C5F74F?style=flat" />
  <img src="https://img.shields.io/badge/Neon-PostgreSQL-%234169E1?style=flat&logo=postgresql&logoColor=white" />
  <img src="https://img.shields.io/badge/Stripe-Billing-%23008CFF?style=flat&logo=stripe&logoColor=white" />
</p>

---

## Why smart-track Exists

Modern workflows subject us to continuous information overload. Managing exams, tracking habits, scheduling coding projects, and monitoring personal subscriptions typically requires context-switching across four or five fragmented applications. This friction is where consistency breaks down.

smart-track was built to eliminate this overhead. Rather than introducing complex nesting or productivity "hype," the platform unifies planning, tracking, and execution into a single, intuitive workflow. The objective is simple: **minimize the mental energy spent on organization, so users can focus on execution.**

> **Goal:** Build a productivity system that helps users think less about organization and spend more time doing meaningful work.

---

## The Engineering Challenge

Building a robust, subscription-based productivity tool presented several complex architectural and state-management challenges. Below is how these hurdles were resolved:

### 1. Payment Integrity & Idempotent Webhooks
Relying strictly on client-side state transitions for sensitive billing access is highly insecure. To solve this, smart-track processes all billing states asynchronously using cryptographically signed **Stripe webhooks**. 
* **The Solution**: The system processes incoming events through a resilient boundary that verifies Stripe signatures. It logs processed event IDs in an idempotency cache to prevent duplicate writes from network retries, ensuring that payment state synchronization is consistent and fail-safe.

### 2. Transactional Database Safety
Updating a user's subscription tier involves mutating several data records at once. If the user's tier details change but the application quota configurations fail to update, the system is left in an unstable state.
* **The Solution**: We leverage **Drizzle ORM transactional queries** (`db.transaction()`). If any stage of the database write fails, the entire transaction is immediately rolled back, keeping user records structurally sound.

### 3. Real-Time Query Efficiency
Relational databases can slow down rapidly when computing complex user analytics, streak counters, and daily checklists on a single dashboard view.
* **The Solution**: Using **Neon PostgreSQL** and **Drizzle ORM**, we implemented strategic indexing on high-frequency lookups (specifically composite indexes on `userId` and `habitId`). This optimization maintains fast, predictable query execution times even as historical user tracking data expands.

### 4. Zero-Trust Defensive Coding
Malicious or malformed inputs can easily corrupt database state.
* **The Solution**: All incoming data, whether originating from client forms or server action invocations, is rigorously parsed using **Zod** schema validations at the boundary layer before it can trigger database execution.

---

## Core System Architecture

To keep the platform robust, transparent, and easy to maintain, the underlying processes are divided into four core workflows:

### 1. User Productivity Workflow
This system manages how an authenticated user moves through the platform's daily lifecycle, enforcing subscription limits and compiling streak data as they execute tasks.

```mermaid
flowchart TD
    A[User Lands on App] --> B{Active Auth Session?}
    B -- No --> C[Auth.js Sign In / Google OAuth] --> D[Initialize User Profile & Onboarding]
    B -- Yes --> E[Redirect to Dashboard]
    D --> E
    E --> F{Subscription Status?}
    F -- Premium --> G[Unlock Multi-tracker & Premium Analytics]
    F -- Free Tier --> H[Enforce Standard Tracking & Usage Quotas]
    G --> I[Workspace: Create habits, tasks & goals]
    H --> I
    I --> J[Daily Execution & Progress Logging]
    J --> K[Calculate Streaks & Metric Computations]
    K --> L[Generate Analytical Visualizations]
    L --> M[Long-Term Performance Optimization]
    M --> I
```
---

### 2. Authentication Sequence

We handle authentication securely using **Auth.js v5** at the server level, utilizing native Next.js middleware routing to check authorization rules before rendering user-facing views.

```mermaid
sequenceDiagram
    autonumber
    participant U as Client Browser
    participant M as Next.js Middleware
    participant A as Auth.js v5 (Server)
    participant G as Google OAuth Provider
    participant D as Neon PostgreSQL (Drizzle)

    U->>M: Access Protected Route (/dashboard)
    M->>A: Validate Session Cookie
    alt Session Invalid / Expired
        A-->>M: No Active Session
        M-->>U: Redirect to /login
        U->>U: Click "Sign in with Google"
        U->>G: Authorize Request
        G-->>A: OAuth Token & User Profile Payload
        A->>D: Upsert User & Session Records
        D-->>A: DB Write Complete
        A-->>U: Issue Signed Session Cookie
    else Session Valid
        M-->>U: Resolve Component Layout (RSC)
    end
    U->>A: Load Dashboard Data (Server Actions)
    A->>D: Fetch Analytics & Habits
    D-->>A: Data Records
    A-->>U: Render React Server Components
```

---

### 3. Subscription & Payment Sequence

Stripe Checkout session lifecycles are processed out-of-band to safeguard administrative changes and billing adjustments.

```mermaid
sequenceDiagram
    autonumber
    participant U as Client Browser
    participant A as Next.js Server (API/Action)
    participant S as Stripe Billing Engine
    participant W as Stripe Webhook Receiver
    participant D as Neon PostgreSQL (Drizzle)

    U->>A: Initiate Upgrade (Stripe Session Request)
    A->>S: Create Checkout Session (with User Metadata)
    S-->>A: Checkout Session URL
    A-->>U: Redirect to Stripe Checkout
    U->>S: Input Payment Info & Confirm
    S-->>U: Confirm Payment & Redirect to App
    Note over S, W: Asynchronous Webhook Event Triggered
    S->>W: Webhook Event (checkout.session.completed)
    rect rgb(30, 41, 59)
        Note over W, D: Resilient Processing Boundary
        W->>W: Verify Webhook Signature (Stripe Key)
        W->>D: Check Event Idempotency (Avoid Double Writes)
        alt New Event Reference
            W->>D: Execute DB Transaction (Update Plan & Limits)
            D-->>W: Transaction Committed / Premium Enabled
        else Duplicate Event
            W-->>S: Return 200 OK (Skip Processing)
        end
    end
    W-->>S: Return 200 OK Status
    U->>A: Access Premium Dashboard Area
    A->>D: Read User Subscription Tier
    D-->>A: Active Premium Status
    A-->>U: Mount Premium UI Viewports
```

---

### 4. Subscription State Machine

To avoid unexpected access scenarios, we map the subscription lifecycle using a clean state machine. This flow accounts for edge cases like missed payments, grace periods, manual cancellations, and plan resets.

```mermaid
stateDiagram-v2
    [*] --> FreeTier : New Account Created
    FreeTier --> StripeCheckout : Initiate Upgrade
    StripeCheckout --> PaymentPending : Submit Billing Info
    PaymentPending --> PremiumActive : Webhook Confirmed (Subscription Created)
    PaymentPending --> FreeTier : Payment Failed / Cancelled
    
    state PremiumActive {
        [*] --> ActiveState
        ActiveState --> GracePeriod : Payment Missed (invoice.payment_failed)
        GracePeriod --> ActiveState : Retry Successful (invoice.paid)
        GracePeriod --> SubscriptionCancelled : Max Retries Exhausted
        ActiveState --> SubscriptionCancelled : Manual Cancel Triggered
    }
    
    SubscriptionCancelled --> AccessDowngraded : Term End Date Reached (customer.subscription.deleted)
    AccessDowngraded --> FreeTier : Reset Account Limits
    AccessDowngraded --> StripeCheckout : Re-subscribe
```

---

## Tech Stack & Tooling

- **Framework:** Next.js 16 (App Router, Server Components)
- **Language:** TypeScript Strict Mode
- **Frontend Library:** React 19
- **Authentication:** Auth.js v5 (Google OAuth Provider)
- **Database:** Neon serverless PostgreSQL
- **ORM:** Drizzle ORM
- **Payments:** Stripe Billing Engine
- **Schema Validation:** Zod
- **Styling:** Tailwind CSS v4
- **UI Components:** shadcn/ui
- **Deployment:** Vercel
- **Developer Tooling:** Bun, ESLint
- **Runtime & Package Manager**: Bun 1.x (Fast package manager, bundler, and runner)

---

## Project Structure

```bash
smart-track/

├── app/                    # Next.js App Router pages and route handlers
│   ├── (dashboard)/        # Main dashboard workspace pages
│   ├── api/                # Stripe webhooks and API routes
│   ├── login/              # Authentication gateways
│   └── onboarding/         # Setup procedures for new profiles
│
├── components/             # Modular React components
│   ├── ui/                 # Design system primitives (shadcn)
│   ├── dashboard/          # Specialized feature viewports
│   └── forms/              # Validation-ready form elements
│
├── db/                     # Data persistence architecture
│   ├── index.ts            # Database client instantiation
│   └── schema.ts           # Unified database schemas
│
├── lib/                    # System utilities and APIs
│   ├── auth.ts             # Auth.js configurations
│   ├── stripe.ts           # Stripe SDK helpers
│   └── utils.ts            # Shared core utilities
│
├── public/                 # Static graphical assets
└── types/                  # Global TypeScript type definitions
```

---

## Getting Started

### 1. Prerequisites
Ensure you have the following installed on your machine:
* **Bun 1.x** (Install via `curl -fsSL https://bun.sh/install | bash` or `brew install oven-sh/bun/bun`)
* An active Neon PostgreSQL Database
* Google developer console credentials (for OAuth)
* A Stripe developer account

### 2. Installation
Clone the repository and install the dependencies using Bun's ultra-fast installer:

```bash
git clone https://github.com/your-username/smart-track.git
cd smart-track
bun install
```

### 3. Environment Configuration
Create a local `.env.local` configuration:

```bash
cp .env.example .env.local
```

Add your localized parameters into `.env.local`:

```env
# Database
DATABASE_URL="postgresql://username:password@host/neondb?sslmode=require"

# Auth.js
AUTH_SECRET="generate-a-secure-secret-key"
AUTH_GOOGLE_ID="your-google-oauth-client-id"
AUTH_GOOGLE_SECRET="your-google-oauth-client-secret"

# Stripe
STRIPE_SECRET_KEY="your-stripe-secret-api-key"
STRIPE_WEBHOOK_SECRET="your-stripe-local-webhook-signing-secret"
STRIPE_PRICE_ID="your-configured-recurring-price-id"

# Base Domain
NEXT_PUBLIC_APP_URL="http://localhost:3000"
```

### 4. Database Setup
Push your local database schema directly to your live Neon database using `bunx`:

```bash
bunx drizzle-kit push
```

### 5. Running Locally
Launch the fast-refresh local development server:

```bash
bun dev
```

Open `http://localhost:3000` inside your web browser to view the application.

---

## Security & Resilience Checklist

* **Zero-Trust Session Architecture**: Authenticated states are validated strictly on the server using **Auth.js v5** sessions and Next.js middleware before rendering layout structures or executing backend transactions.
* **Cryptographic Webhook Audits**: Stripe payment notifications are secured through asynchronous signature verification to prevent spoofing, alongside database checks to safeguard against duplicate event delivery.
* **Transactional Reliability**: Utilizes database-level transactional operations (`db.transaction`) when updating user subscriptions, guaranteeing that multi-table writes either commit fully or rollback cleanly upon failure.
* **Defensive Schema Parsing**: All client-side requests, routing configurations, and server actions are validated at the boundary using **Zod** schemas, mitigating SQL-injection threats and protecting against malformed database payloads.
* **Secure Environment Isolation**: System credentials and payment gateways are decoupled and isolated at runtime via environment configurations, eliminating hardcoded variables and sensitive configuration leaks in production.

---

## License

This project is licensed under the [MIT License](LICENSE).

---

## Author

Developed by **[Abdul Rahman](https://github.com/abdul-rahman-0x)**
