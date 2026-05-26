# CDR Backend

A secure REST API backend for the CDR Analytics Dashboard, built for the London Success Academy Software Development Internship in partnership with PineVox.

## Overview

This backend powers the CDR Analytics Dashboard with secure, authenticated API endpoints for telecom call data records. It handles data retrieval, analytics calculations, and user authentication with role-based access control.

## Tech Stack

- Node.js
- Express
- MongoDB (Atlas)
- Mongoose
- JWT (jsonwebtoken)
- bcryptjs

## API Endpoints

### Authentication
| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| POST | /api/auth/register | Public | Register a new user |
| POST | /api/auth/login | Public | Login and receive JWT token |
| GET | /api/auth/users | Admin only | Get all users |

### CDR Data
| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| GET | /api/cdr | Protected | Get paginated call records |
| GET | /api/cdr/analytics/total-calls | Protected | Get total call count |
| GET | /api/cdr/analytics/total-cost | Admin only | Get total call cost |
| GET | /api/cdr/analytics/avg-duration | Protected | Get average call duration |
| GET | /api/cdr/analytics/call-status | Protected | Get successful vs failed calls |
| GET | /api/cdr/analytics/call-types | Protected | Get inbound vs outbound calls |
| GET | /api/cdr/analytics/top-callers | Protected | Get top 10 callers |
| GET | /api/cdr/analytics/calls-by-city | Protected | Get calls grouped by city |
| GET | /api/cdr/analytics/cost-by-city | Admin only | Get cost grouped by city |
| GET | /api/cdr/analytics/calls-per-hour | Protected | Get calls grouped by hour |

## Query Parameters

The `/api/cdr` endpoint supports filtering:
- `page` — page number (default: 1)
- `limit` — records per page (default: 100)
- `city` — filter by city
- `callerNumber` — filter by caller number
- `startDate` — filter by start date
- `endDate` — filter by end date

## Authentication

All protected routes require a JWT token in the Authorization header:
`Authorization: Bearer <token>`

## Roles

| Role | Access |
|------|--------|
| Admin | Full access to all endpoints |
| Analyst | View-only access, no cost data |

## Environment Variables

Create a `.env` file with:
- `PORT=5000`
- `MONGODB_URI=your_mongodb_atlas_connection_string`
- `JWT_SECRET=your_secret_key`

## Getting Started

### Prerequisites
- Node.js v20 or higher
- MongoDB Atlas account

### Installation

```bash
git clone https://github.com/[yourusername]/cdr-backend.git
cd cdr-backend
npm install
```

Create a `.env` file with your environment variables, then run:

```bash
npm start
```

Server runs on `http://localhost:5000`

## Deployment

Live API: https://cdr-backend-50vy.onrender.com

## Frontend

The frontend dashboard that consumes this API:
- GitHub: https://github.com/emoulgen2163/cdr-dashboard.git
- Live: https://cdr-dashboard-lake.vercel.app/
