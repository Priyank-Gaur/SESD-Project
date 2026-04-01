import React from 'react';
export default function ReturnQueue({returns, onSelect}) {
  const getRiskClass=(ret)=>{
    if (!ret.status||ret.status==='pending') return '';
    if (ret.status==='rejected') return 'risk-high';
    return 'risk-low';
  };
  const getBadge=(status)=>{
    if (status==='rejected') return <span className="badge badge-high">Rejected</span>;
    if (status==='approved') return <span className="badge badge-low">Approved</span>;
    return <span className="badge badge-medium">Pending</span>;
  };
  if (!returns||returns.length===0) {
    return <div className="chart-empty">No returns found</div>;
  }
  return (
    <div className="table-container" style={{marginBottom:24}}>
      <table>
        <thead>
          <tr>
            <th>Return ID</th>
            <th>Customer</th>
            <th>Reason</th>
            <th>Status</th>
            <th>Decision</th>
            <th>Date</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {returns.map(ret=>(
            <tr key={ret._id} className={getRiskClass(ret)}>
              <td style={{fontFamily:'monospace',fontSize:12}}>{ret._id.slice(-8)}</td>
              <td>{ret.userId?.name||'N/A'}</td>
              <td>{ret.reason}</td>
              <td>{getBadge(ret.status)}</td>
              <td style={{textTransform:'capitalize'}}>{ret.decision}</td>
              <td style={{fontSize:13,color:'#888'}}>{new Date(ret.requestedAt).toLocaleDateString()}</td>
              <td><button className="btn btn-primary btn-sm" onClick={()=>onSelect(ret._id)}>View</button></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
