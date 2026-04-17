import React from 'react';
import {BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line} from 'recharts';
export default function AnalyticsChart({signalData, trendData}) {
  return (
    <div>
      <div className="chart-container" style={{marginBottom: 32}}>
        <div>
          <h3 className="chart-title" style={{marginBottom: 4}}>Risk Signal Frequency</h3>
          <p style={{color: 'var(--text-dim)', fontSize: 13, marginBottom: 24, maxWidth: 600}}>
            A breakdown of how often specific risk indicators are triggered during return requests. 
            High spikes highlight the most prevalent fraudulent tactics currently being used against the platform.
          </p>
        </div>
        {signalData&&signalData.length>0?(
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={signalData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#2a2a4a"/>
              <XAxis dataKey="signalName" tick={{fill:'#888',fontSize:11}} angle={-20} textAnchor="end" height={60}/>
              <YAxis tick={{fill:'#888'}}/>
              <Tooltip contentStyle={{background:'#1a1a2e',border:'1px solid #2a2a4a',borderRadius:8}}/>
              <Bar dataKey="count" fill="#6366f1" radius={[4,4,0,0]}/>
            </BarChart>
          </ResponsiveContainer>
        ):<div className="chart-empty">No signal data available</div>}
      </div>
      <div className="chart-container">
        <div>
          <h3 className="chart-title" style={{marginBottom: 4}}>Fraud Rate Trend (Last 30 Days)</h3>
          <p style={{color: 'var(--text-dim)', fontSize: 13, marginBottom: 24, maxWidth: 600}}>
            Tracks the total volume of returns (purple) against those flagged as severe high-risk fraud (red). 
            This demonstrates the effectiveness of the scoring engine in actively identifying abuse over time.
          </p>
        </div>
        {trendData&&trendData.length>0?(
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={trendData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#2a2a4a"/>
              <XAxis dataKey="date" tick={{fill:'#888',fontSize:11}}/>
              <YAxis tick={{fill:'#888'}}/>
              <Tooltip contentStyle={{background:'#1a1a2e',border:'1px solid #2a2a4a',borderRadius:8}}/>
              <Line type="monotone" dataKey="total" stroke="#6366f1" strokeWidth={2} dot={{r:3}}/>
              <Line type="monotone" dataKey="highRisk" stroke="#ef4444" strokeWidth={2} dot={{r:3}}/>
            </LineChart>
          </ResponsiveContainer>
        ):<div className="chart-empty">No trend data available</div>}
      </div>
    </div>
  );
}
