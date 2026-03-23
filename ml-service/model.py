import joblib
import os
import numpy as np
from sklearn.linear_model import LogisticRegression
from sklearn.preprocessing import StandardScaler
class FraudScoringModel:
    def __init__(self):
        self.model=LogisticRegression(max_iter=1000, random_state=42)
        self.scaler=StandardScaler()
        self.is_trained=False
        self.model_path=os.path.join(os.path.dirname(__file__), 'model.pkl')
        self.scaler_path=os.path.join(os.path.dirname(__file__), 'scaler.pkl')
    def train(self, X, y):
        X_scaled=self.scaler.fit_transform(X)
        self.model.fit(X_scaled, y)
        self.is_trained=True
        joblib.dump(self.model, self.model_path)
        joblib.dump(self.scaler, self.scaler_path)
        print(f"Model saved to {self.model_path}")
    def predict(self, features):
        if not self.is_trained:
            self.load()
        X=np.array(features).reshape(1, -1)
        X_scaled=self.scaler.transform(X)
        proba=self.model.predict_proba(X_scaled)[0]
        fraud_prob=float(proba[1]) if len(proba)>1 else float(proba[0])
        confidence=float(max(proba))
        return {"score": fraud_prob, "confidence": confidence}
    def load(self):
        if os.path.exists(self.model_path) and os.path.exists(self.scaler_path):
            self.model=joblib.load(self.model_path)
            self.scaler=joblib.load(self.scaler_path)
            self.is_trained=True
            print("Model loaded from disk")
        else:
            raise FileNotFoundError("No trained model found. Run train.py first.")
