import React, {useState} from 'react';
import api from '../services/api';

export default function Signup({onLogin, onToggleMode}) {
  const [name, setName]=useState('');
  const [email, setEmail]=useState('');
  const [password, setPassword]=useState('');
  const [error, setError]=useState('');
  const [loading, setLoading]=useState(false);

  const handleSubmit=async (e)=>{
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const res=await api.post('/auth/register', {name, email, password, role: 'merchant'});
      onLogin(res.data.token);
    } catch (err) {
      setError(err.response?.data?.error||'Registration failed');
    }
    setLoading(false);
  };

  return (
    <div className="login-page">
      <div className="login-card">
        <div className="login-header">
          <h1 className="login-title">Fraud Shield</h1>
          <p className="login-subtitle">Create Merchant Account</p>
        </div>
        
        {error && <div className="error-alert">{error}</div>}
        
        <form onSubmit={handleSubmit} className="login-form">
          <div className="form-group">
            <label>Organization Name</label>
            <input 
              type="text" 
              value={name} 
              onChange={e=>setName(e.target.value)} 
              placeholder="Acme Corp"
              required
            />
          </div>
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
            {loading ? 'Registering...' : 'Create Account'}
          </button>
        </form>
        
        <div className="login-footer">
          Already have an account? <span style={{color: 'var(--primary)', cursor: 'pointer', fontWeight: 'bold'}} onClick={onToggleMode}>Sign In</span>
        </div>
      </div>
    </div>
  );
}
