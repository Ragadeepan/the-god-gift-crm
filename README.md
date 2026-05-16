# The God Gift CRM

> Professional Customer Lead Management System — Built with Next.js 15, Express.js, PostgreSQL & Prisma

---

## Tech Stack

| Layer      | Technology                          |
|------------|-------------------------------------|
| Frontend   | Next.js 15, React 18, TypeScript    |
| Styling    | Tailwind CSS, Framer Motion         |
| Backend    | Node.js, Express.js                 |
| Database   | PostgreSQL                          |
| ORM        | Prisma                              |
| Excel      | ExcelJS                             |
| Deploy     | Vercel (frontend) + Railway (backend)|

---

## Project Structure

```
the-god-gift-CRM/
├── backend/
│   ├── prisma/
│   │   └── schema.prisma          # Database schema
│   ├── src/
│   │   ├── controllers/
│   │   │   ├── customerController.js
│   │   │   └── exportController.js
│   │   ├── middleware/
│   │   │   ├── errorHandler.js
│   │   │   └── validation.js
│   │   ├── routes/
│   │   │   ├── customers.js
│   │   │   └── export.js
│   │   └── services/
│   │       └── prismaClient.js
│   ├── server.js
│   ├── package.json
│   └── .env.example
│
└── frontend/
    ├── app/
    │   ├── globals.css
    │   ├── layout.tsx
    │   └── page.tsx               # Dashboard page
    ├── components/
    │   ├── ui/
    │   │   ├── button.tsx
    │   │   ├── input.tsx
    │   │   └── badge.tsx
    │   ├── CustomerForm.tsx        # Add/update customer form
    │   ├── CustomerTable.tsx       # Searchable customer list
    │   ├── Navbar.tsx
    │   ├── RecentCustomers.tsx
    │   └── StatsCards.tsx
    ├── hooks/
    │   └── useCustomers.ts        # React hooks for customers
    ├── services/
    │   └── api.ts                 # Axios API client
    ├── lib/
    │   └── utils.ts
    ├── package.json
    └── .env.example
```

---

## API Routes

| Method | Route                     | Description                    |
|--------|---------------------------|--------------------------------|
| GET    | /health                   | Health check                   |
| GET    | /api/customers            | List all customers (+ search)  |
| GET    | /api/customers/stats      | Dashboard statistics           |
| GET    | /api/customers/:phone     | Find customer by WhatsApp      |
| POST   | /api/customers            | Create new customer            |
| PUT    | /api/customers/:id        | Update customer                |
| DELETE | /api/customers/:id        | Delete customer                |
| GET    | /api/export/excel         | Download Excel file            |

---

## Setup Guide

### Prerequisites

- Node.js 18+
- PostgreSQL (local or cloud — [Railway](https://railway.app), [Supabase](https://supabase.com), [Neon](https://neon.tech))
- npm or yarn

---

### Step 1 — Clone & install dependencies

```bash
# Backend
cd backend
npm install

# Frontend
cd ../frontend
npm install
```

---

### Step 2 — Configure environment variables

**Backend:**
```bash
cd backend
copy .env.example .env
```

Edit `backend/.env`:
```env
DATABASE_URL="postgresql://postgres:yourpassword@localhost:5432/godgift_crm"
PORT=5000
NODE_ENV=development
FRONTEND_URL="http://localhost:3000"
```

**Frontend:**
```bash
cd frontend
copy .env.example .env.local
```

Edit `frontend/.env.local`:
```env
NEXT_PUBLIC_API_URL="http://localhost:5000"
```

---

### Step 3 — Set up PostgreSQL database

**Option A — Local PostgreSQL:**
```sql
-- In psql or pgAdmin
CREATE DATABASE godgift_crm;
```

**Option B — Railway (Cloud, Recommended):**
1. Go to [railway.app](https://railway.app) → New Project → PostgreSQL
2. Copy the `DATABASE_URL` from the Variables tab

**Option C — Supabase (Free Tier):**
1. Go to [supabase.com](https://supabase.com) → New Project
2. Go to Settings → Database → Copy the connection string

---

### Step 4 — Run Prisma migrations

```bash
cd backend
npx prisma generate
npx prisma migrate dev --name init
```

To view data in a GUI:
```bash
npx prisma studio
```

---

### Step 5 — Start the servers

**Terminal 1 — Backend:**
```bash
cd backend
npm run dev
# API running at http://localhost:5000
```

**Terminal 2 — Frontend:**
```bash
cd frontend
npm run dev
# App running at http://localhost:3000
```

---

## Deployment

### Frontend → Vercel

1. Push your `frontend/` folder to GitHub
2. Go to [vercel.com](https://vercel.com) → Import project
3. Set environment variable:
   ```
   NEXT_PUBLIC_API_URL=https://your-backend-url.railway.app
   ```
4. Deploy

### Backend → Railway

1. Push your `backend/` folder to GitHub
2. Go to [railway.app](https://railway.app) → New Project → Deploy from GitHub
3. Add a PostgreSQL service
4. Set environment variables:
   ```
   DATABASE_URL=<auto-filled from Railway PostgreSQL>
   PORT=5000
   NODE_ENV=production
   FRONTEND_URL=https://your-app.vercel.app
   ```
5. Add start command: `npm start`
6. Run migrations via Railway shell: `npx prisma migrate deploy`

---

## Features

- **Auto-detect existing customers** — Enter a WhatsApp number and the system auto-fills the customer details if they already exist
- **Instant search** — Debounced search across name, number, and Instagram
- **Excel export** — Downloads a beautifully formatted .xlsx with all customer data
- **Copy WhatsApp** — One-click copy of any customer's number
- **Open Instagram** — Direct link to customer's Instagram page
- **Dashboard stats** — Total customers, added today, this week
- **Recent activity** — Latest 5 added customers
- **Mobile responsive** — Works on all screen sizes
- **Validation** — Phone number and Instagram URL validation on both frontend and backend

---

## Environment Variables Reference

### Backend

| Variable       | Description                          | Example                                              |
|----------------|--------------------------------------|------------------------------------------------------|
| DATABASE_URL   | PostgreSQL connection string         | postgresql://user:pass@host:5432/db                 |
| PORT           | Server port                          | 5000                                                 |
| NODE_ENV       | Environment                          | development / production                             |
| FRONTEND_URL   | Allowed CORS origin                  | http://localhost:3000                                |

### Frontend

| Variable              | Description           | Example                          |
|-----------------------|-----------------------|----------------------------------|
| NEXT_PUBLIC_API_URL   | Backend API base URL  | http://localhost:5000            |

---

## Database Schema

```prisma
model Customer {
  id             String   @id @default(cuid())
  whatsappNumber String   @unique
  name           String
  instagramLink  String?
  createdAt      DateTime @default(now())
  updatedAt      DateTime @updatedAt
}
```

---

Made with love for The God Gift Business
