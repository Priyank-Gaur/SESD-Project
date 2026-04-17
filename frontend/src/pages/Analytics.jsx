import React, {useState, useEffect} from 'react';
import api from '../services/api';
import AnalyticsChart from '../components/AnalyticsChart';
import ClusterGraph from '../components/ClusterGraph';
export default function Analytics() {
  const [signalData, setSignalData]=useState(null);
  const [trendData, setTrendData]=useState(null);
  const [clusterData, setClusterData]=useState(null);
  useEffect(()=>{
    fetchData();
  }, []);
  const fetchData=async ()=>{
    try {
      const [sigRes, clusterRes]=await Promise.all([
        api.get('/dashboard/signals'),
        api.get('/dashboard/clusters')
      ]);
      setSignalData(sigRes.data.signals);
      setTrendData(sigRes.data.trend);
      setClusterData(clusterRes.data);
    } catch (err) {
      console.error('Failed to fetch analytics data');
    }
  };
  return (
    <div className="analytics-page">
      <h1 className="page-title" style={{marginBottom: 8}}>Analytics Overview</h1>
      <p style={{color: 'var(--text-dim)', marginBottom: 32, fontSize: 14}}>
        Comprehensive visualization of risk signals, fraud trends, and interconnected return networks across the platform.
      </p>

      <AnalyticsChart signalData={signalData} trendData={trendData}/>

      <div className="chart-container" style={{marginTop: 32}}>
        <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16}}>
          <div>
            <h3 className="chart-title" style={{marginBottom: 4}}>Fraud Ring Clusters</h3>
            <p style={{color: 'var(--text-dim)', fontSize: 13, maxWidth: 600}}>
              This graph maps out connections between seemingly independent customer accounts. 
              Accounts linked by a solid purple line share a <strong>physical shipping address</strong>, 
              while a dashed red line indicates they share the exact same <strong>device fingerprint</strong>. 
              Highly interconnected nodes represent organized fraudulent networks.
            </p>
          </div>
        </div>
        <ClusterGraph data={clusterData}/>
      </div>
    </div>
  );
}
