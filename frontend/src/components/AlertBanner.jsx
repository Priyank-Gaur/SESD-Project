import React from 'react';
export default function AlertBanner({alerts}) {
  if (!alerts||alerts.length===0) return null;
  return (
    <div style={{marginBottom:24}}>
      {alerts.map((alert, i)=>(
        <div key={i} style={{padding:14,background:'rgba(239,68,68,0.1)',border:'1px solid #ef4444',borderRadius:8,marginBottom:8,display:'flex',justifyContent:'space-between',alignItems:'center'}}>
          <div>
            <span style={{color:'#ef4444',fontWeight:700,marginRight:12}}>⚠ HIGH RISK</span>
            <span style={{color:'#ccc'}}>Return {String(alert.returnId).slice(-6)} scored {alert.score}</span>
          </div>
          <span style={{color:'#888',fontSize:12}}>{new Date(alert.timestamp).toLocaleTimeString()}</span>
        </div>
      ))}
    </div>
  );
}
