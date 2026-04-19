import React, {useState, useEffect} from 'react';
import api from '../services/api';
import socket from '../socket/socket';
import AlertBanner from '../components/AlertBanner';
import {Link} from 'react-router-dom';
export default function Dashboard() {
  const [stats, setStats]=useState(null);
  const [strategy, setStrategy]=useState('rule-based');
  const [alerts, setAlerts]=useState([]);
  useEffect(()=>{
    fetchStats();
    socket.on('fraud_alert', (data)=>{
      setAlerts(prev=>[data, ...prev].slice(0, 5));
    });
    return ()=>socket.off('fraud_alert');
  }, []);
  const fetchStats=async ()=>{
    try {
      const res=await api.get('/dashboard/stats');
      setStats(res.data);
      if (res.data.strategy) {
        setStrategy(res.data.strategy);
      }
    } catch (err) {
      console.error('Failed to fetch stats');
    }
  };
  const toggleStrategy=async ()=>{
    const newStrategy=strategy==='rule-based'?'ml':'rule-based';
    try {
      const res = await api.post('/scoring/toggle', {strategy: newStrategy});
      setStrategy(res.data.activeStrategy);
    } catch (err) {
      console.error('Failed to toggle strategy');
    }
  };
  return (
    <div>
      <h1 className="page-title">Dashboard</h1>
      <AlertBanner alerts={alerts}/>
      <div className="toggle-container">
        <span className="toggle-label">Scoring Strategy:</span>
        <button className="btn btn-primary" onClick={toggleStrategy}>{strategy==='rule-based'?'Rule-Based':'ML Model'}</button>
        <span className="toggle-label">(click to switch)</span>
      </div>
      {stats && stats.totalReturns === 0 ? (
        <div style={{textAlign: 'center', padding: '60px 20px', background: 'var(--card-bg)', borderRadius: '20px', border: '1px dashed var(--border-color)', marginTop: '20px'}}>
          <h2 style={{fontSize: '24px', marginBottom: '16px', color: 'var(--text-main)'}}>Welcome to Fraud Shield! 🚀</h2>
          <p style={{color: 'var(--text-dim)', marginBottom: '32px', maxWidth: '600px', marginLeft: 'auto', marginRight: 'auto', lineHeight: '1.6'}}>
            Your organization dashboard is currently empty because we haven't received any Return Webhooks yet. 
            To see the AI Engine in action immediately, head over to the <b>Integration Sandbox</b> to simulate an incoming return request.
          </p>
          <Link to="/integration" className="btn btn-primary" style={{padding: '14px 28px', fontSize: '16px'}}>
            Go to Integration Sandbox
          </Link>
        </div>
      ) : stats && (
        <div className="stats-grid">
          <div className="stat-card">
            <h3>Total Returns</h3>
            <div className="stat-value">{stats.totalReturns}</div>
          </div>
          <div className="stat-card">
            <h3>Pending Review</h3>
            <div className="stat-value medium">{stats.pending}</div>
          </div>
          <div className="stat-card">
            <h3>Approved</h3>
            <div className="stat-value low">{stats.approved}</div>
          </div>
          <div className="stat-card">
            <h3>Rejected</h3>
            <div className="stat-value high">{stats.rejected}</div>
          </div>
          <div className="stat-card">
            <h3>High Risk</h3>
            <div className="stat-value high">{stats.highRisk}</div>
          </div>
          <div className="stat-card">
            <h3>Fraud Rate</h3>
            <div className="stat-value high">{stats.fraudRate}%</div>
          </div>
        </div>
      )}
    </div>
  );
}
