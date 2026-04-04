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
    <div>
      <h1 className="page-title">Analytics</h1>
      <AnalyticsChart signalData={signalData} trendData={trendData}/>
      <div className="chart-container">
        <div className="chart-title">Fraud Ring Clusters</div>
        <ClusterGraph data={clusterData}/>
      </div>
    </div>
  );
}
