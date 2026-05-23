# 🌿 Mehndi Mahal – Premium Mehendi Booking Platform

A full-stack MERN-style Mehendi Booking Web Application built with React, Node.js, Express.js, and Supabase.

## 🚀 Quick Start

### 1. Setup Supabase
1. Create a free project at [supabase.com](https://supabase.com)
2. Run `supabase_schema.sql` in your Supabase SQL Editor
3. Copy your **Project URL** and **Anon Key** from Settings → API

### 2. Client Setup
```bash
cd client
cp .env.example .env.local
# Fill in your Supabase credentials in .env.local
npm install
npm run dev
```

### 3. Server Setup
```bash
cd server
cp .env.example .env
# Fill in Supabase Service Key + SMTP credentials in .env
npm install
npm run dev
```

Open http://localhost:5173

---

## 🗂️ Project Structure

```
DesignWeb-akka/
├── client/                 # React + Vite frontend
│   └── src/
│       ├── components/     # Navbar, Footer
│       ├── context/        # AuthContext
│       ├── layouts/        # MainLayout, AdminLayout
│       ├── lib/            # Supabase client
│       ├── pages/          # All pages
│       │   ├── auth/       # Login, Signup, ForgotPassword
│       │   └── admin/      # AdminDashboard, AdminBookings, AdminDesigns
│       ├── routes/         # AppRoutes with protected routes
│       └── services/       # Axios API service
│
├── server/                 # Express.js backend
│   ├── config/             # Supabase client
│   ├── middleware/         # JWT auth, admin guard
│   ├── routes/             # designs, bookings, contact, auth
│   └── services/           # Email service (Nodemailer)
│
└── supabase_schema.sql     # Database schema + seed data
```

## ✨ Features

| Feature | Status |
|---------|--------|
| Supabase Authentication | ✅ |
| User Signup / Login / Forgot Password | ✅ |
| Protected Routes (User & Admin) | ✅ |
| Design Browsing with Filters | ✅ |
| Booking Form with Live Price Calc | ✅ |
| GST Calculation | ✅ |
| Email Notifications (Admin + Customer) | ✅ |
| Admin Dashboard | ✅ |
| Admin Bookings Management | ✅ |
| Admin Designs CRUD | ✅ |
| Gallery with Lightbox | ✅ |
| Contact Form | ✅ |
| WhatsApp Integration | ✅ |
| Framer Motion Animations | ✅ |
| Responsive Mobile Design | ✅ |
| Toast Notifications | ✅ |
| Loading Skeletons | ✅ |

## 🔐 Admin Setup

To make a user an admin, run in Supabase SQL:
```sql
UPDATE users SET role = 'admin' WHERE email = 'your@email.com';
```

## 📧 Email Setup (Gmail)

1. Enable 2FA on your Gmail account
2. Generate an **App Password**: Google Account → Security → App Passwords
3. Use that app password as `SMTP_PASS` in server `.env`

## 🚀 Deployment

**Frontend → Vercel:**
```bash
cd client && npm run build
# Deploy dist/ to Vercel
```

**Backend → Render/Railway:**
- Point to `server/server.js`
- Add all env variables from `.env.example`

---

## 🎨 Design System

- **Primary**: Gold (`#C9A84C`), Dark Brown (`#3D1A0A`)
- **Background**: Cream (`#FDF6EC`), Beige (`#F5E6D3`)
- **Fonts**: Playfair Display (headings) + Poppins (body)
- **UI**: Glassmorphism cards, smooth Framer Motion animations
