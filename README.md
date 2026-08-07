# EPFO Enforcement Officer (EO) Tour Diary & Field Inspection Portal

[![License](https://img.shields.io/badge/License-Government_Standard-blue.svg)](LICENSE)
[![React 19](https://img.shields.io/badge/React-19.0.0-61dafb.svg)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.7.3-3178c6.svg)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-6.1.0-646cff.svg)](https://vitejs.dev/)
[![TailwindCSS](https://img.shields.io/badge/TailwindCSS-3.4.17-06b6d4.svg)](https://tailwindcss.com/)
[![Prisma](https://img.shields.io/badge/Prisma-6.3.0-2d3748.svg)](https://www.prisma.io/)

A full-stack, enterprise-grade digital field inspection, tour diary, and compliance management web application designed for **Enforcement Officers (EO/AO)**, **Assistant Provident Fund Commissioners (APFC)**, and **Regional Administrators** at the **Employees' Provident Fund Organisation (EPFO), Ministry of Labour & Employment, Government of India**.

---

## 🌟 Key Features & Capabilities

### 1. 📊 Executive Officer Dashboard
- Real-time KPI widgets for Today's Visits, Monthly Progress, Pending Visits, and 7A/14B Recovery Targets (₹3.45L / ₹5.00L - 69%).
- High-Priority Compliance Follow-ups & Recent Activity Stream.

### 2. 📅 Tour Schedule & Daily Diary Builder
- Monthly tour itinerary proposals & APFC approval workflow.
- Multi-entry daily inspection diary builder with 1.5s draft auto-save engine (`localStorage`).
- Mobile 1-click **GPS Geolocation Check-in** (`navigator.geolocation`) & **Camera Photo Capture** (`capture="environment"`).

### 3. 🔍 Field Inspection Logs & Inline-Editable Table
- Sticky backdrop-blur header, multi-column sorting, pagination, and 10 row action triggers (`Add`, `Edit`, `Save`, `Delete`, `PDF`, `Call`, `Upload`, `Navigate`, `History`, `Duplicate`).

### 4. 📁 Digital Document Vault
- Establishment folder directory trees (`/OR-6276/`, `/OR-BBS-1238/`, `/GENERAL/`).
- Multi-format file support (Photo, PDF, Word, Excel, ZIP) with revision versioning history (`v1.0`, `v1.1`), 1-click file replacement, and deletion.

### 5. 📞 Employer Communication & Liaison Hub
- Direct 1-click Call (`tel:`), WhatsApp (`https://wa.me/`) with pre-loaded EPFO compliance templates (ECR Notice, Section 7A Hearing, Form 11 Notice), SMS launcher, Copy Number, and Discussion Notes logger.

### 6. 💬 Remarks & Collaboration System
- Rich Text formatting toolbar (Bold, Italic, Underline, Bullet lists).
- `@User` mentions autocomplete (`@APFC Compliance`, `@RPFC Regional Office`, `@EO`).
- EPFO standard remarks templates, pushpin priority pinning, revision history logs, and color-coded labels (🔴 Urgent Action, 🟡 Pending APFC, 🟢 Compliant, 🔵 Info, 🟣 Dues).

### 7. ⏰ Follow-up & Pending Work Tracking System
- Action items pipeline (`PENDING`, `IN_PROGRESS`, `COMPLETED`, `OVERDUE`) with priority badges (🔴 High, 🟡 Medium, 🔵 Low), reminder due dates, scheduled next visit dates, and chronological timeline stream.

### 8. 📄 Comprehensive Reports & Analytics Engine
- Multi-report category views (Monthly Tour Diary, Field Inspection Audit, Recovery Dues, TA/DA Claims).
- Export official reports as **Printable PDF** or downloadable **CSV Data**.
- Executive visual charts for monthly visit volume, district-wise volume, employer compliance matrix, and YoY annual comparisons.

### 9. 🔒 Production Security & Audit Logging
- Role-Based Access Control (RBAC) guards (`ADMIN`, `APFC`, `EO`, `EO_AO`, `VIEWER`).
- XSS input sanitization (`sanitizeInput`), file MIME/size validation (10MB max), sliding window rate limiting (`rateLimiter`), and append-only security audit log viewer.

---

## 🛠️ Technology Stack

- **Frontend**: React 19 + Vite 6 + TypeScript 5 + TailwindCSS 3 + shadcn/ui + Lucide Icons
- **Backend & DB**: Node.js + Prisma ORM 6 + PostgreSQL 16
- **State & Router**: React Router 7 + TanStack React Query 5
- **Containerization**: Docker Multi-stage + Docker Compose

---

## 🚀 Quick Start Guide

### Prerequisites
- Node.js 20 LTS
- PostgreSQL 16 (or Docker Compose)

### Installation
```bash
# 1. Clone the repository
git clone https://github.com/EPFRAGHU/eo_tour_diary.git
cd eo_tour_diary

# 2. Install dependencies
npm install

# 3. Configure environment variables
cp .env.example .env

# 4. Generate Prisma client & push database schema
npx prisma generate
npx prisma db push

# 5. Run development server
npm run dev
```

Application will be available on `http://localhost:3000/`.

---

## 🐳 Docker Deployment

```bash
# Launch full containerized stack (Web App + PostgreSQL 16 DB + Healthchecks)
docker-compose up -d --build
```

---

## 🧪 Running Quality Assurance Tests

```bash
# Run automated QA test suite (12/12 Tests - 100% Pass Rate)
npm test
```

---

## 📄 Documentation Directory

- [API Documentation](docs/API_DOCUMENTATION.md)
- [User Guide & Manual](docs/USER_GUIDE.md)
- [Production Deployment Guide](docs/DEPLOYMENT_GUIDE.md)
- [Database ER Diagram](docs/DATABASE_ERD.md)

---

## 📜 License
Developed for Employees' Provident Fund Organisation (EPFO), Government of India.
