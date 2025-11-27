# FastCrew

**Private Commercial SaaS Platform**

> [INTERNAL VALUE PROPOSITION: e.g., Connecting businesses with on-demand workforce seamlessly.]

---

### ⚠️ WARNING: PRIVATE REPOSITORY
**PROPRIETARY SOURCE CODE. DO NOT DISTRIBUTE.**
This codebase contains confidential intellectual property. Unauthorized access, copying, or distribution is strictly prohibited.

---

## 🛠 Tech Stack

**Core Framework**
-   **Framework:** [Next.js 16](https://nextjs.org/) (App Router)
-   **Language:** TypeScript
-   **Runtime:** Node.js

**Frontend & UI**
-   **Styling:** Tailwind CSS
-   **Components:** Radix UI (Headless), Lucide React (Icons)
-   **Animation:** Framer Motion
-   **Validation:** Zod

**Backend & Data**
-   **Database:** PostgreSQL
-   **ORM:** Prisma
-   **Authentication:** Clerk
-   **Storage/Realtime:** Supabase
-   **AWS SDK:** S3 Integration

---

## 📋 Prerequisites

Ensure you have the following installed on your local machine:

-   **Node.js:** v20.x or higher (LTS recommended)
-   **Package Manager:** npm (detected via `package-lock.json`)

---

## 🚀 Getting Started (Runbook)

Follow these steps to get the development environment running:

### 1. Clone the Repository
```bash
git clone <repository-url>
cd fastcrew
```

### 2. Configure Environment Variables
We use `dotenv` for secret management. **Never commit `.env` files.**

1.  Copy the example file:
    ```bash
    cp .env.example .env.local
    ```
2.  **Action Required:** Fill in the secrets in `.env.local` from our password manager (1Password/Doppler). You will need keys for:
    -   Clerk (Publishable/Secret Keys)
    -   Supabase (URL/Anon Key)
    -   Database URL (PostgreSQL connection string)
    -   AWS Credentials

### 3. Install Dependencies
```bash
npm install
```

### 4. Database Setup
Ensure your local or dev database is reachable, then generate the Prisma client:
```bash
npm run db:generate
npm run db:push:dev # Pushes schema to the development database
```

### 5. Start Development Server
```bash
npm run dev
```
The app should now be running at `http://localhost:3000`.

---

## 📜 Available Scripts

| Script | Description |
| :--- | :--- |
| `npm run dev` | Starts the development server with hot-reloading. |
| `npm run build` | Builds the application for production. |
| `npm run start` | Starts the production server (after build). |
| `npm run lint` | Runs ESLint to catch code quality issues. |
| `npm run typecheck` | Runs TypeScript compiler to check for type errors. |
| `npm run format` | Formats code using Prettier. |
| `npm run db:studio` | Opens Prisma Studio to view/edit database records. |
| `npm run db:push` | Pushes the Prisma schema state to the database (prototyping). |
| `npm run db:migrate` | Runs production database migrations. |

---

## 📂 Project Structure

```text
/src
├── /app            # Next.js App Router pages and layouts
├── /components     # Reusable UI components (Radix/Shadcn)
├── /lib            # Utility libraries and configurations
├── /types          # TypeScript type definitions
├── /utils          # Helper functions
├── /db             # Database connection and logic
└── /scripts        # Maintenance and setup scripts
```

---

## 🚀 Deployment

**Platform:** Vercel

-   **Production:** Commits to the `main` branch trigger a deployment to the Production environment.
-   **Preview:** Pull Requests trigger a Preview deployment for testing and QA.
-   **Manual:** Deploys are currently managed manually or via git triggers.

---

**Maintainer:** Engineering Team