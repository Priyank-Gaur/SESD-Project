import {ReturnRepository} from '../repositories/ReturnRepository';
import {OrderRepository} from '../repositories/OrderRepository';
import {ScoringService} from './ScoringService';
import {IReturn} from '../models/Return';
import {IFraudScore} from '../models/FraudScore';
export class ReturnService {
  constructor(
    private returnRepo: ReturnRepository,
    private orderRepo: OrderRepository,
    private scoringService: ScoringService
  ) {}
  async createReturn(data: {orderId: string; userId: string; reason: string}): Promise<{return: IReturn; fraudScore: IFraudScore}> {
    const order=await this.orderRepo.findById(data.orderId);
    if (!order) throw new Error('Order not found');
    const returnDoc=await this.returnRepo.create({
      orderId: order._id,
      userId: data.userId as unknown as import('mongoose').Types.ObjectId,
      reason: data.reason
    });
    const fraudScore=await this.scoringService.scoreReturn(returnDoc);
    return {return: returnDoc, fraudScore};
  }
  async getAllReturns(): Promise<IReturn[]> {
    return this.returnRepo.findAll();
  }
  async getReturnById(id: string): Promise<{return: IReturn; fraudScore: IFraudScore|null}|null> {
    const returnDoc=await this.returnRepo.findById(id);
    if (!returnDoc) return null;
    const fraudScore=await this.scoringService['fraudScoreRepo'].findByReturnId(id);
    return {return: returnDoc, fraudScore};
  }
  async updateDecision(id: string, decision: 'approved'|'rejected'): Promise<IReturn|null> {
    return this.returnRepo.update(id, {status: decision, decision: 'manual'});
  }
}
