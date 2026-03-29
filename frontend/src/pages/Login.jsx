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
    <div style={{display:'flex',alignItems:'center',justifyContent:'center',minHeight:'100vh',background:'#0f0f1a'}}>
      <div style={{width:400,padding:40,background:'#1a1a2e',borderRadius:16,border:'1px solid #2a2a4a'}}>
        <h1 style={{textAlign:'center',color:'#6366f1',marginBottom:8,fontSize:28}}>Fraud Shield</h1>
        <p style={{textAlign:'center',color:'#888',marginBottom:32,fontSize:14}}>Return Fraud Detection System</p>
        {error&&<div style={{padding:12,background:'rgba(239,68,68,0.1)',border:'1px solid #ef4444',borderRadius:8,color:'#ef4444',marginBottom:16,fontSize:14}}>{error}</div>}
        <form onSubmit={handleSubmit}>
          <div style={{marginBottom:16}}>
            <label style={{display:'block',marginBottom:6,color:'#aaa',fontSize:13}}>Email</label>
            <input type="email" value={email} onChange={e=>setEmail(e.target.value)} style={{width:'100%',padding:12,background:'#0f0f1a',border:'1px solid #2a2a4a',borderRadius:8,color:'#fff',fontSize:14}} required/>
          </div>
          <div style={{marginBottom:24}}>
            <label style={{display:'block',marginBottom:6,color:'#aaa',fontSize:13}}>Password</label>
            <input type="password" value={password} onChange={e=>setPassword(e.target.value)} style={{width:'100%',padding:12,background:'#0f0f1a',border:'1px solid #2a2a4a',borderRadius:8,color:'#fff',fontSize:14}} required/>
          </div>
          <button type="submit" disabled={loading} style={{width:'100%',padding:14,background:'#6366f1',color:'#fff',border:'none',borderRadius:8,fontSize:16,fontWeight:600,cursor:'pointer'}}>{loading?'Signing in...':'Sign In'}</button>
        </form>
      </div>
    </div>
  );
}
