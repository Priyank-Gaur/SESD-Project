import {FraudScore, IFraudScore} from '../models/FraudScore';
export class FraudScoreRepository {
  async findById(id: string): Promise<IFraudScore|null> {
    return FraudScore.findById(id);
  }
  async findAll(): Promise<IFraudScore[]> {
    return FraudScore.find({});
  }
  async findByReturnId(returnId: string): Promise<IFraudScore|null> {
    return FraudScore.findOne({returnId});
  }
  async create(data: Partial<IFraudScore>): Promise<IFraudScore> {
    const fraudScore=new FraudScore(data);
    return fraudScore.save();
  }
  async update(id: string, data: Partial<IFraudScore>): Promise<IFraudScore|null> {
    return FraudScore.findByIdAndUpdate(id, data, {new: true});
  }
  async delete(id: string): Promise<void> {
    await FraudScore.findByIdAndDelete(id);
  }
  async getSignalStats(): Promise<{signalName: string; count: number}[]> {
    const scores=await FraudScore.find({});
    const signalCounts: Record<string, number>={};
    scores.forEach(s=>{
      s.signalBreakdown.forEach(signal=>{
        if (signal.fired) {
          signalCounts[signal.signalName]=(signalCounts[signal.signalName]||0)+1;
        }
      });
    });
    return Object.entries(signalCounts).map(([signalName, count])=>({signalName, count}));
  }
  async getFraudTrend(days: number): Promise<{date: string; total: number; highRisk: number}[]> {
    const since=new Date(Date.now()-days*24*60*60*1000);
    const scores=await FraudScore.find({createdAt: {$gte: since}});
    const trend: Record<string, {total: number; highRisk: number}>={};
    scores.forEach(s=>{
      const date=s.createdAt.toISOString().split('T')[0];
      if (!trend[date]) trend[date]={total: 0, highRisk: 0};
      trend[date].total++;
      if (s.riskLevel==='HIGH') trend[date].highRisk++;
    });
    return Object.entries(trend).map(([date, data])=>({date, ...data})).sort((a,b)=>a.date.localeCompare(b.date));
  }
  async countByRiskLevel(level: string): Promise<number> {
    return FraudScore.countDocuments({riskLevel: level});
  }
}
