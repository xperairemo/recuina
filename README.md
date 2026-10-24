Markdown
# Recuina 🥘

> A modern web platform dedicated to preserving and sharing traditional culinary, built with an emphasis on modular architecture, strict type safety, and clean code principles.

---

## 📌 Project Overview

**Recuina** is a full-stack web application designed to document, discover, and organize traditional gastronomy. The project is engineered as a showcase of production-ready development practices, featuring a decoupled service-based architecture, secure OAuth authentication, relational data persistence with transactions, and responsive modern UI components.

---

## 🛠 Tech Stack & Architecture

### Core Technologies
* **Framework:** [Next.js](https://nextjs.org/) (App Router, React Server Components)
* **Language:** [TypeScript](https://www.typescriptlang.org/) (Strict mode, end-to-end type safety)
* **Styling:** [Tailwind CSS](https://tailwindcss.com/)
* **Database & ORM:** PostgreSQL managed via [Supabase](https://supabase.com/) & [Prisma ORM](https://www.prisma.io/)
* **Authentication:** [Auth.js v5](https://authjs.dev/) (NextAuth) with Google OAuth 2.0 & Prisma Adapter
* **Validation:** [Zod](https://zod.dev/)

### Architectural Principles
The codebase follows a decoupled, layered structure to separate concerns and maximize testability and maintainability:

```text
recuina/
├── prisma/               # Database schema, migrations, and seed scripts
├── src/
│   ├── app/              # Next.js App Router (pages, layouts, and API routes)
│   ├── components/       # UI layer
│   │   ├── auth/         # Authentication buttons and session indicators
│   │   ├── layout/       # Structural components (Header, Footer, Navigation)
│   │   └── recipes/      # Recipe cards, lists, and forms
│   ├── lib/              # Shared infrastructure (Prisma singleton, Auth configuration)
│   ├── server/           # Backend boundary
│   │   ├── actions/      # Next.js Server Actions ('use server' entry points)
│   │   └── services/     # Pure database and business logic layer (Prisma calls)
│   └── types/            # Domain interfaces and module declarations
Decoupled Backend: Server Actions act strictly as orchestration controllers, delegating data fetching and mutations to reusable service modules (src/server/services).

Progressive Enhancement: Authentication and form actions utilize native server handlers, enabling graceful fallback before client-side hydration.

Server-First Rendering: Pages leverage React Server Components (RSC) to minimize client bundle overhead and avoid layout shifts.

🚀 Key Features
Authentication (RF-01): Secure passwordless Google OAuth integration with session persistence and database synchronization via Prisma.

Relational Schema: Multi-table model covering recipes, granular ingredient items, numbered sequential steps, user favorites, and comments with cascade constraints.

Responsive Design: Optimized layout crafted with a warm, editorial aesthetic suitable for culinary documentation.

⚙️ Getting Started Locally
Prerequisites
Node.js (version 18.18+ or 20+)

A running Supabase PostgreSQL instance or local database

A Google Cloud Console project with OAuth credentials

Installation
Clone the repository:

Bash
git clone [https://github.com/xperairemo/recuina.git](https://github.com/xperairemo/recuina.git)
cd recuina
Install dependencies:

Bash
npm install
Configure environment variables:
Create a .env file in the project root:

Fragmento de código
# Database connection strings (Supabase Transaction Pooler & Direct URL)
DATABASE_URL="postgresql://postgres.[REF]:[PASSWORD]@aws-0-[REGION][.pooler.supabase.com:6543/postgres?pgbouncer=true](https://.pooler.supabase.com:6543/postgres?pgbouncer=true)"
DIRECT_URL="postgresql://postgres.[REF]:[PASSWORD]@aws-0-[REGION][.pooler.supabase.com:5432/postgres](https://.pooler.supabase.com:5432/postgres)"

# Auth.js / NextAuth configuration
AUTH_SECRET="your-generated-secret-key"
NEXTAUTH_URL="http://localhost:3000"

# Google OAuth Credentials
AUTH_GOOGLE_ID="your-google-client-id"
AUTH_GOOGLE_SECRET="your-google-client-secret"
Run database migrations:

Bash
npx prisma migrate dev
Start the local development server:

Bash
npm run dev
Open http://localhost:3000 in your browser.

📜 Database Entity Overview
The domain model contains the following relational entities:

User / Account / Session: OAuth identity management and session tracking.

Recipe: Core culinary entity including cooking time, difficulty level, and comarca/region.

Ingredient: Quantified ingredients linked directly to recipes.

Step: Ordered instructional steps.

Favorite & Comment: Social interactions and user bookmarks.

👤 Author
Developed by Joaquín Peraire Monfort

GitHub: @xperairemo