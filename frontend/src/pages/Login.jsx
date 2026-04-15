import React, {useState} from 'react';
import api from '../services/api';

export default function Login({onLogin}) {
  const [email, setEmail]=useState('merchant1@store.com');
  const [password, setPassword]=useState('password123');
  const [error, setError]=useState('');
  const [loading, setLoading]=useState(false);

  const handleSubmit=async (e)=>{
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const res=await api.post('/auth/login', {email, password});
      onLogin(res.data.token);
    } catch (err) {
      setError(err.response?.data?.error||'Login failed');
    }
    setLoading(false);
  };

  return (
    <div className="login-page">
      <div className="login-card">
        <div className="login-header">
          <h1 className="login-title">Fraud Shield</h1>
          <p className="login-subtitle">Advanced Return Fraud Detection</p>
        </div>
        
        {error && <div className="error-alert">{error}</div>}
        
        <form onSubmit={handleSubmit} className="login-form">
          <div className="form-group">
            <label>Email Address</label>
            <input 
              type="email" 
              value={email} 
              onChange={e=>setEmail(e.target.value)} 
              placeholder="name@company.com"
              required
            />
          </div>
          <div className="form-group">
            <label>Password</label>
            <input 
              type="password" 
              value={password} 
              onChange={e=>setPassword(e.target.value)} 
              placeholder="••••••••"
              required
            />
          </div>
          <button type="submit" disabled={loading} className="btn btn-primary login-btn">
            {loading ? 'Authenticating...' : 'Sign In'}
          </button>
        </form>
        
        <div className="login-footer">
          Secure merchant access only
        </div>
      </div>
    </div>
  );
}
