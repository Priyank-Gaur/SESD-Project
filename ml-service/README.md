# ML Service — Return Fraud Detection

A lightweight Flask microservice that provides ML-based fraud scoring using Logistic Regression.

## Setup

```bash
cd ml-service
python -m venv venv
source venv/bin/activate
pip install -r requirements.txt
```

## Train the model

```bash
python train.py
```

This generates `model.pkl` and `scaler.pkl` from 500 synthetic samples.

## Run the service

```bash
python predict.py
```

The service runs on `http://localhost:8000`.

## Endpoints

| Method | Path | Description |
|--------|------|-------------|
| POST | /predict | Accepts features, returns fraud score and confidence |
| GET | /health | Health check endpoint |

## Request format

```json
{
  "returnVelocity": 5,
  "accountAgeDays": 3,
  "itemPrice": 3500,
  "dayOfWindow": 29,
  "addressClusterSize": 4
}
```

## Response format

```json
{
  "score": 0.92,
  "confidence": 0.95
}
```
