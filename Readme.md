# Team Leader: Tervadiya Harmis 
# Team Member: Ravaliya Tushar 

# Skill Swap Platform

A mini application that enables users to list their skills, request others in return, and manage skill swaps with feedback and notifications.

---

## Tech Stack
- **Frontend:** React, TailwindCSS
- **Backend:** Node.js, Express
- **Database:** MongoDB
- **Authentication:** Clerk
- **Image Storage:** Cloudinary

---

## Setup Instructions

### Prerequisites
- Node.js (v16+ recommended)
- npm or yarn
- MongoDB instance (local or cloud)
- Cloudinary account (for image uploads)
- Clerk account (for authentication)

### Backend Setup
1. `cd server`
2. Install dependencies:
   ```bash
   npm install
   # or
   yarn install
   ```
3. Create a `.env` file in the `server` directory with the following variables:
   ```env
   MONGODB_URI=your_mongodb_connection_string
   CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
   CLOUDINARY_API_KEY=your_cloudinary_api_key
   CLOUDINARY_API_SECRET=your_cloudinary_api_secret
   CLERK_SECRET_KEY=your_clerk_secret_key
   PORT=5000
   ```
4. Start the backend server:
   ```bash
   npm run dev
   # or
   yarn dev
   ```

### Frontend Setup
1. `cd client`
2. Install dependencies:
   ```bash
   npm install
   # or
   yarn install
   ```
3. Create a `.env` file in the `client` directory with your Clerk frontend keys and API base URL if needed.
4. Start the frontend app:
   ```bash
   npm run dev
   # or
   yarn dev
   ```

---


Problem Statement 1:
Skill Swap Platform
Overview:
Develop a Skill Swap Platform — a mini application that enables users to list their skills and
request others in return

Features:
Basic info: Name, location (optional), profile photo (optional)
List of skills offered
List of skills wanted
Availability (e.g., weekends, evenings)
User can make their profile public or private.
Users can browse or search others by skill (e.g., “Photoshop” or “Excel”)
Request & Accept Swaps:
○ Accept or reject swap offers
○ Show current and pending swap requests
Ratings or feedback after a swap
The user is also able to delete the swap request if it is not accepted.

Admin Role
● Reject inappropriate or spammy skill descriptions.
● Ban users who violate platform policies.
● Monitor pending, accepted, or cancelled swaps.
● Send platform-wide messages (e.g., feature updates, downtime alerts).
● Download reports of user activity, feedback logs, and swap stats.