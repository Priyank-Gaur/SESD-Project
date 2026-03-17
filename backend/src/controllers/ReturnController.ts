import {Request, Response} from 'express';
import {ReturnService} from '../services/ReturnService';
import {ScoringService} from '../services/ScoringService';
export class ReturnController {
  constructor(
    private returnService: ReturnService,
    private scoringService: ScoringService
  ) {}
  createReturn=async (req: Request, res: Response): Promise<void>=>{
    try {
      const result=await this.returnService.createReturn(req.body);
      res.status(201).json(result);
    } catch (error: unknown) {
      const message=error instanceof Error ? error.message : 'Failed to create return';
      res.status(400).json({error: message});
    }
  };
  getAllReturns=async (_req: Request, res: Response): Promise<void>=>{
    try {
      const returns=await this.returnService.getAllReturns();
      res.status(200).json(returns);
    } catch (error: unknown) {
      res.status(500).json({error: 'Failed to fetch returns'});
    }
  };
  getReturnById=async (req: Request, res: Response): Promise<void>=>{
    try {
      const result=await this.returnService.getReturnById(req.params.id);
      if (!result) { res.status(404).json({error: 'Return not found'}); return; }
      res.status(200).json(result);
    } catch (error: unknown) {
      res.status(500).json({error: 'Failed to fetch return'});
    }
  };
  updateDecision=async (req: Request, res: Response): Promise<void>=>{
    try {
      const result=await this.returnService.updateDecision(req.params.id, req.body.decision);
      res.status(200).json(result);
    } catch (error: unknown) {
      const message=error instanceof Error ? error.message : 'Failed to update decision';
      res.status(400).json({error: message});
    }
  };
  toggleStrategy=async (req: Request, res: Response): Promise<void>=>{
    try {
      const {strategy}=req.body;
      this.scoringService.setStrategy(strategy);
      res.status(200).json({activeStrategy: this.scoringService.getActiveStrategy()});
    } catch (error: unknown) {
      res.status(400).json({error: 'Failed to toggle strategy'});
    }
  };
}
