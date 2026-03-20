import {Request, Response} from 'express';
import {ReturnRepository} from '../repositories/ReturnRepository';
import {FraudScoreRepository} from '../repositories/FraudScoreRepository';
import {ClusterService} from '../services/ClusterService';
export class DashboardController {
  constructor(
    private returnRepo: ReturnRepository,
    private fraudScoreRepo: FraudScoreRepository,
    private clusterService: ClusterService
  ) {}
  getStats=async (_req: Request, res: Response): Promise<void>=>{
    try {
      const totalReturns=await this.returnRepo.countAll();
      const pending=await this.returnRepo.countByStatus('pending');
      const approved=await this.returnRepo.countByStatus('approved');
      const rejected=await this.returnRepo.countByStatus('rejected');
      const highRisk=await this.fraudScoreRepo.countByRiskLevel('HIGH');
      const fraudRate=totalReturns>0?Math.round((highRisk/totalReturns)*100):0;
      res.status(200).json({totalReturns, pending, approved, rejected, highRisk, fraudRate});
    } catch {
      res.status(500).json({error: 'Failed to fetch stats'});
    }
  };
  getClusters=async (_req: Request, res: Response): Promise<void>=>{
    try {
      const clusters=await this.clusterService.getAllClusters();
      res.status(200).json(clusters);
    } catch {
      res.status(500).json({error: 'Failed to fetch clusters'});
    }
  };
  getSignals=async (_req: Request, res: Response): Promise<void>=>{
    try {
      const signals=await this.fraudScoreRepo.getSignalStats();
      const trend=await this.fraudScoreRepo.getFraudTrend(30);
      res.status(200).json({signals, trend});
    } catch {
      res.status(500).json({error: 'Failed to fetch signals'});
    }
  };
}
