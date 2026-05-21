# SOD & EOD Daily Tracker — Complete Setup & Deployment Guide

This guide covers everything from local development to production deployment.

---

## Table of Contents

1. [Project Structure](#project-structure)
2. [Prerequisites](#prerequisites)
3. [Part 1: Local Development Setup](#part-1-local-development-setup)
4. [Part 2: Database Setup (Neon)](#part-2-database-setup-neon)
5. [Part 3: Backend Deployment (Render)](#part-3-backend-deployment-render)
6. [Part 4: Frontend Deployment (Vercel)](#part-4-frontend-deployment-vercel)
7. [Part 5: Connect Everything](#part-5-connect-everything)
8. [Environment Variables Reference](#environment-variables-reference)
9. [Troubleshooting](#troubleshooting)

---

## Project Structure

```
sod-eod-tracker/
├── client/                    # React Frontend
│   ├── src/
│   │   ├── components/
│   │   ├── context/
│   │   ├── services/
│   │   ├── utils/
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   ├── index.html
│   ├── package.json
│   └── vite.config.js
│
├── server/                    # Express Backend
│   ├── controllers/
│   │   └── taskController.js
│   ├── database/
│   │   ├── db.js
│   │   └── schema.sql
│   ├── middleware/
│   │   └── errorHandler.js
│   ├── routes/
│   │   └── taskRoutes.js
│   ├── server.js
│   ├── package.json
│   └── .env
│
└── README.md
```

---

## Prerequisites

Before starting, ensure you have:

- **Node.js** (v18 or higher) — [Download](https://nodejs.org/)
- **npm** (comes with Node.js)
- **Git** — [Download](https://git-scm.com/)
- **Code Editor** (VS Code recommended)
- **Accounts** (free tiers work):
  - [GitHub](https://github.com/) — for code repository
  - [Neon](https://neon.tech/) — for PostgreSQL database
  - [Render](https://render.com/) — for backend hosting
  - [Vercel](https://vercel.com/) — for frontend hosting

---

## Part 1: Local Development Setup

### Step 1.1: Create Project Directory

```bash
# Create main project folder
mkdir sod-eod-tracker
cd sod-eod-tracker

# Initialize git
git init
```

### Step 1.2: Setup Backend (Server)

```bash
# Create server directory
mkdir server
cd server

# Initialize Node.js project
npm init -y

# Install dependencies
npm install express cors pg dotenv

# Install dev dependencies (optional, for nodemon)
npm install -D nodemon
```

**Create `server/package.json`:**

```json
{
  "name": "sod-eod-server",
  "version": "1.0.0",
  "description": "SOD & EOD Tracker API",
  "main": "server.js",
  "scripts": {
    "start": "node server.js",
    "dev": "nodemon server.js"
  },
  "dependencies": {
    "cors": "^2.8.5",
    "dotenv": "^16.3.1",
    "express": "^4.18.2",
    "pg": "^8.11.3"
  },
  "devDependencies": {
    "nodemon": "^3.0.2"
  },
  "engines": {
    "node": ">=18.0.0"
  }
}
```

**Create `server/.env`:**

```env
# Server
PORT=5000
NODE_ENV=development

# Database (update these with your local PostgreSQL or Neon credentials)
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/sod_eod_tracker

# For local PostgreSQL (alternative to DATABASE_URL)
DB_HOST=localhost
DB_PORT=5432
DB_NAME=sod_eod_tracker
DB_USER=postgres
DB_PASSWORD=postgres

# Frontend URL (for CORS)
CLIENT_URL=http://localhost:5173
```

**Create `server/.gitignore`:**

```
node_modules/
.env
*.log
```

### Step 1.3: Setup Frontend (Client)

```bash
# Go back to project root
cd ..

# Create React app with Vite
npm create vite@latest client -- --template react

# Navigate to client
cd client

# Install dependencies
npm install
```

**Update `client/package.json`:**

```json
{
  "name": "sod-eod-client",
  "version": "1.0.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview"
  },
  "dependencies": {
    "react": "^18.2.0",
    "react-dom": "^18.2.0"
  },
  "devDependencies": {
    "@vitejs/plugin-react": "^4.2.1",
    "vite": "^5.0.10"
  }
}
```

**Create `client/vite.config.js`:**

```javascript
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      '/api': {
        target: 'http://localhost:5000',
        changeOrigin: true,
      },
    },
  },
});
```

**Create `client/.env`:**

```env
VITE_API_URL=http://localhost:5000
```

**Create `client/.gitignore`:**

```
node_modules/
dist/
.env.local
*.log
```

### Step 1.4: Setup Local PostgreSQL Database

**Option A: Using Local PostgreSQL**

```bash
# Install PostgreSQL if not installed
# macOS: brew install postgresql
# Ubuntu: sudo apt install postgresql
# Windows: Download from https://postgresql.org/download/

# Start PostgreSQL service
# macOS: brew services start postgresql
# Ubuntu: sudo service postgresql start

# Create database
createdb sod_eod_tracker

# Run schema
psql -d sod_eod_tracker -f server/database/schema.sql
```

**Option B: Skip local DB, use Neon directly (see Part 2)**

### Step 1.5: Run Locally

**Terminal 1 — Backend:**

```bash
cd server
npm run dev
```

You should see:
```
🚀 SOD & EOD Tracker API running on http://localhost:5000
📋 Environment: development
```

**Terminal 2 — Frontend:**

```bash
cd client
npm run dev
```

You should see:
```
  VITE v5.x.x  ready in xxx ms

  ➜  Local:   http://localhost:5173/
```

**Open browser:** http://localhost:5173

---

## Part 2: Database Setup (Neon)

Neon provides free serverless PostgreSQL. Perfect for this project.

### Step 2.1: Create Neon Account

1. Go to [https://neon.tech](https://neon.tech)
2. Click **"Sign Up"** (use GitHub for easy signup)
3. Verify your email if required

### Step 2.2: Create New Project

1. Click **"New Project"**
2. **Project name:** `sod-eod-tracker`
3. **PostgreSQL version:** 15 (or latest)
4. **Region:** Choose closest to your users (e.g., `US East` or `Europe West`)
5. Click **"Create Project"**

### Step 2.3: Get Connection String

After creation, you'll see the connection details:

1. Go to **Dashboard** → Your project
2. Click **"Connection Details"** tab
3. Select **"Connection string"** format
4. Copy the connection string:

```
postgresql://username:password@ep-xxxxx.region.aws.neon.tech/neondb?sslmode=require
```

**⚠️ Important:** Save this securely. You'll need it for backend deployment.

### Step 2.4: Run Database Schema

**Option A: Using Neon SQL Editor (Easiest)**

1. In Neon Dashboard, click **"SQL Editor"**
2. Copy the entire contents of `server/database/schema.sql`
3. Paste into the SQL Editor
4. Click **"Run"**

**Option B: Using psql command line**

```bash
# Install psql if needed
# Set your Neon connection string
export DATABASE_URL="postgresql://username:password@ep-xxxxx.region.aws.neon.tech/neondb?sslmode=require"

# Run schema
psql $DATABASE_URL -f server/database/schema.sql
```

### Step 2.5: Verify Database

In Neon SQL Editor, run:

```sql
SELECT * FROM tasks LIMIT 5;
```

Should return empty result (no errors means success).

---

## Part 3: Backend Deployment (Render)

Render offers free web services perfect for Node.js backends.

### Step 3.1: Prepare Backend for Deployment

**Update `server/database/db.js` to support both local and production:**

```javascript
const { Pool } = require('pg');

// Use DATABASE_URL for production (Neon), fallback to individual vars for local
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production' 
    ? { rejectUnauthorized: false } 
    : false,
});

pool.on('error', (err) => {
  console.error('Database pool error:', err);
});

module.exports = pool;
```

**Update `server/server.js` CORS for production:**

```javascript
require('dotenv').config();

const express = require('express');
const cors = require('cors');
const taskRoutes = require('./routes/taskRoutes');
const { errorHandler, notFoundHandler } = require('./middleware/errorHandler');

const app = express();
const PORT = process.env.PORT || 5000;

// CORS configuration
const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:3000',
  process.env.CLIENT_URL,
].filter(Boolean);

app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (mobile apps, curl, etc.)
    if (!origin) return callback(null, true);
    if (allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
}));

app.use(express.json());

// Request logging
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} ${req.method} ${req.path}`);
  next();
});

// Routes
app.use('/api/tasks', taskRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Root route
app.get('/', (req, res) => {
  res.json({ message: 'SOD & EOD Tracker API', version: '1.0.0' });
});

// Error handling
app.use(notFoundHandler);
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📋 Environment: ${process.env.NODE_ENV || 'development'}`);
});
```

### Step 3.2: Push Code to GitHub

```bash
# In project root
cd sod-eod-tracker

# Create .gitignore in root
echo "node_modules/
.env
*.log
dist/" > .gitignore

# Add all files
git add .
git commit -m "Initial commit: SOD & EOD Tracker"

# Create GitHub repository (via github.com or gh cli)
# Then push:
git remote add origin https://github.com/YOUR_USERNAME/sod-eod-tracker.git
git branch -M main
git push -u origin main
```

### Step 3.3: Create Render Account

1. Go to [https://render.com](https://render.com)
2. Sign up with GitHub (recommended for easy deploys)

### Step 3.4: Deploy Backend on Render

1. Click **"New +"** → **"Web Service"**

2. **Connect Repository:**
   - Select your GitHub repo: `sod-eod-tracker`
   - Click **"Connect"**

3. **Configure Service:**
   
   | Setting | Value |
   |---------|-------|
   | **Name** | `sod-eod-api` |
   | **Region** | Same as Neon (e.g., Oregon/US West) |
   | **Root Directory** | `server` |
   | **Runtime** | `Node` |
   | **Build Command** | `npm install` |
   | **Start Command** | `npm start` |
   | **Instance Type** | `Free` |

4. **Add Environment Variables:**
   
   Click **"Advanced"** → **"Add Environment Variable"**:

   | Key | Value |
   |-----|-------|
   | `NODE_ENV` | `production` |
   | `DATABASE_URL` | `postgresql://...` (your Neon connection string) |
   | `CLIENT_URL` | (leave empty for now, add after Vercel deploy) |

5. Click **"Create Web Service"**

6. Wait for deployment (2-5 minutes)

7. **Get your backend URL:**
   ```
   https://sod-eod-api.onrender.com
   ```

### Step 3.5: Test Backend

```bash
# Test health endpoint
curl https://sod-eod-api.onrender.com/api/health

# Should return:
# {"status":"ok","timestamp":"2024-..."}
```

---

## Part 4: Frontend Deployment (Vercel)

### Step 4.1: Update Frontend for Production

**Update `client/src/services/taskService.js`:**

Replace the localStorage version with API calls:

```javascript
const API_URL = import.meta.env.VITE_API_URL || '';

async function request(endpoint, options = {}) {
  const url = `${API_URL}/api/tasks${endpoint}`;
  const res = await fetch(url, {
    headers: { 'Content-Type': 'application/json', ...options.headers },
    ...options,
  });
  if (!res.ok) {
    const error = await res.json().catch(() => ({ error: 'Request failed' }));
    throw new Error(error.error || 'Request failed');
  }
  return res.json();
}

export async function getTasksByDate(date) {
  const data = await request(`?date=${date}`);
  return data.tasks || [];
}

export async function getStats(date) {
  return request(`/stats?date=${date}`);
}

export async function createTask({ title, description, task_date, carried_from_id }) {
  const data = await request('', {
    method: 'POST',
    body: JSON.stringify({ title, description, task_date, carried_from_id }),
  });
  return data.task;
}

export async function updateStatus(id, status, eod_notes) {
  const data = await request(`/${id}/status`, {
    method: 'PUT',
    body: JSON.stringify({ status, eod_notes }),
  });
  return data.task;
}

export async function carryForward(id, next_date) {
  const data = await request(`/${id}/carry-forward`, {
    method: 'POST',
    body: JSON.stringify({ next_date }),
  });
  return data.new_task;
}

export async function deleteTask(id) {
  await request(`/${id}`, { method: 'DELETE' });
  return true;
}
```

**Update components to handle async:**

The components need to be updated to handle async/await. Update `App.jsx`:

```javascript
import { useState, useCallback, useEffect } from 'react';
import { ToastProvider } from './context/ToastContext';
import Toasts from './components/Toasts';
import DateNav from './components/DateNav';
import StatsBar from './components/StatsBar';
import AddTaskForm from './components/AddTaskForm';
import TaskList from './components/TaskList';
import { getTasksByDate, getStats } from './services/taskService';
import { getToday, formatDateLong, isToday } from './utils/dateUtils';

function Dashboard() {
  const [date, setDate] = useState(getToday());
  const [tasks, setTasks] = useState([]);
  const [stats, setStats] = useState({ planned: 0, completed: 0, pending: 0, carried_forward: 0 });
  const [loading, setLoading] = useState(true);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const [tasksData, statsData] = await Promise.all([
        getTasksByDate(date),
        getStats(date),
      ]);
      setTasks(tasksData);
      setStats(statsData);
    } catch (err) {
      console.error('Failed to fetch data:', err);
    } finally {
      setLoading(false);
    }
  }, [date]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return (
    <div className="app">
      <header className="topbar">
        <div className="topbar__inner">
          <div className="topbar__brand">
            <div className="topbar__logo">📋</div>
            <div>
              <div className="topbar__title">SOD & EOD Tracker</div>
              <div className="topbar__subtitle">Plan · Execute · Review</div>
            </div>
          </div>
          <DateNav date={date} onChange={setDate} />
        </div>
      </header>

      <main className="main">
        <div className="date-display">
          <span className="date-display__day">{formatDateLong(date)}</span>
          {isToday(date) && <span className="date-display__today-badge">Today</span>}
        </div>

        <StatsBar stats={stats} />

        <div className="content">
          <AddTaskForm date={date} onAdded={fetchData} />
          <TaskList tasks={tasks} onUpdate={fetchData} loading={loading} />
        </div>
      </main>
    </div>
  );
}

export default function App() {
  return (
    <ToastProvider>
      <Dashboard />
      <Toasts />
    </ToastProvider>
  );
}
```

### Step 4.2: Create Vercel Account

1. Go to [https://vercel.com](https://vercel.com)
2. Sign up with GitHub

### Step 4.3: Deploy Frontend on Vercel

**Option A: Via Vercel Dashboard (Recommended)**

1. Click **"Add New..."** → **"Project"**

2. **Import Git Repository:**
   - Select your repo: `sod-eod-tracker`
   - Click **"Import"**

3. **Configure Project:**
   
   | Setting | Value |
   |---------|-------|
   | **Project Name** | `sod-eod-tracker` |
   | **Framework Preset** | `Vite` |
   | **Root Directory** | `client` |
   | **Build Command** | `npm run build` |
   | **Output Directory** | `dist` |

4. **Add Environment Variables:**
   
   Click **"Environment Variables"**:

   | Name | Value |
   |------|-------|
   | `VITE_API_URL` | `https://sod-eod-api.onrender.com` |

5. Click **"Deploy"**

6. Wait 1-2 minutes

7. **Get your frontend URL:**
   ```
   https://sod-eod-tracker.vercel.app
   ```

**Option B: Via Vercel CLI**

```bash
# Install Vercel CLI
npm install -g vercel

# Navigate to client folder
cd client

# Deploy
vercel

# Follow prompts:
# - Link to existing project? No
# - Project name: sod-eod-tracker
# - Root directory: ./
# - Override settings? No

# Set environment variable
vercel env add VITE_API_URL
# Enter: https://sod-eod-api.onrender.com

# Redeploy with env
vercel --prod
```

---

## Part 5: Connect Everything

### Step 5.1: Update Render Environment Variable

Now that Vercel is deployed, update the backend CORS:

1. Go to Render Dashboard → Your service (`sod-eod-api`)
2. Click **"Environment"** tab
3. Add/Update:

   | Key | Value |
   |-----|-------|
   | `CLIENT_URL` | `https://sod-eod-tracker.vercel.app` |

4. Click **"Save Changes"**
5. Render will auto-redeploy

### Step 5.2: Verify Production Setup

1. **Open Frontend:**
   ```
   https://sod-eod-tracker.vercel.app
   ```

2. **Add a test task**

3. **Check Database:**
   - Go to Neon Dashboard → SQL Editor
   - Run: `SELECT * FROM tasks;`
   - You should see your task!

### Step 5.3: Final Architecture

```
┌─────────────────┐      ┌─────────────────┐      ┌─────────────────┐
│                 │      │                 │      │                 │
│     VERCEL      │─────▶│     RENDER      │─────▶│      NEON       │
│   (Frontend)    │ API  │    (Backend)    │ SQL  │   (PostgreSQL)  │
│                 │      │                 │      │                 │
│  React + Vite   │      │    Express.js   │      │   Serverless    │
│                 │      │                 │      │                 │
└─────────────────┘      └─────────────────┘      └─────────────────┘
     ▲                                                     
     │                                                     
   Users                                                   
```

---

## Environment Variables Reference

### Backend (Render)

| Variable | Description | Example |
|----------|-------------|---------|
| `NODE_ENV` | Environment mode | `production` |
| `PORT` | Server port (auto-set by Render) | `10000` |
| `DATABASE_URL` | Neon PostgreSQL connection string | `postgresql://user:pass@host/db?sslmode=require` |
| `CLIENT_URL` | Frontend URL for CORS | `https://sod-eod-tracker.vercel.app` |

### Frontend (Vercel)

| Variable | Description | Example |
|----------|-------------|---------|
| `VITE_API_URL` | Backend API URL | `https://sod-eod-api.onrender.com` |

### Local Development

**server/.env:**
```env
NODE_ENV=development
PORT=5000
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/sod_eod_tracker
CLIENT_URL=http://localhost:5173
```

**client/.env:**
```env
VITE_API_URL=http://localhost:5000
```

---

## Troubleshooting

### Common Issues

#### 1. CORS Errors

**Symptom:** Browser console shows `Access-Control-Allow-Origin` errors

**Fix:**
- Ensure `CLIENT_URL` is set correctly on Render
- Verify the URL includes `https://` and has no trailing slash
- Redeploy backend after changing environment variables

#### 2. Database Connection Errors

**Symptom:** Backend logs show `connection refused` or `SSL required`

**Fix:**
- Ensure `DATABASE_URL` is correct
- For Neon, connection string must include `?sslmode=require`
- Check Neon dashboard for connection limits (free tier: 100 hours/month compute)

#### 3. Render Service Sleeping

**Symptom:** First request takes 30+ seconds

**Explanation:** Free Render services sleep after 15 minutes of inactivity

**Fix:**
- This is normal for free tier
- Upgrade to paid plan for always-on
- Or use a cron service to ping your API periodically

#### 4. Vercel Build Fails

**Symptom:** Build error on Vercel

**Fix:**
- Check that `Root Directory` is set to `client`
- Ensure all imports use correct paths
- Check Vercel build logs for specific error

#### 5. Tasks Not Saving

**Symptom:** Added tasks disappear on refresh

**Fix:**
- Check browser Network tab for API errors
- Verify `VITE_API_URL` is set correctly
- Test API directly: `curl https://your-api.onrender.com/api/health`

### Useful Commands

```bash
# Test API health
curl https://sod-eod-api.onrender.com/api/health

# Test API tasks
curl https://sod-eod-api.onrender.com/api/tasks?date=2024-01-15

# View Render logs
# Go to Render Dashboard → Your Service → Logs

# View Vercel logs
vercel logs sod-eod-tracker

# Local PostgreSQL connection test
psql $DATABASE_URL -c "SELECT NOW();"
```

### Getting Help

- **Render Docs:** https://render.com/docs
- **Vercel Docs:** https://vercel.com/docs
- **Neon Docs:** https://neon.tech/docs
- **PostgreSQL Docs:** https://www.postgresql.org/docs/

---

## Quick Reference: All URLs

| Service | URL |
|---------|-----|
| **Frontend (Vercel)** | `https://sod-eod-tracker.vercel.app` |
| **Backend (Render)** | `https://sod-eod-api.onrender.com` |
| **API Health Check** | `https://sod-eod-api.onrender.com/api/health` |
| **Database (Neon)** | Neon Dashboard → Connection Details |

---

## Next Steps

After deployment:

1. **Custom Domain:** Add your own domain on Vercel (free)
2. **Monitoring:** Set up uptime monitoring (UptimeRobot, free)
3. **Analytics:** Add Vercel Analytics or Plausible
4. **Backup:** Set up Neon point-in-time recovery
5. **CI/CD:** Auto-deploy on git push (already set up!)

---

**Congratulations!** 🎉 Your SOD & EOD Tracker is now live on the internet!
