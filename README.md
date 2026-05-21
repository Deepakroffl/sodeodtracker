# SOD & EOD Daily Tracker

A production-ready web application for tracking daily tasks with Start-of-Day (SOD) planning and End-of-Day (EOD) reviews.

![Tech Stack](https://img.shields.io/badge/Stack-PERN-blue)
![Frontend](https://img.shields.io/badge/Frontend-React-61dafb)
![Backend](https://img.shields.io/badge/Backend-Express-green)
![Database](https://img.shields.io/badge/Database-PostgreSQL-336791)

---

## Features

- ☀️ **SOD Task Planning** — Add tasks at the start of your day
- 🌙 **EOD Review** — Mark tasks as completed or pending with notes
- 🔄 **Carry Forward** — Move pending tasks to the next day
- 📅 **Daily View** — Browse tasks by date
- 📊 **Statistics** — At-a-glance task counts
- 📱 **Fully Responsive** — Works on all devices

---

## Tech Stack

| Layer | Technology |
|-------|------------|
| Frontend | React 18, Vite, Plain CSS |
| Backend | Node.js, Express.js |
| Database | PostgreSQL |
| Hosting | Vercel (FE), Render (BE), Neon (DB) |

**No TypeScript. No ORMs. No UI frameworks. Minimal dependencies.**

---

## Quick Start

### Prerequisites

- Node.js 18+
- PostgreSQL (local) or Neon account (cloud)

### Local Development

```bash
# Clone repository
git clone https://github.com/YOUR_USERNAME/sod-eod-tracker.git
cd sod-eod-tracker

# Setup database
createdb sod_eod_tracker
psql -d sod_eod_tracker -f server/database/schema.sql

# Start backend
cd server
cp .env.example .env  # Edit with your credentials
npm install
npm run dev

# Start frontend (new terminal)
cd client
npm install
npm run dev
```

Open http://localhost:5173

---

## Deployment

See [SETUP.md](./SETUP.md) for complete deployment guide covering:

- ✅ Local development setup
- ✅ Neon PostgreSQL setup
- ✅ Render backend deployment
- ✅ Vercel frontend deployment
- ✅ Environment variables
- ✅ Troubleshooting

---

## Project Structure

```
sod-eod-tracker/
├── src/                       # React Frontend
│   ├── components/            # UI Components
│   ├── context/               # React Context
│   ├── services/              # API/Storage service
│   └── utils/                 # Helpers
│
├── server/                    # Express Backend
│   ├── controllers/           # Route handlers
│   ├── database/              # DB config & schema
│   ├── middleware/            # Express middleware
│   └── routes/                # API routes
│
├── SETUP.md                   # Deployment guide
└── README.md
```

---

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/tasks?date=YYYY-MM-DD` | List tasks by date |
| GET | `/api/tasks/stats?date=YYYY-MM-DD` | Get stats by date |
| GET | `/api/tasks/:id` | Get single task |
| POST | `/api/tasks` | Create task |
| PUT | `/api/tasks/:id/status` | Update status |
| POST | `/api/tasks/:id/carry-forward` | Carry to next day |
| DELETE | `/api/tasks/:id` | Delete task |

---

## Environment Variables

### Backend (server/.env)

```env
NODE_ENV=development
PORT=5000
DATABASE_URL=postgresql://user:pass@host:5432/db
CLIENT_URL=http://localhost:5173
```

### Frontend (client/.env)

```env
VITE_API_URL=http://localhost:5000
```

---

## License

MIT © 2024
