from flask import Flask, request, jsonify
from flask_cors import CORS
from model import FraudScoringModel
app=Flask(__name__)
CORS(app)
model=FraudScoringModel()
try:
    model.load()
    print("Model loaded successfully")
except FileNotFoundError:
    print("WARNING: No trained model found. Run 'python train.py' first.")
@app.route('/predict', methods=['POST'])
def predict():
    data=request.get_json()
    if not data:
        return jsonify({"error": "No data provided"}), 400
    required_fields=['returnVelocity', 'accountAgeDays', 'itemPrice', 'dayOfWindow', 'addressClusterSize']
    missing=[f for f in required_fields if f not in data]
    if missing:
        return jsonify({"error": f"Missing fields: {', '.join(missing)}"}), 400
    features=[
        data['returnVelocity'],
        data['accountAgeDays'],
        data['itemPrice'],
        data['dayOfWindow'],
        data['addressClusterSize']
    ]
    try:
        result=model.predict(features)
        return jsonify(result), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500
@app.route('/health', methods=['GET'])
def health():
    return jsonify({"status": "ok", "model_loaded": model.is_trained}), 200
if __name__=='__main__':
    app.run(host='0.0.0.0', port=8000, debug=True)
