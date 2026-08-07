# Deploying EPFO EO Tour Diary to Render.com

This guide provides step-by-step instructions for publishing the **EPFO EO Tour Diary** application to **Render.com**.

---

## Option 1: 1-Click Deployment via Render Blueprints (Recommended)

1. Sign in to your [Render Dashboard](https://dashboard.render.com/).
2. Click **New +** in the top right corner and select **Blueprint**.
3. Connect your GitHub account and select repository: **`EPFRAGHU/eo_tour_diary`**.
4. Render will automatically detect `render.yaml` and display the blueprint services:
   - 🌐 **Web Service**: `eo-tour-diary` (Static Site / React 19)
   - 🐘 **PostgreSQL Database**: `eo-tour-diary-db`
5. Click **Apply**.
6. Render will automatically install dependencies, build the application with Vite (`npm run build`), configure SPA route rewrites (`/* -> /index.html`), and issue an SSL certificate (`https://eo-tour-diary.onrender.com`).

---

## Option 2: Manual Web Service Setup on Render

If you prefer to configure the Web Service manually:

1. Go to [Render Dashboard](https://dashboard.render.com/) -> **New +** -> **Static Site**.
2. Connect repository **`EPFRAGHU/eo_tour_diary`**.
3. Configure build & publish settings:
   - **Name**: `eo-tour-diary`
   - **Branch**: `main`
   - **Build Command**: `npm install && npm run build`
   - **Publish Directory**: `dist`
4. Under **Redirects / Rewrites**, add:
   - **Type**: `Rewrite`
   - **Source**: `/*`
   - **Destination**: `/index.html`
5. Click **Create Static Site**.

---

## Deployment Verification

Once deployed, your live production application will be accessible at:
- `https://eo-tour-diary.onrender.com`
