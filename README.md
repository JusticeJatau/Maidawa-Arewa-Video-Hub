
# 🎬 Maidawa Arewa Video Hub

> An independently developed, full-stack video content management and streaming platform featuring an administrative dashboard, RESTful backend API, and cross-platform mobile application.

---

## 📑 Table of Contents

- [Project Overview](#-project-overview)
- [Problem Statement](#-problem-statement)
- [Key Features](#-key-features)
- [Screenshots & Demonstrations](#-screenshots--demonstrations)
- [System Architecture](#-system-architecture)
- [Technology Stack](#️-technology-stack)
- [Repository Structure](#-repository-structure)
- [Database Design](#️-database-design)
- [API Documentation](#-api-documentation)
- [Authentication & Security](#-authentication--security)
- [Local Installation](#-local-installation)
- [Environment Configuration](#️-environment-configuration)
- [Testing & Quality Assurance](#-testing--quality-assurance)
- [Deployment & Production History](#️-deployment--production-history)
- [Development Roadmap](#️-development-roadmap)
- [Ownership & Intellectual Property](#-ownership--intellectual-property)
- [Contact](#-contact)

---

## 🌍 Project Overview

**Maidawa Arewa Video Hub** is an independently conceived and developed video content management and distribution platform created by **Justice Jatau**.

The project was originally envisioned for Maidawa Arewa News Media, with the goal of providing a centralized digital platform for publishing, organizing, managing, and distributing video content.

Although the initial concept was intended for the media organization, the proposed project was not funded or commissioned to completion. The software was independently developed and remains the intellectual property of its creator.

The platform is designed around three major components:

- **Administrative Dashboard:** A web-based interface for managing platform content, users, categories, and video uploads.
- **Backend API:** A centralized RESTful API responsible for application logic, authentication, authorization, and data management.
- **Mobile Application:** A React Native application designed to provide users with access to published video content.

The system uses a modular architecture that separates presentation, business logic, and data management.

## 🎯 Problem Statement

Managing and distributing video content across digital platforms can become difficult when content, users, and administrative operations are handled through disconnected systems.

This project explores a centralized solution to the following challenges:

- Fragmented video content management.
- Difficulty organizing videos into structured categories.
- Limited administrative control over published content.
- Lack of centralized user and role management.
- The need for a dedicated mobile experience for video consumption.
- The difficulty of maintaining a shared backend for multiple client applications.

Maidawa Arewa Video Hub addresses these challenges through a centralized backend supported by dedicated web and mobile interfaces.

---

## ✨ Key Features

### 🖥️ Administrative Dashboard

- **Dashboard Overview:** Displays platform statistics, including total uploaded videos, weekly uploads, recent content, and watch counts.
- **Video Management:** Upload video files, add YouTube video links, edit video information, and delete content.
- **Category Management:** Create, edit, and organize video categories.
- **User Management:** View registered users and manage their account status.
- **Role Management:** Assign administrative permissions to Admin, Editor, and User accounts.

### 📱 Mobile Application

Built with React Native.

- **Authentication:** Email and password registration and login.
- **Email Verification:** Email verification during account registration.
- **Video Feed:** Browse and stream published videos.
- **Search:** Search video content by title or category.
- **Comments:** Interact with video content through comments.
- **Sharing:** Video sharing functionality (in development).

### 🔧 Backend API

Built with Node.js and Express.js.

- RESTful API architecture.
- JWT-based authentication.
- Role-based access control.
- Email verification functionality.
- MongoDB database integration.
- Backblaze B2 cloud storage integration.
- Centralized application logic for web and mobile clients.

---

## 📸 Screenshots & Demonstrations

### 🖥️ Admin Dashboard

| Login | Dashboard | Video Management |
|---|---|---|
| ![Admin Login](./screenshots/admin%20login.png) | ![Dashboard](./screenshots/admin%20dashboard.png) | ![Videos](./screenshots/admin%20video%20management%20page.png) |

| Category Management | User Management |
|---|---|
| ![Categories](./screenshots/admin%20category%20management%20page.png) | ![Users](./screenshots/admin%20user%20management%20page.png) |

---

### 📱 Mobile App

| Login | Home | Video Player |
|---|---|---|
| ![Login](./screenshots/login%20screen.png) | ![Home](./screenshots/Home%20screen%20dark.png) | ![Video](./screenshots/video%20screen%20dark.png) |

| Comments | Profile | Settings |
|---|---|---|
| ![Comments](./screenshots/comment%20screen.png) | ![Profile](./screenshots/Profile%20screen.png) | ![Settings](./screenshots/Settings%20screen.png) |

---

## 🏗️ System Architecture

The application follows a client-server architecture with a centralized backend API.

### High-Level Architecture

```text
             ┌──────────────────────┐
             │   React Native App   │
             │     Mobile Client    │
             └──────────┬───────────┘
                        │
                        │ HTTP / REST API
                        │
             ┌──────────▼───────────┐
             │   Node.js + Express  │
             │     Backend API      │
             └──────────┬───────────┘
                        │
             ┌──────────┼───────────┐
             │          │           │
       ┌─────▼────┐ ┌───▼─────┐ ┌──▼─────────┐
       │ MongoDB  │ │Backblaze│ │ Email      │
       │ Atlas    │ │ B2      │ │ Service    │
       └──────────┘ └─────────┘ └────────────┘
                        ▲
                        │
             ┌──────────┴───────────┐
             │   React Admin Web    │
             │     Dashboard        │
             └─────────────────────┘
```

### Architectural Responsibilities

| Component | Responsibility |
|---|---|
| React Admin | Administrative interface and content management |
| React Native | Mobile video consumption and user interaction |
| Express API | Business logic, request handling and authorization |
| MongoDB Atlas | Application data persistence |
| Backblaze B2 | Video file storage |
| Email Service | Account verification and email delivery |

The backend acts as the central communication layer between the client applications and external services.

---

## 🛠️ Technology Stack

| Layer | Technology |
|---|---|
| Admin Frontend | React |
| Styling | Tailwind CSS |
| Mobile Application | React Native |
| Backend Runtime | Node.js |
| Backend Framework | Express.js |
| Database | MongoDB Atlas |
| Cloud Storage | Backblaze B2 |
| Authentication | JSON Web Tokens (JWT) |
| Email Verification | Email service integration |
| Frontend Hosting | Vercel |
| Backend Hosting | Render |
| Version Control | Git and GitHub |

---

## 📁 Repository Structure

```text
maidawa-arewa-video-hub/
│
├── admin/
│   ├── src/
│   │   ├── pages/
│   │   │   ├── Dashboard.jsx
│   │   │   ├── Videos.jsx
│   │   │   ├── Categories.jsx
│   │   │   └── Users.jsx
│   │   └── components/
│   └── package.json
│
├── backend/
│   ├── routes/
│   ├── controllers/
│   ├── models/
│   ├── middleware/
│   ├── package.json
│   └── ...
│
├── mobile/
│   ├── screens/
│   ├── components/
│   ├── navigation/
│   └── ...
│
├── screenshots/
│
├── OWNERSHIP.md
├── README.md
└── ...
```

*Note: This is a documented overview. Refer to the actual repository for the complete directory structure.*

---

## 🗄️ Database Design

The application uses MongoDB Atlas as its primary database.

The database layer supports the management of application users, video content, categories, and user-generated interactions.

### Core Data Entities

| Entity | Purpose |
|---|---|
| Users | Stores user account information and role assignments |
| Videos | Stores video metadata, descriptions, categories, and storage references |
| Categories | Organizes video content into manageable groups |
| Comments | Stores user comments associated with videos |

### Data Relationships

- Users can publish comments.
- Videos can belong to categories.
- Videos can have multiple associated comments.
- User roles determine administrative access.

*The entity list and relationships should be verified against the actual MongoDB models before being treated as a complete database specification.*

---

## 🔌 API Documentation

The backend exposes a RESTful API consumed by the administrative dashboard and mobile application.

### API Base URL

```text
Production: https://YOUR-BACKEND-DOMAIN/api
Local:      http://localhost:5000/api
```

### API Responsibilities

| Module | Responsibility |
|---|---|
| Authentication | Registration, login and email verification |
| Users | User information and account administration |
| Videos | Video creation, retrieval, editing and deletion |
| Categories | Category management |
| Comments | Video comment operations |

### API Documentation Status

Detailed endpoint documentation, including request parameters, response formats, authentication requirements, and error handling, will be maintained as the API documentation is completed.

---

## 🔐 Authentication & Security

Security is an important part of the platform architecture.

Implemented security-related functionality includes:

- JWT-based authentication.
- Role-based access control.
- Email verification during registration.
- Protected administrative operations.
- User account management.

### Role-Based Access Control

| Role | Permissions |
|---|---|
| **Admin** | Full administrative access, including video, category, user, and role management |
| **Editor** | Video and category management |
| **User** | Access to user-facing mobile application functionality |

Sensitive configuration values, including database credentials, JWT secrets, and cloud storage keys, must be stored in environment variables rather than committed to source control.

---

## 🚀 Local Installation

### Prerequisites

- Node.js v18 or later.
- npm.
- MongoDB Atlas account or compatible MongoDB instance.
- Backblaze B2 account.
- React Native development environment.
- Android Studio and Android SDK for Android development.

### 1. Clone the Repository

```bash
git clone https://github.com/JusticeJatau/maidawa-arewa-video-hub.git

cd maidawa-arewa-video-hub
```

### 2. Backend Setup

```bash
cd backend

npm install
```

Create a `.env` file in the backend directory and configure the required variables.

Start the development server:

```bash
npm run dev
```

### 3. Admin Dashboard Setup

```bash
cd admin

npm install
```

Configure the frontend environment variables, then run:

```bash
npm run dev
```

### 4. Mobile Application Setup

```bash
cd mobile

npm install

npx react-native run-android
```

*Mobile build requirements may vary depending on the React Native version and local Android development environment.*

---

## ⚙️ Environment Configuration

The backend requires environment-specific configuration.

Example:

```env
PORT=5000

MONGO_URI=your_mongodb_connection_string

JWT_SECRET=your_jwt_secret

EMAIL_USER=your_email_address
EMAIL_PASS=your_email_password

BACKBLAZE_KEY_ID=your_backblaze_key_id
BACKBLAZE_APP_KEY=your_backblaze_app_key
BACKBLAZE_BUCKET_NAME=your_bucket_name
```

Admin frontend:

```env
VITE_API_URL=http://localhost:5000/api
```

**Important:** Never commit actual credentials, private keys, passwords, or production environment files to GitHub.

Use `.env.example` to document required configuration variables without exposing their values.

---

## 🧪 Testing & Quality Assurance

The development process includes local implementation, testing, and validation before changes are deployed.

The testing documentation will cover:

- Authentication and authorization.
- API request and response validation.
- Video upload and storage operations.
- Category and user management.
- Mobile navigation and video playback.
- Frontend and backend integration.
- Production deployment verification.

Automated test coverage, CI workflows, and test execution reports will be documented as they are introduced and verified.

---

## ☁️ Deployment & Production History

The project uses cloud services to host its web interface, backend API, database, and media storage.

### Deployment Infrastructure

| Service | Purpose |
|---|---|
| [Vercel](https://vercel.com) | Administrative dashboard hosting |
| [Render](https://render.com) | Backend API hosting |
| [MongoDB Atlas](https://www.mongodb.com/atlas) | Managed database |
| [Backblaze B2](https://www.backblaze.com/b2/cloud-storage.html) | Video storage |

### Live Application

| Application | Access |
|---|---|
| Admin Dashboard | [Open Dashboard](https://maidawa-arewa-video-hub.vercel.app/login) |
| Android Application | Coming soon |

### Development History

The repository's Git history provides a record of the project's development, implementation changes, and ongoing improvements.

Future development milestones, releases, and deployment changes will be documented through GitHub commits, pull requests, release notes, and the project changelog.

---

## 🗺️ Development Roadmap

### Implemented Features

- [x] Administrative dashboard.
- [x] Video management operations.
- [x] Video upload and YouTube link support.
- [x] Category management.
- [x] User management.
- [x] Role-based access control.
- [x] Email verification.
- [x] Mobile video feed.
- [x] Search functionality.
- [x] Video comments.

### Planned Improvements

- [ ] Video sharing functionality.
- [ ] Push notifications.
- [ ] Android Play Store publication.
- [ ] Video view tracking per user.
- [ ] Expanded automated test coverage.
- [ ] Comprehensive API documentation.
- [ ] CI/CD workflow improvements.
- [ ] Expanded technical architecture documentation.

---

## 📜 Ownership & Intellectual Property

**Maidawa Arewa Video Hub is an independently developed proprietary software project owned by Justice Jatau.**

The project was originally envisioned for Maidawa Arewa News Media. However, the proposed project was not funded or commissioned to completion, and no intellectual property ownership or exclusive development rights were transferred to the organization.

The original software implementation, independently developed architecture, source code, and project documentation remain the intellectual property of the creator, subject to applicable third-party rights and licences.

This repository is provided for review and demonstration purposes.

**No open-source licence is granted.** No permission to reproduce, redistribute, modify, sublicense, or commercially exploit this software is granted without prior written authorization from the copyright owner.

For the formal ownership declaration, refer to [`OWNERSHIP.md`](OWNERSHIP.md).

---

## 👨‍💻 Contact

**Justice Jatau**

Independent Software Developer

- GitHub: [@JusticeJatau](https://github.com/JusticeJatau)
- Email: jataujustice200@gmail.com

For collaboration, software development, licensing, or project-related inquiries, please contact the author.

---

> Independently built with dedication from Nigeria.  
> Demonstrating practical software engineering through real-world product development.

**© 2026 Justice Jatau. All rights reserved.**
