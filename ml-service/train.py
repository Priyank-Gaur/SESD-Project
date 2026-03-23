import numpy as np
from model import FraudScoringModel
def generate_synthetic_data(n_samples=500):
    np.random.seed(42)
    X=np.zeros((n_samples, 5))
    y=np.zeros(n_samples, dtype=int)
    for i in range(n_samples):
        is_fraud=np.random.random()<0.3
        if is_fraud:
            X[i, 0]=np.random.randint(4, 10)
            X[i, 1]=np.random.randint(1, 7)
            X[i, 2]=np.random.uniform(2000, 8000)
            X[i, 3]=np.random.randint(28, 31)
            X[i, 4]=np.random.randint(3, 8)
            y[i]=1
        else:
            X[i, 0]=np.random.randint(0, 3)
            X[i, 1]=np.random.randint(30, 365)
            X[i, 2]=np.random.uniform(20, 1500)
            X[i, 3]=np.random.randint(1, 20)
            X[i, 4]=np.random.randint(1, 2)
            y[i]=0
    return X, y
if __name__=='__main__':
    print("Generating 500 synthetic samples...")
    X, y=generate_synthetic_data(500)
    print(f"Features shape: {X.shape}")
    print(f"Fraud ratio: {y.mean():.2%}")
    model=FraudScoringModel()
    model.train(X, y)
    test_features=[5, 3, 3500, 29, 4]
    result=model.predict(test_features)
    print(f"\nTest prediction (suspicious sample): {result}")
    test_clean=[1, 100, 200, 5, 1]
    result_clean=model.predict(test_clean)
    print(f"Test prediction (clean sample): {result_clean}")
    print("\nTraining complete!")
