import React, {useState, useEffect} from 'react';
import api from '../services/api';

export default function Integration() {
  const [loading, setLoading] = useState(false);
  const [lastResponse, setLastResponse] = useState(null);
  
  const [formData, setFormData] = useState({
    orderId: '',
    userId: '',
    reason: 'Product defective'
  });

  useEffect(() => {
    fetchRandomOrder();
  }, []);

  const fetchRandomOrder = async () => {
    try {
      const res = await api.get('/orders/random');
      if (res.data) {
        setFormData(prev => ({
          ...prev,
          orderId: res.data._id,
          userId: res.data.userId
        }));
      }
    } catch (err) {
      console.error("Failed to fetch initial random order");
    }
  };

  const simulateWebhook = async (e) => {
    e.preventDefault();
    setLoading(true);
    setLastResponse(null);
    try {
      const payload = {
        orderId: formData.orderId,
        userId: formData.userId,
        reason: formData.reason
      };

      const returnRes = await api.post('/returns', payload);
      setLastResponse(JSON.stringify(returnRes.data, null, 2));
    } catch (err) {
      setLastResponse(err.response?.data?.error || err.message);
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

      <div style={{display: 'grid', gridTemplateColumns: 'minmax(400px, 1fr) minmax(400px, 1fr)', gap: 32}}>
        
        <div className="chart-container">
          <h3 className="chart-title">1. Return Request Webhook</h3>
          <p style={{color: 'var(--text-dim)', fontSize: 13, marginBottom: 16}}>
            Send a POST request to our scoring engine immediately when a customer requests a return, before issuing any refunds.
          </p>

          <div style={{background: 'var(--bg-dark)', padding: 16, borderRadius: 8, border: '1px solid var(--border)', marginBottom: 24}}>
            <code style={{color: 'var(--primary)', display: 'block', marginBottom: 12, fontWeight: 'bold'}}>POST /api/returns</code>
            <pre style={{color: 'var(--text-dim)', fontSize: 12, overflowX: 'auto'}}>
{`{
  "orderId": "651d2...",
  "userId": "usr_99...",
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

        <div className="chart-container" style={{display: 'flex', flexDirection: 'column'}}>
          <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24}}>
            <div>
              <h3 className="chart-title" style={{marginBottom: 4}}>2. Interactive Simulator Form</h3>
              <p style={{color: 'var(--text-dim)', fontSize: 13}}>
                Customize the simulation payload before dispatching it to the scoring engine.
              </p>
            </div>
            <button className="btn btn-primary btn-sm" onClick={fetchRandomOrder} style={{fontSize: 11, padding: '4px 8px'}}>
              Shuffle IDs
            </button>
          </div>

          <form onSubmit={simulateWebhook} style={{display: 'flex', flexDirection: 'column', gap: 16, marginBottom: 24}}>
            <div>
              <label style={{display: 'block', fontSize: 12, color: 'var(--text-dim)', marginBottom: 6}}>Order ID</label>
              <input 
                type="text" 
                value={formData.orderId} 
                onChange={(e) => setFormData({...formData, orderId: e.target.value})}
                style={{width: '100%', padding: '10px', background: 'var(--bg-dark)', border: '1px solid var(--border)', color: 'var(--text-main)', borderRadius: 6}}
                required
              />
            </div>
            <div>
              <label style={{display: 'block', fontSize: 12, color: 'var(--text-dim)', marginBottom: 6}}>User ID</label>
              <input 
                type="text" 
                value={formData.userId} 
                onChange={(e) => setFormData({...formData, userId: e.target.value})}
                style={{width: '100%', padding: '10px', background: 'var(--bg-dark)', border: '1px solid var(--border)', color: 'var(--text-main)', borderRadius: 6}}
                required
              />
            </div>
            <div>
              <label style={{display: 'block', fontSize: 12, color: 'var(--text-dim)', marginBottom: 6}}>Return Reason</label>
              <select 
                value={formData.reason} 
                onChange={(e) => setFormData({...formData, reason: e.target.value})}
                style={{width: '100%', padding: '10px', background: 'var(--bg-dark)', border: '1px solid var(--border)', color: 'var(--text-main)', borderRadius: 6}}
              >
                <option value="Product defective">Product defective</option>
                <option value="Item damaged in shipping">Item damaged in shipping</option>
                <option value="Wrong size">Wrong size</option>
                <option value="Changed my mind">Changed my mind</option>
                <option value="Defective seal broken">Defective seal broken</option>
                <option value="Found cheaper elsewhere">Found cheaper elsewhere</option>
              </select>
            </div>

            <button 
              type="submit"
              className="btn btn-primary" 
              style={{padding: '12px', fontSize: 14, fontWeight: 700, marginTop: 8}}
              disabled={loading || !formData.orderId}
            >
              {loading ? 'Processing...' : 'Submit Return Payload'}
            </button>
          </form>

          {lastResponse && (
            <div style={{flex: 1, display: 'flex', flexDirection: 'column'}}>
              <h4 style={{fontSize: 12, color: 'var(--text-dim)', textTransform: 'uppercase', marginBottom: 8}}>API Response:</h4>
              <div style={{background: 'var(--bg-dark)', padding: 16, borderRadius: 8, border: '1px solid var(--border)', flex: 1, maxHeight: 200, overflowY: 'auto'}}>
                <pre style={{color: lastResponse.includes('error') ? 'var(--danger)' : 'var(--success)', fontSize: 11, margin: 0}}>
                  {lastResponse}
                </pre>
              </div>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
