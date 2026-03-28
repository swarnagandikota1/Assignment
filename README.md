# Admission Management & CRM — edumerge Assignment

A full-stack web application built with **Next.js 14 (App Router)** and **MUI v5**, implementing the Admission Management & CRM BRS for the edumerge Junior Software Developer assessment.

---

## 🚀 Tech Stack

| Layer    | Technology                          |
|----------|-------------------------------------|
| Frontend | Next.js 14, React 18, MUI v5        |
| Backend  | Next.js API Routes (REST)           |
| Data     | In-memory store (simulates a DB)    |
| Charts   | Recharts                            |
| Language | TypeScript                          |

> **Note:** Data is stored in-memory. Refresh resets to seed data. For production, swap `src/lib/db.ts` with Prisma + PostgreSQL.

---

## 📦 Setup & Run

```bash
# 1. Install dependencies
npm install

# 2. Run development server
npm run dev

# 3. Open in browser
http://localhost:3000
```

---

## 📁 Project Structure

```
src/
├── app/
│   ├── api/                        # Backend REST APIs
│   │   ├── masters/
│   │   │   ├── institutions/       # GET, POST
│   │   │   ├── campuses/           # GET, POST
│   │   │   ├── departments/        # GET, POST
│   │   │   └── programs/           # GET, POST
│   │   ├── seat-matrix/            # GET, POST (quota validation)
│   │   ├── applicants/
│   │   │   ├── route.ts            # GET all, POST new
│   │   │   └── [id]/route.ts       # GET one, PUT update
│   │   ├── admissions/
│   │   │   ├── allocate/           # POST — locks seat (quota check)
│   │   │   └── confirm/            # POST — generates admission number
│   │   └── dashboard/              # GET — stats & analytics
│   ├── dashboard/                  # Dashboard UI
│   ├── masters/                    # Master Setup UI
│   ├── seat-matrix/                # Seat Matrix UI
│   ├── applicants/
│   │   ├── page.tsx                # Applicants list
│   │   └── [id]/page.tsx           # Applicant detail + workflow
│   └── admissions/                 # Admissions overview
├── components/
│   ├── layout/
│   │   ├── Sidebar.tsx
│   │   └── AppShell.tsx
│   └── ui/
│       ├── PageHeader.tsx
│       └── StatusChip.tsx
├── lib/
│   ├── db.ts                       # In-memory store + helpers
│   └── theme.ts                    # MUI theme
└── types/index.ts                  # All TypeScript types
```

---

## ✅ Features Implemented

### 2.1 Master Setup
- Institution → Campus → Department → Program hierarchy
- Course Type (UG/PG), Entry Type (Regular/Lateral), Admission Mode (Govt/Mgmt/Both)
- Academic Year configuration

### 2.2 Seat Matrix & Quota
- Configure KCET + COMEDK + Management seats per program
- **Validation:** KCET + COMEDK + Management must = Total Intake
- **Real-time seat counter** per quota
- **Block allocation if quota full** (409 error returned)
- Supernumerary seats (separate counter)
- Visual fill rate indicators

### 2.3 Applicant Management
- ≤15 field application form
- Category (GM/SC/ST/OBC/EWS)
- Entry Type, Quota Type
- Marks / qualifying exam / rank
- Document checklist (Pending → Submitted → Verified)

### 2.4 Admission Allocation
- **Government Flow:** Allotment number + quota selection → system checks → seat locked
- **Management Flow:** Manual creation → quota selection → availability check → seat locked

### 2.5 Admission Confirmation
- Generates **unique, immutable** admission number on confirmation
- Format: `EIT/2025/UG/CSE/KCET/0001`

### 2.6 Fee Status
- Pending / Paid
- **Admission confirmed only when fee = Paid**

### 2.7 Dashboard
- Total intake vs admitted
- Quota-wise filled/remaining seats (with charts)
- Program-wise fill rate
- Applicants with pending documents
- Fee pending count
- Status breakdown (pie chart)

---

## 🔑 Key System Rules (All Implemented)

| Rule | Implementation |
|------|---------------|
| Quota seats ≤ intake | Validated in `POST /api/seat-matrix` |
| No allocation if quota full | `checkSeatAvailability()` in `POST /api/admissions/allocate` |
| Admission number generated once | Immutable field in `PUT /api/applicants/[id]` |
| Admission confirmed only if fee paid | Guard in `POST /api/admissions/confirm` |
| Real-time seat counter | Incremented atomically on seat lock |

---

## 🌐 API Reference

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET/POST | `/api/masters/institutions` | CRUD institutions |
| GET/POST | `/api/masters/campuses` | CRUD campuses |
| GET/POST | `/api/masters/departments` | CRUD departments |
| GET/POST | `/api/masters/programs` | CRUD programs |
| GET/POST | `/api/seat-matrix` | Seat matrix configuration |
| GET/POST | `/api/applicants` | List/create applicants |
| GET/PUT  | `/api/applicants/[id]` | Get/update applicant |
| POST | `/api/admissions/allocate` | Lock seat (quota validation) |
| POST | `/api/admissions/confirm` | Confirm admission + generate number |
| GET | `/api/dashboard` | Dashboard analytics |

---

