# CivicVoice 🏙️

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Node.js Version](https://img.shields.io/badge/node-%3E%3D20.0.0-blue.svg)](https://nodejs.org)
[![React](https://img.shields.io/badge/react-19.x-blue.svg)](https://react.dev)
[![Docker](https://img.shields.io/badge/docker-compose-blue.svg)](https://www.docker.com)

CivicVoice is a modern, interactive, and real-time citizen engagement platform designed to bridge the gap between community members and local municipal administrations. It allows citizens to pinpoint, categorize, and report local infrastructure and utility issues (such as broken roads, water leaks, power outages, and sanitation hazards) directly on a map. Other users in the community can upvote existing issues to indicate their severity, helping administrators prioritize and resolve problems efficiently.

---

## 🏛️ System Architecture

CivicVoice is built as a decoupled, multi-container system orchestrating several specialized components:

```mermaid
graph TD
    User([Citizen / Admin]) -->|HTTP / WebSockets| FE[Frontend: React & Leaflet & Nginx]
    FE -->|API requests| BE[Backend: Express.js]
    BE -->|Query / Spatial Indexing| DB[(PostgreSQL + PostGIS)]
    BE -->|Job Dispatch / Cache| Redis[(Redis)]
    Redis -->|Process Job Queue| Worker[BullMQ Worker]
    Worker -->|Send Transactional Mail| Resend[Resend API]
    Worker -->|Store Uploads| Cloudinary[Cloudinary API]
    BE -->|WS Broadcasts| FE
```

### Key Components
1. **Frontend (`civicvoice-client`)**: A Vite-powered React single-page application utilizing Leaflet for spatial map interaction, styled with Tailwind CSS, and served via **Nginx** in production.
2. **Backend**: An Express.js REST API providing secure routing, role-based access control (JWT), and WebSockets (Socket.io) for real-time interface broadcasts.
3. **Database (PostgreSQL + PostGIS)**: Relational database with geographic extensions to support spatial distance indexing and point/location queries.
4. **Cache & Queue (Redis & BullMQ)**:
   - Redis caching for nearby query responses to improve performance.
   - Redis-backed BullMQ message queue to process heavy asynchronous background tasks (such as sending emails and interacting with external APIs).
5. **Services (Cloudinary & Resend)**:
   - Cloudinary manages citizen-uploaded photos of issues.
   - Resend handles email alerts (verification, password resets).

---

## ✨ Core Features

*   📍 **Spatial Mapping (Leaflet & PostGIS)**: Interactive map with automatic geolocation. View, filter, and report issues with custom colored indicators based on category.
*   🚦 **Real-Time Dynamic Updates (Socket.io)**: Live feedback across clients. When a citizen submits a new report, upvotes an issue, or an admin updates a status, the change propagates instantly without page reloads.
*   🔍 **Smart Spam Prevention (ST_DWithin Check)**: Automatically checks for nearby duplicates of the same category within a 200-meter radius before inserting a new issue, prompting the user to upvote the existing report instead.
*   📊 **Administrative Control Board**: Role-based access control. Admins can view complete issue tables, transition statuses (`Open` ➡️ `In Progress` ➡️ `Resolved`), and trace issue metrics.
*   📬 **Asynchronous Queue Jobs**: Background worker processes user verification mails and password resets asynchronously via BullMQ, keeping HTTP request loops fast and resilient.
*   📱 **Responsive Mobile Experience**: Tailored user interface featuring custom sliding bottom sheets on mobile devices and responsive grid layouts.

---

## 📁 Repository Structure

```tree
CivicVoice/
├── civicvoice-client/       # Frontend Application (React + Vite)
│   ├── src/
│   │   ├── api/             # API request wrappers
│   │   ├── components/      # Common UI elements (Navbar, ProtectedRoute)
│   │   ├── context/         # AuthContext state provider
│   │   ├── hooks/           # useSocket, etc.
│   │   └── pages/           # Landing, Map, Report, Admin, Auth pages
│   ├── Dockerfile           # Multi-stage production build (Node -> Nginx)
│   └── nginx.conf           # Production Nginx reverse-proxy configuration
├── src/                     # Backend API Application (Express.js)
│   ├── config/              # Cloudinary and environment setups
│   ├── db/                  # PostgreSQL client & schema migration script
│   ├── middleware/          # JWT Auth, Admin checks, error handlers
│   ├── queues/              # BullMQ Redis worker configuration
│   ├── routes/              # Express Router files (auth, issues)
│   ├── utils/               # Helper utilities (Cloudinary, Resend senders)
│   ├── app.js               # Express application setup
│   └── socket.js            # Socket.io connection coordinator
├── Dockerfile               # Production Node backend Docker image
├── docker-compose.yml       # Production/Local orchestrator
└── nginx.conf               # Root-level Nginx config
```

---

## 🗄️ Database Schema

The database uses PostgreSQL extended with **PostGIS** for spatial data structures. Below is the simplified relational schema:

```
                  ┌──────────────────────┐
                  │        users         │
                  ├──────────────────────┤
                  │ id (PK)              │◄──────┐
                  │ name                 │       │
                  │ email (Unique)       │       │
                  │ password             │       │
                  │ role (citizen/admin) │       │
                  │ verified (bool)      │       │
                  └──────────────────────┘       │
                             │                   │
                             │ 1:N               │ 1:N
                             ▼                   │
                  ┌──────────────────────┐       │
                  │        issues        │       │
                  ├──────────────────────┤       │
                  │ id (PK)              │◄──┐   │
                  │ title                │   │   │
                  │ description          │   │   │
                  │ category (Enum)      │   │   │
                  │ status (Enum)        │   │   │
                  │ location (GEOGRAPHY) │   │   │
                  │ user_id (FK) ────────┼───┼───┘
                  │ image_url            │   │
                  └──────────────────────┘   │
                             │               │
                             │ 1:N           │ 1:N
                             ▼               │
                  ┌──────────────────────┐   │
                  │    issue_upvotes     │   │
                  ├──────────────────────┤   │
                  │ user_id (FK) ────────┼───┘
                  │ issue_id (FK) ───────┼───┘
                  │ (Composite PK)       │
                  └──────────────────────┘
```

---

## ⚙️ Environment Configuration

You must configure environment variables to run the application. Create `.env` files matching the structures below:

### Root Backend Environment Configuration (`.env`)
```env
PORT=5000
DATABASE_URL=postgresql://civicvoice:civicvoice123@postgres:5432/civicvoice
NODE_ENV=development
JWT_SECRET=your_jwt_secret_key

# Redis Config (Defaults to 'redis' in Docker, 'localhost' or your redis host locally)
REDIS_HOST=redis
REDIS_PORT=6379
REDIS_URL=redis://redis:6379

# PostgreSQL Container Init (Matches docker-compose environment)
POSTGRES_USER=civicvoice
POSTGRES_PASSWORD=civicvoice123
POSTGRES_DB=civicvoice

# Cloudinary Integration (Image Uploads)
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret

# Resend & Transactional Email
RESEND_API_KEY=your_resend_api_key
FROM_EMAIL=noreply@yourdomain.com
APP_URL=https://yourdomain.com
FRONTEND_URL=https://yourdomain.com
```

### Client Environment Configuration (`civicvoice-client/.env`)
```env
VITE_API_URL=http://localhost:5000/api
VITE_SOCKET_URL=http://localhost:5000
```

---

## 🚀 Getting Started

### Option A: Local Development Setup

#### Prerequisites
*   **Node.js** v20.x or higher
*   **PostgreSQL** (v15+) with **PostGIS** extension enabled
*   **Redis** (v7.x+) running locally

#### Step 1: Clone and Install Dependencies
```bash
# Clone the repository
git clone https://github.com/Sambhav-gg/CivicVoice.git
cd CivicVoice

# Install backend dependencies
npm install

# Install frontend dependencies
cd civicvoice-client
npm install
cd ..
```

#### Step 2: Set up Database Schema
Connect to your local PostgreSQL database and initialize the tables:
```bash
psql -U your_postgres_user -d your_database_name -f src/db/schema.sql
```

#### Step 3: Run Services
Start the backend Express API server and the background BullMQ worker process:
```bash
# Start backend (from root folder)
npm run dev
```

Start the frontend Vite development server:
```bash
# Start client (from civicvoice-client folder)
cd civicvoice-client
npm run dev
```
Open [http://localhost:5173](http://localhost:5173) in your browser.

---

### Option B: Docker Compose Setup (Recommended)

To run the entire ecosystem (Nginx Frontend, Node Backend, PostgreSQL Database with PostGIS, and Redis Cache/Queue) in containerized isolation:

#### Running the Stack
From the root directory, simply run:
```bash
docker-compose up --build
```

#### Container Networking Architecture
*   **Postgres Container (`civicvoice-postgres`)**: Initializes database automatically via the mapped sql initialization script `./src/db/schema.sql`. Exposed on port `5432`.
*   **Redis Container (`civicvoice-redis`)**: Provides key-value cache and job queues on port `6379`.
*   **Backend Container (`civicvoice-backend`)**: Serves Express API & coordinates Socket.io. Mapped internally to port `5000`.
*   **Frontend Container (`civicvoice-frontend`)**: Builds React bundle, sets up production Nginx configs, reverse-proxies `/api` and `/socket.io` matching backend definitions. Exposed to localhost on port `8080`.

To view the app, visit: [http://localhost:8080](http://localhost:8080).

---

## 🔌 API Routes Reference

| Method | Endpoint | Description | Auth Required |
| :--- | :--- | :--- | :---: |
| **POST** | `/api/auth/register` | Register new user accounts (citizens) | No |
| **POST** | `/api/auth/login` | Login user, generates & returns session JWT | No |
| **GET** | `/api/auth/verify-email` | Verifies mail activation tokens | No |
| **POST** | `/api/issues` | Report a new issue (supports file attachments) | Yes |
| **GET** | `/api/issues` | Fetch paginated, filterable issues | No |
| **GET** | `/api/issues/nearby` | Spatial query coordinates and radius (caching enabled) | No |
| **GET** | `/api/issues/my-votes` | Retrieve authenticated citizen's upvotes checklist | Yes |
| **PATCH** | `/api/issues/:id/upvote` | Upvotes issues & fires milestone checks | Yes |
| **PATCH** | `/api/issues/:id/status` | Transitions issue state (`open`, `in_progress`, `resolved`) | **Admin Only** |

---

## 📄 License

This project is licensed under the MIT License.
