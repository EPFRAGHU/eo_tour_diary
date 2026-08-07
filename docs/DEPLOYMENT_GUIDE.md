# EPFO EO Tour Diary - Production Deployment Guide

## Prerequisites
- Docker Engine v24.0+
- Docker Compose v2.20+
- Node.js 20 LTS (for local administration)
- PostgreSQL 16 (if using external managed database)

---

## 1. Environment Configuration

Copy `.env.example` to `.env.production` and configure production parameters:

```bash
cp .env.example .env.production
```

Key environment variables:
```env
PORT=3000
NODE_ENV=production
DATABASE_URL="postgresql://epfo_admin:epfo_secure_password_2026@eo_tour_diary_db:5432/epfo_tour_diary?schema=public"
JWT_SECRET="epfo_super_secret_jwt_key_2026"
DEFAULT_OFFICE_REGION="RO Mumbai (Bandra)"
MAX_FILE_SIZE_BYTES=10485760
```

---

## 2. Docker Container Deployment

To launch the multi-container production stack (Web NGINX App + PostgreSQL 16 DB + Automated Healthchecks):

```bash
docker-compose up -d --build
```

Verify running containers:
```bash
docker-compose ps
```

---

## 3. Database Migration & Lookup Seeding

Run Prisma migrations and lookup seeder inside the container:

```bash
docker exec -it eo_tour_diary_web npx prisma db push
docker exec -it eo_tour_diary_web npx prisma db seed
```

---

## 4. Database Backup & Crontab Scheduling

### Windows PowerShell Backup Script
```powershell
.\scripts\db-backup.ps1
```

### Linux Bash Backup Script & Crontab (Daily at Midnight)
```bash
chmod +x scripts/db-backup.sh
crontab -e
# Add line:
0 0 * * * /var/www/eo_tour_diary/scripts/db-backup.sh >> /var/log/epfo_backup.log 2>&1
```

---

## 5. SSL Reverse Proxy Setup (NGINX + Let's Encrypt)

Sample NGINX configuration block:
```nginx
server {
    listen 443 ssl http2;
    server_name tourdiary.epfindia.gov.in;

    ssl_certificate /etc/letsencrypt/live/tourdiary.epfindia.gov.in/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/tourdiary.epfindia.gov.in/privkey.pem;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```
