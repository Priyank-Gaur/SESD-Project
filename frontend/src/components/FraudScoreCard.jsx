import React from 'react';

export default function FraudScoreCard({returnData, scoreData, onDecision, onClose}) {
  const getRiskColor=(level)=>{
    if (level==='HIGH') return 'var(--danger)';
    if (level==='MEDIUM') return 'var(--warning)';
    return 'var(--success)';
  };

  return (
    <div className="chart-container" style={{padding: '32px', position: 'relative'}}>
      <button 
        onClick={onClose}
        style={{
          position: 'absolute', right: '16px', top: '16px',
          background: 'transparent', color: 'var(--text-dim)',
          fontSize: '20px', cursor: 'pointer'
        }}
      >
        &times;
      </button>

      <div style={{display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'32px'}}>
        <div>
          <h3 className="chart-title" style={{marginBottom: '4px'}}>Analysis for Return #{returnData._id.slice(-6).toUpperCase()}</h3>
          <p style={{color:'var(--text-dim)', fontSize:'14px'}}>Method: {scoreData.strategy.toUpperCase()}</p>
        </div>
        <div style={{textAlign:'right'}}>
          <div style={{fontSize: '48px', fontWeight: 800, color: getRiskColor(scoreData.riskLevel), lineHeight: 1}}>
            {Number(scoreData.score).toFixed(0)}%
          </div>
          <span className={`badge badge-${scoreData.riskLevel.toLowerCase()}`} style={{marginTop: '8px', display: 'inline-block'}}>
            {scoreData.riskLevel} RISK
          </span>
        </div>
      </div>

      <div style={{display:'grid', gridTemplateColumns:'repeat(auto-fit, minmax(200px, 1fr))', gap:'24px', marginBottom:'40px'}}>
        <div className="stat-card" style={{padding: '16px'}}>
          <h3 style={{fontSize: '11px'}}>Return Reason</h3>
          <div style={{color: 'var(--text-main)', fontWeight: 600}}>{returnData.reason}</div>
        </div>
        <div className="stat-card" style={{padding: '16px'}}>
          <h3 style={{fontSize: '11px'}}>Current Status</h3>
          <div style={{color: 'var(--text-main)', fontWeight: 600, textTransform: 'capitalize'}}>{returnData.status}</div>
        </div>
      </div>

      <div className="signal-breakdown" style={{marginBottom: '40px'}}>
        <h3 style={{fontSize:'14px', fontWeight: 700, marginBottom: '20px', color: 'var(--text-dim)', textTransform: 'uppercase', letterSpacing: '0.05em'}}>
          Risk Signal Indicators
        </h3>
        {scoreData.signalBreakdown.map((signal, i)=>{
          // Formatting camelCase properties to Title Case Strings
          const formattedName = signal.signalName
            .replace(/([A-Z])/g, ' $1')
            .replace(/^./, str => str.toUpperCase());

          // Full dictionary covering all 7 active backend signals
          const descriptions = {
            'returnVelocity': 'Detects an unusually high frequency of return requests from this account within a very short 30-day timeframe.',
            'timingPattern': 'Flags wardrobe-behavior: when returns are systematically initiated exactly at the absolute limit (days 28-30) of the allowed 30-day grace period.',
            'priceThreshold': 'Triggers higher scrutiny automatically for exceptionally high-value or designer item claims (>$2,000 threshold).',
            'accountAge': 'Identifies disposable accounts created recently (under 7 days) attempting immediate high-risk returns.',
            'addressClustering': 'Identifies if this account shares identical physical shipping addresses with a cluster of 3 or more previously flagged accounts.',
            'deviceFingerprint': 'Flags severe risk when 2 or more separate accounts are initiating returns from the exact same physical device/browser fingerprint.',
            'reasonMismatch': 'Detects suspicious logical inconsistencies, such as claiming a sealed/unopened electronic item was "damaged" or "defective" upon arrival.',
            'default': 'Contributes toward overall risk determination based on historically anomalous behavior trends.'
          };
          const desc = descriptions[signal.signalName] || descriptions['default'];

          return (
          <div key={i} className="signal-row" style={{marginBottom: '16px'}}>
            <div style={{display: 'flex', justifyContent: 'space-between', marginBottom: '2px'}}>
              <span style={{fontWeight: 600, color: signal.fired ? 'var(--text-main)' : 'var(--text-dim)'}}>
                {formattedName}
              </span>
              <span style={{color: signal.fired ? 'var(--danger)' : 'var(--text-dim)', fontWeight: 700}}>
                {signal.fired ? `+${signal.contribution}` : '0'} / {signal.weight}
              </span>
            </div>
            <div style={{fontSize: '12px', color: 'var(--text-dim)', marginBottom: '8px', lineHeight: 1.4}}>
              {desc}
            </div>
            <div className="signal-bar" style={{height: '8px', background: 'rgba(255,255,255,0.05)'}}>
              <div 
                className="signal-bar-fill" 
                style={{
                  width: `${(signal.contribution/signal.weight)*100}%`,
                  background: signal.fired ? 'var(--danger)' : 'transparent',
                  boxShadow: signal.fired ? '0 0 10px rgba(244, 63, 94, 0.3)' : 'none'
                }}
              />
            </div>
          </div>
        )})}
      </div>

      {returnData.status === 'pending' && (
        <div style={{display:'flex', gap:'16px'}}>
          <button className="btn btn-success" style={{flex: 1, padding: '16px'}} onClick={()=>onDecision(returnData._id, 'approved')}>
            Approve Return
          </button>
          <button className="btn btn-danger" style={{flex: 1, padding: '16px'}} onClick={()=>onDecision(returnData._id, 'rejected')}>
            Reject as Fraudulent
          </button>
        </div>
      )}
    </div>
  );
}
