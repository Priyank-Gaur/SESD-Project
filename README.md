# Return Fraud Detection System

A merchant-facing SaaS platform designed to score inbound e-commerce return requests for fraud likelihood. The system operates entirely as a background API engine, intercepting merchant webhooks and assessing risk across an array of historical metadata points.

At a high level, the system implements a Data Enrichment Pipeline. It does not blindly trust frontend payloads. When a webhook is received containing only a user ID and an order ID, the engine securely queries its internal database to extract deep historical vectors—such as the user's return velocity over the past 30 days, account creation age, address clustering, and shared device fingerprints.

These enriched signals are then fed into a dual-layer scoring matrix (swappable between an OOP Rule-Based Strategy and a Python Machine Learning model). The matrix instantly returns a REST response indicating whether the return should be auto-approved, flagged for manual review, or forcefully rejected.

## Architecture

- **Backend:** Node.js + Express + TypeScript
- **Database:** MongoDB with Mongoose
- **Real-time:** Socket.io
- **Auth:** JWT (JSON Web Tokens)
- **ML Service:** Python + scikit-learn + Flask
- **Frontend:** React with vanilla CSS
- **Queue:** Bull + Redis

## Design Patterns

| Pattern | Purpose |
|---------|---------|
| **Strategy** | Swappable scoring algorithms (rule-based vs ML) via `ScoringStrategy` interface |
| **Observer** | Real-time alerting — `WebSocketAlertObserver` and `LogAlertObserver` fire on HIGH risk |
| **Repository** | Isolated data access — services never touch Mongoose directly |

## Getting Started

### Prerequisites

- Node.js 18+
- MongoDB (local or Atlas)
- Redis (for Bull queue)
- Python 3.9+

### Backend Setup

```bash
cd backend
cp .env.example .env
npm install
npm run seed
npm run dev
```

Backend runs on `http://localhost:3001`

### ML Service Setup

```bash
cd ml-service
python -m venv venv
source venv/bin/activate
pip install -r requirements.txt
python train.py
python predict.py
```

ML service runs on `http://localhost:8000`

### Frontend Setup

```bash
cd frontend
npm install
npm start
```

Frontend runs on `http://localhost:3000`

### Login Credentials

After seeding, log in with:
- **Email:** `merchant1@store.com`
- **Password:** `password123`

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | /api/auth/register | Register a new user |
| POST | /api/auth/login | Login with credentials |
| POST | /api/orders | Create an order |
| GET | /api/orders/:userId | Get orders by user |
| POST | /api/returns | Submit a return request |
| GET | /api/returns | List all returns |
| GET | /api/returns/:id | Get return details with fraud score |
| PATCH | /api/returns/:id/decision | Override return decision |
| GET | /api/dashboard/stats | Dashboard statistics |
| GET | /api/dashboard/clusters | Fraud ring cluster data |
| GET | /api/dashboard/signals | Signal frequency and trend data |
| POST | /api/scoring/toggle | Switch scoring strategy |

## Scoring Engine

7 weighted fraud signals evaluated per return:

| Signal | Description | Weight |
|--------|-------------|--------|
| returnVelocity | More than 3 returns in last 30 days | 25 |
| timingPattern | Return on day 28-30 of window | 20 |
| priceThreshold | Item value exceeds 2000 | 15 |
| accountAge | Account less than 7 days old | 20 |
| addressClustering | 3+ accounts share same address | 25 |
| deviceFingerprint | Same device used by multiple accounts | 30 |
| reasonMismatch | Claimed defective on sealed item | 15 |

### Risk Levels

- **LOW (0-35):** Auto-approved
- **MEDIUM (36-65):** Flagged for manual review
- **HIGH (66-100):** Auto-rejected + real-time alert fired

## Project Structure

```
backend/src/
├── controllers/     HTTP request handlers
├── services/        Business logic
├── repositories/    Data access layer
├── models/          Mongoose schemas
├── patterns/        Strategy + Observer interfaces
├── middleware/       Auth + error handling
├── routes/          Express route definitions
├── socket/          WebSocket setup
├── config/          Database configuration
└── seed.ts          Sample data generator

ml-service/
├── model.py         ML model wrapper
├── train.py         Training script
├── predict.py       Flask API server
└── requirements.txt Python dependencies

frontend/src/
├── components/      Reusable UI components
├── pages/           Page-level components
├── services/        API client
└── socket/          WebSocket client
```

## Environment Variables

Copy `backend/.env.example` and configure:

| Variable | Description |
|----------|-------------|
| MONGO_URI | MongoDB connection string |
| JWT_SECRET | Secret key for JWT signing |
| ML_SERVICE_URL | URL of the Python ML service |
| PORT | Backend server port |
| CLIENT_URL | Frontend URL for CORS |
| REDIS_URL | Redis connection for Bull queue |

## Limitations

* **Serverless Sockets:** Because the Node.js backend is configured to be deployable on serverless functions, long-polling WebSocket connections (Socket.io) are disabled in production to prevent timeout spam and boot crashes. Real-time dashboard alerts are only active locally or degrade to manual refresh on serverless deployments.
* **Payload Sandboxing:** The platform currently relies on a seeded MongoDB database. A live retail integration requires a persistent data-tunnel.

## Future Scope

* **One-Click Integration Wrapper:** Creating a plugin that automatically registers eCommerce webhooks onto the ingest endpoints so merchants do not have to write custom integration scripts.
* **Dedicated Data Ingestion API:** Expanding the backend to include persistent order synchronization endpoints, acting identically to standard payment provider API models to mirror retail databases in real-time.
* **Containerized Deployment Migration:** Shifting the Express backend from a serverless environment to a persistent cloud container to restore global WebSocket Alert functionality.
* **Live ML Re-Training Pipeline:** Automating a background cron-job that continually pulls manually overridden frontend return decisions to automatically re-train the Python ML model weights.
