import axios from 'axios';
import {ScoringStrategy, ScoringResult} from './ScoringStrategy';
import {IReturn} from '../models/Return';
import {ReturnRepository} from '../repositories/ReturnRepository';
import {UserRepository} from '../repositories/UserRepository';
import {OrderRepository} from '../repositories/OrderRepository';
export class MLScoringStrategy implements ScoringStrategy {
  constructor(
    private returnRepo: ReturnRepository,
    private userRepo: UserRepository,
    private orderRepo: OrderRepository,
    private mlServiceUrl: string
  ) {}
  async score(returnRequest: IReturn): Promise<ScoringResult> {
    const user=await this.userRepo.findById(returnRequest.userId.toString());
    const order=await this.orderRepo.findById(returnRequest.orderId.toString());
    if (!user||!order) throw new Error('User or Order not found');
    const velocity=await this.returnRepo.countRecentByUser(user.id, 30);
    const addrCluster=await this.userRepo.findByAddress(user.address);
    const features={
      returnVelocity: velocity,
      accountAgeDays: user.getAccountAge(),
      itemPrice: order.getItemPrice(),
      dayOfWindow: order.getDaysSinceDelivery(),
      addressClusterSize: addrCluster.length
    };
    const response=await axios.post(`${this.mlServiceUrl}/predict`, features);
    const mlScore=Math.round(response.data.score*100);
    return {
      score: mlScore,
      signalBreakdown: [{signalName: 'ml_model', fired: mlScore>50, weight: 100, contribution: mlScore}]
    };
  }
}
