# Team Leader: Tervadiya Harmis

# Team Member: Ravaliya Tushar

# Skill Swap Platform

A mini application that enables users to list their skills, request others in return, and manage skill swaps with feedback and notifications.

---

## 🚀 Tech Stack

- **Frontend:** React 19, TailwindCSS 4, Vite
- **Backend:** Node.js, Express.js
- **Database:** MongoDB
- **Authentication:** Clerk (Google Sign-in)
- **Image Storage:** Cloudinary
- **HTTP Client:** Axios

---

## 🎯 Features

### Core Features

- ✅ **User Authentication** - Google Sign-in via Clerk
- ✅ **User Profiles** - Name, email, profile picture, skills
- ✅ **Skill Management** - List skills offered and wanted
- ✅ **User Search** - Search by name, email, or skills
- ✅ **Responsive Design** - Mobile-first responsive UI
- ✅ **Real-time Search** - Instant filtering and results

### Advanced Features

- 🔄 **Skill Swapping** - Request and accept skill exchanges
- ⭐ **Rating System** - Feedback after completed swaps
- 🔔 **Notifications** - Real-time notifications
- 👨‍💼 **Admin Panel** - User management and moderation
- 📊 **Analytics** - User activity and swap statistics

---

### Key Backend Features

- 🔐 **Clerk Integration** - Secure authentication
- 🗄️ **MongoDB Integration** - NoSQL database
- 📸 **Cloudinary Integration** - Image upload and storage
- 🔒 **JWT Authentication** - Secure API access
- 📝 **Input Validation** - Request data validation
- 🚀 **CORS Configuration** - Cross-origin requests
- 📊 **Error Handling** - Comprehensive error management

---

### Responsive Design

- 📱 **Mobile First** - Optimized for mobile devices
- 🖥️ **Desktop Friendly** - Enhanced desktop experience
- 🎯 **Breakpoint System** - Tailwind responsive classes
- 🎨 **Modern UI** - Clean and intuitive design

### Key Frontend Features

- ⚡ **Real-time Search** - Instant filtering
- 📱 **Responsive Layout** - Works on all devices
- 🔄 **Loading States** - User feedback during operations
- 🚨 **Error Handling** - Graceful error display
- 🎨 **Modern UI/UX** - Clean and intuitive interface

---

## 🚀 Setup Instructions

### Prerequisites

- Node.js (v16+ recommended)
- npm or yarn
- MongoDB instance (local or cloud)
- Cloudinary account (for image uploads)
- Clerk account (for authentication)

### Backend Setup

1. Navigate to server directory:

   ```bash
   cd server
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Create `.env` file in `server` directory:

   ```env
   MONGODB_URI=your_mongodb_connection_string
   CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
   CLOUDINARY_API_KEY=your_cloudinary_api_key
   CLOUDINARY_API_SECRET=your_cloudinary_api_secret
   CLERK_SECRET_KEY=your_clerk_secret
   PORT=8000
   ```

4. Start the backend server:
   ```bash
   npm run dev
   ```

### Frontend Setup

1. Navigate to client directory:

   ```bash
   cd client
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Create `.env` file in `client` directory:

   ```env
   VITE_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
   VITE_API_BASE_URL=http://localhost:8000
   ```

4. Start the frontend app:
   ```bash
   npm run dev
   ```

---

## 🔧 Development

### Available Scripts

#### Backend (server/)

```bash
npm run dev          # Start development server
npm run start        # Start production server
npm run build        # Build for production
```

#### Frontend (client/)

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run preview      # Preview production build
npm run lint         # Run ESLint
```

---

## 🎯 Problem Statement

### Skill Swap Platform Overview

Develop a Skill Swap Platform — a mini application that enables users to list their skills and request others in return.
