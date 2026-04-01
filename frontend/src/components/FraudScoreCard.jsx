import React from 'react';
export default function FraudScoreCard({returnData, scoreData, onDecision}) {
  const getRiskColor=(level)=>{
    if (level==='HIGH') return '#ef4444';
    if (level==='MEDIUM') return '#f59e0b';
    return '#22c55e';
  };
  return (
    <div style={{background:'#1a1a2e',padding:24,borderRadius:12,border:'1px solid #2a2a4a',marginTop:16}}>
      <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:20}}>
        <div>
          <h3 style={{color:'#fff',fontSize:18}}>Return Details</h3>
          <p style={{color:'#888',fontSize:13}}>ID: {returnData._id}</p>
        </div>
        <div style={{textAlign:'right'}}>
          <div style={{fontSize:42,fontWeight:700,color:getRiskColor(scoreData.riskLevel)}}>{scoreData.score}</div>
          <span className={`badge badge-${scoreData.riskLevel.toLowerCase()}`}>{scoreData.riskLevel} RISK</span>
        </div>
      </div>
      <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:12,marginBottom:20}}>
        <div><span style={{color:'#888',fontSize:12}}>Reason:</span> <span style={{color:'#ccc'}}>{returnData.reason}</span></div>
        <div><span style={{color:'#888',fontSize:12}}>Strategy:</span> <span style={{color:'#ccc'}}>{scoreData.strategy}</span></div>
        <div><span style={{color:'#888',fontSize:12}}>Status:</span> <span style={{color:'#ccc',textTransform:'capitalize'}}>{returnData.status}</span></div>
        <div><span style={{color:'#888',fontSize:12}}>Decision:</span> <span style={{color:'#ccc',textTransform:'capitalize'}}>{returnData.decision}</span></div>
      </div>
      <div className="signal-breakdown">
        <div style={{fontWeight:600,marginBottom:12,color:'#aaa',fontSize:13}}>Signal Breakdown</div>
        {scoreData.signalBreakdown.map((signal, i)=>(
          <div key={i} className="signal-row">
            <span style={{width:160}} className={signal.fired?'signal-fired':'signal-not-fired'}>{signal.signalName}</span>
            <div className="signal-bar">
              <div className="signal-bar-fill" style={{width:`${(signal.contribution/signal.weight)*100}%`,background:signal.fired?'#ef4444':'#2a2a4a'}}/>
            </div>
            <span style={{width:60,textAlign:'right',color:signal.fired?'#ef4444':'#666'}}>{signal.contribution}/{signal.weight}</span>
          </div>
        ))}
      </div>
      {returnData.status==='pending'&&(
        <div style={{display:'flex',gap:12,marginTop:20}}>
          <button className="btn btn-success" onClick={()=>onDecision(returnData._id, 'approved')}>Approve</button>
          <button className="btn btn-danger" onClick={()=>onDecision(returnData._id, 'rejected')}>Reject</button>
        </div>
      )}
    </div>
  );
}
