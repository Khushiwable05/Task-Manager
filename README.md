# TaskFlow — Mini Task Management Web Application

A full-stack, production-ready Task Management Web Application engineered with **React.js**, **Tailwind CSS**, **Node.js**, **Express.js**, and **MongoDB (Mongoose)**. It provides end-to-end task lifecycle management with live search, multi-field filtering, real-time status transitions, robust input validation, and clean RESTful API architecture.

---

## Table of Contents
1. [Project Overview](#project-overview)
2. [Technologies Used](#technologies-used)
3. [Folder Structure](#folder-structure)
4. [Database Schema](#database-schema)
5. [Setup & Installation](#setup--installation)
   - [Prerequisites](#prerequisites)
   - [Backend Configuration](#backend-configuration)
   - [Frontend Configuration](#frontend-configuration)
   - [Database Seeding](#database-seeding)
6. [API Documentation](#api-documentation)
   - [Endpoints Summary](#endpoints-summary)
   - [Request & Response Specifications](#request--response-specifications)
   - [Error Handling Standards](#error-handling-standards)
7. [Frontend Features & UI Design](#frontend-features--ui-design)
8. [Production Deployment Guide](#production-deployment-guide)
   - [Backend Deployment (Render / Railway)](#backend-deployment-render--railway)
   - [Frontend Deployment (Vercel / Netlify)](#frontend-deployment-vercel--netlify)
9. [License](#license)

---

## 1. Project Overview

TaskFlow is designed to meet strict production-level engineering requirements:
- **Modular Monorepo Structure**: Separate `backend` and `frontend` environments with isolated configurations.
- **Strict Data Validation**: Express middleware and Mongoose schema constraints prevent invalid statuses, bad ObjectIds, or empty titles.
- **Fluid User Experience**: Optimistic state updates, debounced search queries, interactive metric cards, accessible modals with keyboard shortcuts (`Escape`), and responsive design for mobile, tablet, and desktop screens.

---

## 2. Technologies Used

### Frontend
- **React 18** (Vite build system)
- **Tailwind CSS** (Utility-first styling with customized color palette)
- **Lucide React** (Modern SVG iconography)
- **Axios** (Configured HTTP client with centralized error interception)

### Backend
- **Node.js** (LTS runtime)
- **Express.js** (HTTP routing framework)
- **Mongoose 8** (MongoDB Object Data Modeling library)
- **Morgan** (HTTP request logger)
- **CORS** (Cross-Origin Resource Sharing handling)
- **Dotenv** (Environment variable management)

### Database
- **MongoDB** (Local instance or MongoDB Atlas cloud cluster)

---

## 3. Folder Structure

```
mini-task-manager/
├── backend/
│   ├── src/
│   │   ├── config/
│   │   │   └── db.js                 # MongoDB connection & reconnection events
│   │   ├── controllers/
│   │   │   └── task.controller.js    # CRUD handlers & query filtering logic
│   │   ├── middleware/
│   │   │   ├── errorHandler.js       # Centralized 404, CastError & 500 handler
│   │   │   └── validateTask.js       # Request body sanitization & validation
│   │   ├── models/
│   │   │   └── task.model.js         # Mongoose schema with enums & indexes
│   │   ├── routes/
│   │   │   └── task.routes.js        # Express router mapping /api/tasks
│   │   ├── server.js                 # Express server bootstrap & graceful shutdown
│   │   └── seed.js                   # Starter database seeder script
│   ├── .env.example                  # Backend environment template
│   ├── .gitignore
│   └── package.json                  # Backend dependencies & npm scripts
│
├── frontend/
│   ├── public/                       # Static public assets
│   ├── src/
│   │   ├── api/
│   │   │   └── taskService.js        # Axios instance & typed API service methods
│   │   ├── components/
│   │   │   ├── Navbar.jsx            # Brand header & primary "Create Task" button
│   │   │   ├── StatsOverview.jsx     # Metric cards with interactive status filtering
│   │   │   ├── FilterBar.jsx         # Debounced search, status/priority pills, reset
│   │   │   ├── TaskList.jsx          # Grid view, loading skeletons & empty states
│   │   │   ├── TaskCard.jsx          # Interactive card with quick status switcher
│   │   │   ├── TaskModal.jsx         # Modal for Create and Edit with validation
│   │   │   └── DeleteConfirmModal.jsx# Safe delete confirmation dialog
│   │   ├── App.jsx                   # Application orchestration & state management
│   │   ├── index.css                 # Tailwind directives & typography styling
│   │   └── main.jsx                  # React DOM mount point
│   ├── index.html
│   ├── vite.config.js
│   ├── tailwind.config.js
│   ├── postcss.config.js
│   ├── .env.example                  # Frontend environment template
│   ├── .gitignore
│   └── package.json                  # Frontend dependencies & npm scripts
│
└── README.md                         # Comprehensive documentation
```

---

## 4. Database Schema

The `Task` model is defined in `backend/src/models/task.model.js`:

| Field | Type | Required | Default | Allowed Values / Constraints |
|---|---|---|---|---|
| `title` | `String` | **Yes** | — | Trimmed, 1–150 characters |
| `description` | `String` | No | `""` | Trimmed, up to 1000 characters |
| `status` | `String` (Enum) | **Yes** | `'Pending'` | `'Pending'`, `'In Progress'`, `'Completed'` |
| `priority` | `String` (Enum) | **Yes** | `'Medium'` | `'Low'`, `'Medium'`, `'High'` |
| `createdAt` | `Date` | Auto | Timestamp | Automatically managed via `{ timestamps: true }` |
| `updatedAt` | `Date` | Auto | Timestamp | Automatically managed via `{ timestamps: true }` |

- **Indexes**:
  - Compound Index: `{ status: 1, priority: 1, createdAt: -1 }` for high-throughput filtering.
  - Text Index: `{ title: 'text', description: 'text' }` for keyword lookups.

---

## 5. Setup & Installation

### Prerequisites
- [Node.js](https://nodejs.org/) (version 18+ or 20+ LTS recommended)
- [npm](https://www.npmjs.com/) or `pnpm` / `yarn`
- [MongoDB](https://www.mongodb.com/) (running locally on port 27017 or a free cloud [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) cluster)

---

### Backend Configuration

1. Navigate to the `backend` directory:
   ```bash
   cd backend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Configure environment variables:
   Copy `.env.example` to `.env`:
   ```bash
   cp .env.example .env
   ```
   Ensure `.env` matches your environment:
   ```env
   PORT=5000
   NODE_ENV=development
   MONGODB_URI=mongodb://localhost:27017/taskmanager
   CLIENT_URL=http://localhost:5173
   ```
   *(For MongoDB Atlas, replace `MONGODB_URI` with your connection string: `mongodb+srv://<username>:<password>@cluster0.mongodb.net/taskmanager?retryWrites=true&w=majority`)*

4. (Optional) Seed the database with sample tasks:
   ```bash
   npm run seed
   ```

5. Start the backend server:
   ```bash
   # Development mode with hot reload
   npm run dev

   # Or standard production mode
   npm start
   ```
   The backend will be live at `http://localhost:5000`.

---

### Frontend Configuration

1. Open a new terminal and navigate to the `frontend` directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Configure environment variables:
   Copy `.env.example` to `.env`:
   ```bash
   cp .env.example .env
   ```
   Verify the API base URL matches your backend:
   ```env
   VITE_API_BASE_URL=http://localhost:5000/api
   ```

4. Launch the Vite development server:
   ```bash
   npm run dev
   ```
   Open your browser and navigate to `http://localhost:5173`.

---

## 6. API Documentation

Base URL: `http://localhost:5000/api`

### Endpoints Summary

| Method | Endpoint | Description | Query Parameters |
|---|---|---|---|
| `GET` | `/health` | Server health & uptime check | None |
| `GET` | `/tasks` | Retrieve all tasks with filtering & sorting | `search`, `status`, `priority`, `sortBy`, `order` |
| `GET` | `/tasks/stats/summary` | Retrieve count metrics by status | None |
| `GET` | `/tasks/:id` | Retrieve single task by 24-char hex ObjectId | None |
| `POST` | `/tasks` | Create a new task | None |
| `PUT` | `/tasks/:id` | Update an existing task | None |
| `DELETE` | `/tasks/:id` | Delete a task | None |

---

### Request & Response Specifications

#### 1. Create Task — `POST /api/tasks`
**Headers:** `Content-Type: application/json`

**Request Body:**
```json
{
  "title": "Build user authentication",
  "description": "Implement JWT-based signup and login with secure cookies.",
  "status": "In Progress",
  "priority": "High"
}
```

**Success Response (`201 Created`):**
```json
{
  "success": true,
  "message": "Task created successfully",
  "data": {
    "id": "673f8e53995f36e4f1a23456",
    "title": "Build user authentication",
    "description": "Implement JWT-based signup and login with secure cookies.",
    "status": "In Progress",
    "priority": "High",
    "createdAt": "2026-10-22T01:30:00.000Z",
    "updatedAt": "2026-10-22T01:30:00.000Z"
  }
}
```

---

#### 2. Get All Tasks — `GET /api/tasks`
**Sample Request:**
```
GET /api/tasks?status=Pending&priority=High&search=auth&sortBy=createdAt&order=desc
```

**Success Response (`200 OK`):**
```json
{
  "success": true,
  "count": 1,
  "data": [
    {
      "id": "673f8e53995f36e4f1a23456",
      "title": "Build user authentication",
      "description": "Implement JWT-based signup and login with secure cookies.",
      "status": "Pending",
      "priority": "High",
      "createdAt": "2026-10-22T01:30:00.000Z",
      "updatedAt": "2026-10-22T01:30:00.000Z"
    }
  ]
}
```

---

#### 3. Get Single Task — `GET /api/tasks/:id`
**Success Response (`200 OK`):**
```json
{
  "success": true,
  "data": {
    "id": "673f8e53995f36e4f1a23456",
    "title": "Build user authentication",
    "description": "Implement JWT-based signup and login with secure cookies.",
    "status": "In Progress",
    "priority": "High",
    "createdAt": "2026-10-22T01:30:00.000Z",
    "updatedAt": "2026-10-22T01:30:00.000Z"
  }
}
```

---

#### 4. Update Task — `PUT /api/tasks/:id`
**Request Body (Partial or Full):**
```json
{
  "status": "Completed"
}
```

**Success Response (`200 OK`):**
```json
{
  "success": true,
  "message": "Task updated successfully",
  "data": {
    "id": "673f8e53995f36e4f1a23456",
    "title": "Build user authentication",
    "description": "Implement JWT-based signup and login with secure cookies.",
    "status": "Completed",
    "priority": "High",
    "createdAt": "2026-10-22T01:30:00.000Z",
    "updatedAt": "2026-10-22T01:35:12.000Z"
  }
}
```

---

#### 5. Delete Task — `DELETE /api/tasks/:id`
**Success Response (`200 OK`):**
```json
{
  "success": true,
  "message": "Task deleted successfully",
  "data": {
    "id": "673f8e53995f36e4f1a23456"
  }
}
```

---

### Error Handling Standards

All errors return a standardized JSON structure:

#### Validation Error (`400 Bad Request`):
```json
{
  "success": false,
  "message": "Validation failed",
  "errors": [
    "Task title is required and cannot be empty.",
    "Invalid status 'Archived'. Allowed values: Pending, In Progress, Completed"
  ]
}
```

#### Malformed MongoDB ObjectId (`400 Bad Request`):
```json
{
  "success": false,
  "message": "Invalid ID format: 'invalid-id-123'. Expected a 24-character hexadecimal MongoDB ObjectId."
}
```

#### Not Found (`404 Not Found`):
```json
{
  "success": false,
  "message": "Task not found with ID: 673f8e53995f36e4f1a29999"
}
```

---

## 7. Frontend Features & UI Design

- **Overview Metric Cards**: Instantly view counts for Total, Pending, In Progress, and Completed tasks. Clicking any card activates that filter.
- **Search & Filter Bar**:
  - Debounced search queries the backend title field without performance lag.
  - Interactive status and priority pill buttons.
  - Sorting options (Newest, Oldest, Priority, Title).
  - One-click "Reset" button when filters are active.
- **Task Cards**:
  - Color-coded priority indicators (High: Rose, Medium: Amber, Low: Slate).
  - Color-coded status badges with quick in-place dropdown switcher for fast workflow transitions.
  - Strikethrough visual styling for completed items.
  - Formatted creation date timestamp.
- **Accessible Modals**:
  - Add / Edit Task Modal with input validation, title character counters, and auto-focus.
  - Safe Delete Confirmation Dialog preventing accidental deletions.
  - Full keyboard accessibility: press `Esc` to close any modal.
- **Notification Toast**: Non-intrusive bottom-right toast with auto-dismissal for success and error messages.

---

## 8. Production Deployment Guide

### Backend Deployment (Render / Railway)

#### Deploying to Render
1. Push your repository to GitHub or GitLab.
2. Sign in to [Render Dashboard](https://dashboard.render.com/) and click **New + > Web Service**.
3. Connect your repository.
4. Set the following settings:
   - **Name**: `taskflow-backend`
   - **Root Directory**: `backend`
   - **Environment**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `node src/server.js`
5. Add Environment Variables under the **Environment** tab:
   - `NODE_ENV`: `production`
   - `PORT`: `10000` (or leave default, Render sets `PORT` automatically)
   - `MONGODB_URI`: `mongodb+srv://<user>:<password>@cluster0.mongodb.net/taskmanager?retryWrites=true&w=majority`
   - `CLIENT_URL`: `https://your-frontend-app.vercel.app` (your production frontend URL)
6. Click **Create Web Service**. Once deployed, copy your backend URL (e.g., `https://taskflow-backend.onrender.com`).

#### Deploying to Railway
1. Sign in to [Railway.app](https://railway.app/) and create a **New Project**.
2. Select **Deploy from GitHub repo** and pick your repository.
3. In service settings, set the **Root Directory** to `/backend`.
4. Add a **MongoDB Plugin** directly in Railway, or provide your MongoDB Atlas `MONGODB_URI` under **Variables**.
5. Set `CLIENT_URL` to your production frontend URL.
6. Railway will automatically detect Node.js, run `npm install`, and launch `npm start`.

---

### Frontend Deployment (Vercel / Netlify)

#### Deploying to Vercel
1. Sign in to [Vercel](https://vercel.com/) and click **Add New... > Project**.
2. Select your Git repository.
3. In the project setup screen:
   - **Framework Preset**: `Vite`
   - **Root Directory**: Click edit and choose `frontend`.
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
4. Expand **Environment Variables** and add:
   - `VITE_API_BASE_URL`: `https://your-backend-service.onrender.com/api` (point to your deployed backend URL)
5. Click **Deploy**. Vercel will build and assign an SSL-enabled production URL.

#### Deploying to Netlify
1. Sign in to [Netlify](https://www.netlify.com/) and click **Add new site > Import an existing project**.
2. Select your repository.
3. Configure build settings:
   - **Base directory**: `frontend`
   - **Build command**: `npm run build`
   - **Publish directory**: `frontend/dist`
4. Add Environment Variable:
   - Key: `VITE_API_BASE_URL`
   - Value: `https://your-backend-service.onrender.com/api`
5. To support client-side routing on Netlify, add a `frontend/public/_redirects` file with:
   ```
   /*    /index.html   200
   ```
6. Click **Deploy Site**.

---

## 9. License
Distributed under the MIT License. Free for educational and commercial use.
