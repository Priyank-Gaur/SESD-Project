import React, {useState, useEffect} from 'react';
import api from '../services/api';
import socket from '../socket/socket';
import AlertBanner from '../components/AlertBanner';
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
      {stats&&(
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
