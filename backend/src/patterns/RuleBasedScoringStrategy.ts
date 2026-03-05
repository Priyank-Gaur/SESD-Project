import {ScoringStrategy, ScoringResult} from './ScoringStrategy';
import {IReturn} from '../models/Return';
import {ISignalBreakdown} from '../models/FraudScore';
import {ReturnRepository} from '../repositories/ReturnRepository';
import {UserRepository} from '../repositories/UserRepository';
import {OrderRepository} from '../repositories/OrderRepository';
const SIGNALS=[
  {name: 'returnVelocity', weight: 25},
  {name: 'timingPattern', weight: 20},
  {name: 'priceThreshold', weight: 15},
  {name: 'accountAge', weight: 20},
  {name: 'addressClustering', weight: 25},
  {name: 'deviceFingerprint', weight: 30},
  {name: 'reasonMismatch', weight: 15}
];
export class RuleBasedScoringStrategy implements ScoringStrategy {
  constructor(
    private returnRepo: ReturnRepository,
    private userRepo: UserRepository,
    private orderRepo: OrderRepository
  ) {}
  async score(returnRequest: IReturn): Promise<ScoringResult> {
    const userId=returnRequest.userId.toString();
    const orderId=returnRequest.orderId.toString();
    const user=await this.userRepo.findById(userId);
    const order=await this.orderRepo.findById(orderId);
    if (!user||!order) throw new Error('User or Order not found for scoring');
    const breakdown: ISignalBreakdown[]=[];
    const recentReturns=await this.returnRepo.countRecentByUser(userId, 30);
    const velocityFired=recentReturns>3;
    breakdown.push({signalName: 'returnVelocity', fired: velocityFired, weight: 25, contribution: velocityFired?25:0});
    const daysSinceDelivery=order.getDaysSinceDelivery();
    const timingFired=daysSinceDelivery>=28&&daysSinceDelivery<=30;
    breakdown.push({signalName: 'timingPattern', fired: timingFired, weight: 20, contribution: timingFired?20:0});
    const priceFired=order.getItemPrice()>2000;
    breakdown.push({signalName: 'priceThreshold', fired: priceFired, weight: 15, contribution: priceFired?15:0});
    const accountAge=user.getAccountAge();
    const ageFired=accountAge<7;
    breakdown.push({signalName: 'accountAge', fired: ageFired, weight: 20, contribution: ageFired?20:0});
    const sameAddressUsers=await this.userRepo.findByAddress(user.address);
    const clusterFired=sameAddressUsers.length>=3;
    breakdown.push({signalName: 'addressClustering', fired: clusterFired, weight: 25, contribution: clusterFired?25:0});
    const sameDeviceUsers=await this.userRepo.findByDeviceFingerprint(user.deviceFingerprint);
    const deviceFired=sameDeviceUsers.length>=2&&user.deviceFingerprint!=='';
    breakdown.push({signalName: 'deviceFingerprint', fired: deviceFired, weight: 30, contribution: deviceFired?30:0});
    const reason=returnRequest.getReason().toLowerCase();
    const reasonFired=(reason.includes('defective')||reason.includes('damaged'))&&order.getIsSealed();
    breakdown.push({signalName: 'reasonMismatch', fired: reasonFired, weight: 15, contribution: reasonFired?15:0});
    const totalWeight=SIGNALS.reduce((sum, s)=>sum+s.weight, 0);
    const rawScore=breakdown.reduce((sum, s)=>sum+s.contribution, 0);
    const normalizedScore=Math.min(100, Math.round((rawScore/totalWeight)*100));
    return {score: normalizedScore, signalBreakdown: breakdown};
  }
}
