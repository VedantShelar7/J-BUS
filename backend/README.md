# Velocity Backend - Simple Setup

## Quick Start

```bash
# 1. Go to backend folder
cd backend

# 2. Install dependencies
npm install

# 3. Start the server
npm run dev
```

## That's it!

Open **http://localhost:5000** in your browser.

## Login Credentials

| Role    | Email                      | Password    |
|---------|----------------------------|-------------|
| Admin   | admin@velocity.edu         | admin123    |
| Driver  | ravi.kumar@velocity.edu    | driver123   |
| Driver  | john.doe@velocity.edu      | driver123   |
| Driver  | sara.miller@velocity.edu   | driver123   |
| Student | alex.rivers@velocity.edu   | student123  |
| Student | priya.sharma@velocity.edu  | student123  |
| Student | rahul.nair@velocity.edu    | student123  |
| Student | sneha.patil@velocity.edu   | student123  |
| Student | arjun.reddy@velocity.edu   | student123  |

## API Endpoints

- `POST /api/auth/login` — Login with email + password
- `GET /api/buses` — List all buses
- `GET /api/routes` — List all routes
- `GET /api/admin/dashboard` — Dashboard stats

## Notes

- No MongoDB needed — data stored in JSON files under `data/`
- Leaflet.js (free, open-source) used for maps via CDN
- No API keys required
