# Beauty by Zee — Deployment Guide

## Free Hosting on Netlify (Recommended)

### Steps:
1. Go to **https://netlify.com** and create a free account
2. From the dashboard, click **"Add new site" → "Deploy manually"**
3. Drag and drop the entire `beauty-by-zee` folder onto the upload area
4. Netlify will give you a free URL like `https://beauty-by-zee-xyz.netlify.app`
5. You can customize the name under **Site Settings → Change site name**

### Your Pages:
- **Store:** `https://your-site.netlify.app/`
- **Admin Login:** `https://your-site.netlify.app/admin/login`
- **Admin Dashboard:** `https://your-site.netlify.app/admin/dashboard`

---

## Alternative: GitHub + Netlify (Auto-deploys)

1. Install Git: `sudo apt install git`
2. Create account at **https://github.com**
3. Create a new repository
4. Push this folder:
   ```bash
   cd beauty-by-zee
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin https://github.com/YOUR_USERNAME/beauty-by-zee.git
   git push -u origin main
   ```
5. Connect to Netlify → "Import from Git" → select your repo
6. Every time you push changes, the site auto-updates

---

## Alternative: GitHub Pages (Also Free)

1. Push to GitHub (steps above)
2. Go to repo Settings → Pages
3. Set source to "main" branch, root folder
4. URL: `https://YOUR_USERNAME.github.io/beauty-by-zee`

---

## Admin Credentials
- **URL:** `/admin/login`
- **Username:** `admin`
- **Password:** `admin`

> ⚠️ Change these in `admin/login.html` before going live!

---

## How Prices Work
Prices are stored in the visitor's browser (localStorage).  
To ensure ALL visitors see prices:
- After logging into admin and setting prices, the prices are stored locally.
- For a production site, consider upgrading to a backend (Firebase, Supabase) to store prices server-side.
- For now, set prices on each device/browser you use to test.
