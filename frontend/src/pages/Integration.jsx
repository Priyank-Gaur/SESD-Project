import React, {useState} from 'react';
import api from '../services/api';

export default function Integration() {
  const [loading, setLoading] = useState(false);
  const [lastResponse, setLastResponse] = useState(null);

  const simulateWebhook = async () => {
    setLoading(true);
    try {
      // Step 1: Fetch a random existing order from the database
      const orderRes = await api.get('/orders/random');
      const randomOrder = orderRes.data;

      if (!randomOrder) {
        setLastResponse({error: "Failed to find a valid order in the database to mock."});
        setLoading(false);
        return;
      }

      // Step 2: Trigger the actual return webhook just like an external system would
      const payload = {
        orderId: randomOrder._id,
        userId: randomOrder.userId,
        reason: 'Item damaged in shipping'
      };

      const returnRes = await api.post('/returns', payload);
      setLastResponse(JSON.stringify(returnRes.data, null, 2));

    } catch (err) {
      setLastResponse({error: err.response?.data?.error || err.message});
    }
    setLoading(false);
  };

  return (
    <div className="analytics-page">
      <h1 className="page-title" style={{marginBottom: 8}}>API Integration & Sandbox</h1>
      <p style={{color: 'var(--text-dim)', marginBottom: 32, fontSize: 14, maxWidth: 800}}>
        Connect your e-commerce platform (Shopify, Magento, Custom) to the Fraud Shield engine. 
        Whenever a user initiates a return on your platform, fire a webhook to our API to score the transaction in real-time.
      </p>

      <div style={{display: 'grid', gridTemplateColumns: 'minmax(400px, 1fr) minmax(300px, 1fr)', gap: 32}}>
        
        {/* Left Side: API Documentation */}
        <div className="chart-container">
          <h3 className="chart-title">1. Return Request Webhook</h3>
          <p style={{color: 'var(--text-dim)', fontSize: 13, marginBottom: 16}}>
            Send a POST request to our scoring engine immediately when a customer requests a return, before issuing any refunds.
          </p>

          <div style={{background: 'var(--bg-dark)', padding: 16, borderRadius: 8, border: '1px solid var(--border)', marginBottom: 24}}>
            <code style={{color: 'var(--primary)', display: 'block', marginBottom: 12, fontWeight: 'bold'}}>POST /api/returns</code>
            <pre style={{color: 'var(--text-dim)', fontSize: 12, overflowX: 'auto'}}>
{`{
  "orderId": "651d2f7x3c9abc...",
  "userId": "usr_998319f...",
  "reason": "Defective seal broken"
}`}
            </pre>
          </div>

          <h3 className="chart-title" style={{marginTop: 32}}>Authentication</h3>
          <p style={{color: 'var(--text-dim)', fontSize: 13, marginBottom: 16}}>
            All requests must include your merchant API Key in the Authorization header.
          </p>
          <div style={{background: 'var(--bg-dark)', padding: 12, borderRadius: 8, border: '1px solid var(--border)', fontFamily: 'monospace', color: 'var(--text-dim)', fontSize: 12}}>
            Authorization: Bearer sk_live_fraudshield123...
          </div>
        </div>

        {/* Right Side: Simulator */}
        <div className="chart-container" style={{display: 'flex', flexDirection: 'column'}}>
          <h3 className="chart-title">2. Sandbox Simulator</h3>
          <p style={{color: 'var(--text-dim)', fontSize: 13, marginBottom: 24}}>
            Test the integration without writing any code. Clicking this button will automatically grab a random historical order and fire the webhook above, grading the return in real-time.
          </p>

          <button 
            className="btn btn-primary" 
            style={{padding: '16px', fontSize: 14, fontWeight: 700, marginBottom: 24, alignSelf: 'flex-start'}}
            onClick={simulateWebhook}
            disabled={loading}
          >
            {loading ? 'Simulating Webhook...' : 'Fire Test Webhook Payload'}
          </button>

          {lastResponse && (
            <div style={{flex: 1, display: 'flex', flexDirection: 'column'}}>
              <h4 style={{fontSize: 12, color: 'var(--text-dim)', textTransform: 'uppercase', marginBottom: 8}}>API Response:</h4>
              <div style={{background: 'var(--bg-dark)', padding: 16, borderRadius: 8, border: '1px solid var(--border)', flex: 1, maxHeight: 300, overflowY: 'auto'}}>
                <pre style={{color: 'var(--success)', fontSize: 11, margin: 0}}>
                  {typeof lastResponse === 'string' ? lastResponse : JSON.stringify(lastResponse, null, 2)}
                </pre>
              </div>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
