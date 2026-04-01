import React, {useState, useEffect} from 'react';
import api from '../services/api';
import ReturnQueue from '../components/ReturnQueue';
import FraudScoreCard from '../components/FraudScoreCard';
export default function Returns() {
  const [returns, setReturns]=useState([]);
  const [selectedReturn, setSelectedReturn]=useState(null);
  const [scoreData, setScoreData]=useState(null);
  useEffect(()=>{
    fetchReturns();
  }, []);
  const fetchReturns=async ()=>{
    try {
      const res=await api.get('/returns');
      setReturns(res.data);
    } catch (err) {
      console.error('Failed to fetch returns');
    }
  };
  const handleSelect=async (returnId)=>{
    try {
      const res=await api.get(`/returns/${returnId}`);
      setSelectedReturn(res.data.return);
      setScoreData(res.data.fraudScore);
    } catch (err) {
      console.error('Failed to fetch return details');
    }
  };
  const handleDecision=async (returnId, decision)=>{
    try {
      await api.patch(`/returns/${returnId}/decision`, {decision});
      fetchReturns();
      setSelectedReturn(null);
      setScoreData(null);
    } catch (err) {
      console.error('Failed to update decision');
    }
  };
  return (
    <div>
      <h1 className="page-title">Return Queue</h1>
      <ReturnQueue returns={returns} onSelect={handleSelect}/>
      {selectedReturn&&scoreData&&(
        <FraudScoreCard returnData={selectedReturn} scoreData={scoreData} onDecision={handleDecision}/>
      )}
    </div>
  );
}
