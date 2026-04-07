# Return Fraud Detection System

A merchant-facing platform that scores every e-commerce return request for fraud likelihood using a rule-based scoring engine with an ML toggle, real-time WebSocket alerts, and a fraud cluster graph.

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

Backend runs on `http://localhost:5000`

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
