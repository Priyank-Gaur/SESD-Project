import React from 'react';

export default function ReturnQueue({returns, onSelect}) {
  const getBadge=(status)=>{
    if (status==='rejected') return <span className="badge badge-high">Rejected</span>;
    if (status==='approved') return <span className="badge badge-low">Approved</span>;
    return <span className="badge badge-medium">Pending</span>;
  };

  if (!returns || returns.length === 0) {
    return (
      <div className="chart-container" style={{textAlign: 'center', padding: '60px 0'}}>
        <p style={{color: 'var(--text-dim)'}}>No return requests found in the queue.</p>
      </div>
    );
  }

  return (
    <div className="table-container" style={{marginBottom: 32}}>
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Customer</th>
            <th>Reason</th>
            <th>Status</th>
            <th>Confidence</th>
            <th>Date</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {returns.map(ret => (
            <tr key={ret._id}>
              <td style={{fontFamily: 'monospace', color: 'var(--primary)', fontWeight: 600}}>
                {ret._id.slice(-6).toUpperCase()}
              </td>
              <td>
                <div style={{fontWeight: 600}}>{ret.userId?.name || 'Guest'}</div>
                <div style={{fontSize: 12, color: 'var(--text-dim)'}}>{ret.userId?.email || 'N/A'}</div>
              </td>
              <td style={{maxWidth: 200, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap'}}>
                {ret.reason}
              </td>
              <td>{getBadge(ret.status)}</td>
              <td>
                <span style={{
                  color: ret.status === 'rejected' ? 'var(--danger)' : 'var(--text-main)',
                  fontWeight: 700
                }}>
                  {ret.decision === 'automated' ? 'AI Score' : 'Manual'}
                </span>
              </td>
              <td style={{fontSize: 13, color: 'var(--text-dim)'}}>
                {new Date(ret.requestedAt).toLocaleDateString()}
              </td>
              <td>
                <button 
                  className="btn btn-primary btn-sm" 
                  onClick={() => onSelect(ret._id)}
                  style={{padding: '6px 14px', borderRadius: '8px'}}
                >
                  Analyze
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
