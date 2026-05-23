# 🚀 Sumii Art World — Deployment Guide

## Step 1 — Get Cloudinary Credentials (FREE, required for image upload)

Image uploads use **Cloudinary** so images persist permanently after deployment.

1. Go to [cloudinary.com](https://cloudinary.com) → **Sign Up Free**
2. After login, go to your **Dashboard**
3. Copy these 3 values:
   - **Cloud Name**
   - **API Key**
   - **API Secret**
4. Open `server/.env` and fill them in:
   ```
   CLOUDINARY_CLOUD_NAME=your_cloud_name_here
   CLOUDINARY_API_KEY=your_api_key_here
   CLOUDINARY_API_SECRET=your_api_secret_here
   ```

---

## Step 2 — Deploy on Render (Recommended — Free Tier)

### A) Push code to GitHub first
```bash
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/YOUR_USERNAME/sumii-art-world.git
git push -u origin main
```

### B) Create a Web Service on Render
1. Go to [render.com](https://render.com) → **New → Web Service**
2. Connect your GitHub repo
3. Set these settings:

| Setting | Value |
|---|---|
| **Root Directory** | `server` |
| **Build Command** | `npm install` |
| **Start Command** | `node server.js` |
| **Node Version** | `18` |

4. Add **Environment Variables** (click "Add Environment Variable" for each):

| Key | Value |
|---|---|
| `NODE_ENV` | `production` |
| `MONGODB_URI` | *(your MongoDB Atlas URI)* |
| `JWT_SECRET` | *(any long random string)* |
| `ADMIN_EMAIL` | `sumashreedhar074@gmail.com` |
| `ADMIN_PASSWORD` | `suma@1999` |
| `CLOUDINARY_CLOUD_NAME` | *(from Step 1)* |
| `CLOUDINARY_API_KEY` | *(from Step 1)* |
| `CLOUDINARY_API_SECRET` | *(from Step 1)* |
| `CLIENT_URL` | *(your Render app URL, e.g. https://sumii-art-world.onrender.com)* |

### C) Deploy the frontend (build & serve from Express)
The server already serves the React build in production. You need to build the client first:

1. In Render, set **Build Command** to:
   ```
   cd ../client && npm install && npm run build && cd ../server && npm install
   ```
2. Or add a **build step** before the server starts.

### Alternative — Use `Root Directory = .` (project root):
| Setting | Value |
|---|---|
| **Build Command** | `npm run build` |
| **Start Command** | `npm start` |

This uses the root `package.json` which builds the client then starts the server.

---

## Step 3 — MongoDB Atlas (Already Configured)

Your MongoDB Atlas cluster is already connected. Just make sure:
- ✅ The cluster allows connections from `0.0.0.0/0` (all IPs) in Atlas Network Access
- ✅ The connection string in `MONGODB_URI` env var is correct

---

## Step 4 — Seed the Database (first time only)

After deployment, run the seed script once to populate initial designs:

In Render → **Shell** tab:
```bash
node seed.js
```

---

## ✅ What Works in Production

| Feature | Status |
|---|---|
| User Signup / Login | ✅ JWT auth |
| Admin Login → Dashboard | ✅ Auto-detect |
| Upload Design Image | ✅ Cloudinary (permanent URLs) |
| View Designs | ✅ Real DB designs only |
| Book a Design | ✅ Saved to MongoDB |
| Admin Accept / Reject Bookings | ✅ |
| My Bookings page | ✅ |
| Contact Form | ✅ |

---

## Local Development

```bash
# Terminal 1 — Backend
cd server
npm run dev

# Terminal 2 — Frontend  
cd client
npm run dev
```

App runs at: http://localhost:5173
