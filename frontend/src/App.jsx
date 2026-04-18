import React, {useState} from 'react';
import {BrowserRouter, Routes, Route, Navigate, Link} from 'react-router-dom';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Returns from './pages/Returns';
import Analytics from './pages/Analytics';
import Integration from './pages/Integration';
import './App.css';
export default function App() {
  const [token, setToken]=useState(localStorage.getItem('token')||'');
  const handleLogin=(newToken)=>{
    setToken(newToken);
    localStorage.setItem('token', newToken);
  };
  const handleLogout=()=>{
    setToken('');
    localStorage.removeItem('token');
  };
  if (!token) {
    return <Login onLogin={handleLogin}/>;
  }
  return (
    <BrowserRouter>
      <div className="app-container">
        <nav className="sidebar">
          <div className="sidebar-brand">Fraud Shield</div>
          <Link to="/dashboard" className="nav-link">Dashboard</Link>
          <Link to="/returns" className="nav-link">Returns</Link>
          <Link to="/analytics" className="nav-link">Analytics</Link>
          <Link to="/integration" className="nav-link">Integration</Link>
          <button onClick={handleLogout} className="logout-btn">Logout</button>
        </nav>
        <main className="main-content">
          <Routes>
            <Route path="/dashboard" element={<Dashboard/>}/>
            <Route path="/returns" element={<Returns/>}/>
            <Route path="/analytics" element={<Analytics/>}/>
            <Route path="/integration" element={<Integration/>}/>
            <Route path="*" element={<Navigate to="/dashboard"/>}/>
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}
