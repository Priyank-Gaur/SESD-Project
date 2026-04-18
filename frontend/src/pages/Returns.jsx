import React, {useState, useEffect} from 'react';
import api from '../services/api';
import ReturnQueue from '../components/ReturnQueue';
import FraudScoreCard from '../components/FraudScoreCard';

export default function Returns() {
  const [returns, setReturns]=useState([]);
  const [selectedReturn, setSelectedReturn]=useState(null);
  const [scoreData, setScoreData]=useState(null);
  const [loading, setLoading]=useState(false);

  useEffect(()=>{
    fetchReturns();
  }, []);

  const fetchReturns=async ()=>{
    setLoading(true);
    try {
      const res=await api.get('/returns');
      setReturns(res.data);
    } catch (err) {
      console.error('Failed to fetch returns');
    }
    setLoading(false);
  };

  const handleSelect=async (returnId)=>{
    setSelectedReturn(null);
    try {
      const res=await api.get(`/returns/${returnId}`);
      setSelectedReturn(res.data.return);
      setScoreData(res.data.fraudScore);
      setTimeout(() => {
        document.getElementById('details-section')?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }, 100);
    } catch (err) {
      console.error('Failed to fetch return details');
    }
  };

  const handleDecision=async (returnId, decision)=>{
    try {
      await api.patch(`/returns/${returnId}/decision`, {decision});
      await fetchReturns();
      setSelectedReturn(null);
      setScoreData(null);
    } catch (err) {
      console.error('Failed to update decision');
    }
  };

  return (
    <div className="returns-page">
      <h1 className="page-title">Return Queue Analysis</h1>
      
      {loading && !returns.length ? (
        <div className="chart-empty" style={{color: 'var(--primary)'}}>Synchronizing with merchant records...</div>
      ) : (
        <ReturnQueue returns={returns} onSelect={handleSelect}/>
      )}

      {selectedReturn && scoreData && (
        <div id="details-section" style={{marginTop: '40px'}}>
          <FraudScoreCard 
            returnData={selectedReturn} 
            scoreData={scoreData} 
            onDecision={handleDecision}
            onClose={() => {setSelectedReturn(null); setScoreData(null);}}
          />
        </div>
      )}
    </div>
  );
}
