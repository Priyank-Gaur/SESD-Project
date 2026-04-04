import React from 'react';
import {BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line} from 'recharts';
export default function AnalyticsChart({signalData, trendData}) {
  return (
    <div>
      <div className="chart-container">
        <div className="chart-title">Signal Frequency</div>
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
        <div className="chart-title">Fraud Rate Trend (Last 30 Days)</div>
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
