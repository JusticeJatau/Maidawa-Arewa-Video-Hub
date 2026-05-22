# 🎬 Maidawa Arewa Video Hub

> A full-stack video platform built for **Maidawa Arewa News Media** to publish, manage, and stream video content — with a dedicated admin dashboard and cross-platform mobile app.

![Platform](https://img.shields.io/badge/Platform-Web%20%2B%20Android-blue?style=for-the-badge)
![Stack](https://img.shields.io/badge/Stack-MERN-green?style=for-the-badge)
![Status](https://img.shields.io/badge/Status-Live-brightgreen?style=for-the-badge)
![Storage](https://img.shields.io/badge/Storage-Backblaze%20B2-orange?style=for-the-badge)

---

## 🌍 Live Demo

| App | URL |
|---|---|
| 🖥️ Admin Dashboard | [maidawa-arewa-video-hub.vercel.app](https://maidawa-arewa-video-hub.vercel.app/login) |
| 📱 Android App | Coming soon |

---

## 📌 About

Maidawa Arewa Video Hub is a centralized video content platform built for **Maidawa Arewa News Media** — a Nigerian news outlet. The platform allows the media team to upload, organize, and publish video content while giving their audience a clean mobile experience to watch, search, and engage with videos.

The project consists of three parts:
- **Admin Web Dashboard** — for content managers and editors
- **REST API Backend** — powers both the web and mobile app
- **React Native Mobile App** — for the end-user audience

---

## ✨ Features

### 🖥️ Admin Dashboard
- **Dashboard Overview** — Total videos uploaded, videos added this week, recent uploads, and total watch counts at a glance
- **Video Management** — Upload videos directly or add existing YouTube video links; edit and delete videos
- **Category Management** — Create and manage content categories to organize videos
- **User Management** — View all users; assign roles (Admin, Editor, Normal User); disable accounts

### 📱 Mobile App (React Native)
- **Authentication** — Email & password login and signup with **email verification**
- **Video Feed** — Browse and stream videos with smooth playback
- **Search** — Search videos by title or category
- **Comments** — Users can comment on videos
- **Share** *(in development)*

### 🔧 Backend API
- RESTful API built with Node.js + Express
- JWT-based authentication and role-based access control
- Email verification system on signup
- Backblaze B2 cloud storage integration for video files
- MongoDB Atlas for database

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| Frontend (Admin) | React, Tailwind CSS |
| Mobile App | React Native |
| Backend | Node.js, Express.js |
| Database | MongoDB Atlas |
| Cloud Storage | Backblaze B2 |
| Hosting (Frontend) | Vercel |
| Hosting (Backend) | Render |
| Auth | JWT + Email Verification |

---

## 📁 Project Structure

```
maidawa-arewa-video-hub/
├── admin/                  # React admin dashboard (Vercel)
│   ├── src/
│   │   ├── pages/
│   │   │   ├── Dashboard.jsx
│   │   │   ├── Videos.jsx
│   │   │   ├── Categories.jsx
│   │   │   └── Users.jsx
│   │   └── components/
├── backend/                # Node.js + Express API (Render)
│   ├── routes/
│   ├── controllers/
│   ├── models/
│   └── middleware/
└── mobile/                 # React Native app
    ├── screens/
    ├── components/
    └── navigation/
```

---

## 🚀 Getting Started

### Prerequisites
- Node.js v18+
- MongoDB Atlas account
- Backblaze B2 account
- React Native environment set up

### 1. Clone the repository

```bash
git clone https://github.com/JusticeJatau/maidawa-arewa-video-hub.git
cd maidawa-arewa-video-hub
```

### 2. Backend Setup

```bash
cd backend
npm install
```

Create a `.env` file:

```env
PORT=5000
MONGO_URI=your_mongodb_atlas_connection_string
JWT_SECRET=your_jwt_secret
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_email_password
BACKBLAZE_KEY_ID=your_backblaze_key_id
BACKBLAZE_APP_KEY=your_backblaze_app_key
BACKBLAZE_BUCKET_NAME=your_bucket_name
```

```bash
npm run dev
```

### 3. Admin Dashboard Setup

```bash
cd admin
npm install
```

Create a `.env` file:

```env
VITE_API_URL=http://localhost:5000/api
```

```bash
npm run dev
```

### 4. Mobile App Setup

```bash
cd mobile
npm install
npx react-native run-android
```

---

## 📱 Admin Dashboard Screens

### Dashboard
Real-time stats overview:
- Total videos on the platform
- Videos uploaded this week
- Recent uploads list
- Total watch counts

### Videos Page
- Upload new video files (stored on Backblaze B2)
- Add existing videos by YouTube link
- Edit video title, description, category
- Delete videos

### Categories Page
- Add new categories (e.g. Politics, Sports, Entertainment)
- Edit or remove existing categories

### Users Page
- View all registered users
- Assign roles: `Admin` | `Editor` | `User`
- Disable/enable accounts

---

## 🔐 Role System

| Role | Permissions |
|---|---|
| **Admin** | Full access — manage videos, categories, users, roles |
| **Editor** | Can upload and manage videos and categories |
| **User** | View-only access via mobile app |

---

## 📦 Deployment

| Service | Purpose |
|---|---|
| [Vercel](https://vercel.com) | Admin dashboard hosting |
| [Render](https://render.com) | Backend API hosting |
| [Backblaze B2](https://www.backblaze.com/b2/cloud-storage.html) | Video file storage |
| [MongoDB Atlas](https://www.mongodb.com/atlas) | Cloud database |

---

## 🗺️ Roadmap

- [x] Admin dashboard with full CRUD
- [x] Email verification on signup
- [x] Video upload + YouTube link support
- [x] Role-based access control
- [x] Search and comments on mobile
- [ ] Video share feature
- [ ] Push notifications
- [ ] Publish Android app to Play Store
- [ ] Video view count tracking per user

---

## 👨‍💻 Author

**Justice Jatau**
- GitHub: [@JusticeJatau](https://github.com/JusticeJatau)
- Email: jataujustice200@gmail.com

---

## 📄 License

This project is private and built specifically for **Maidawa Arewa News Media**.

---

> Built with 💪 from Nigeria — proof that great software can come from anywhere.
