import {ScoringStrategy} from '../patterns/ScoringStrategy';
import {RuleBasedScoringStrategy} from '../patterns/RuleBasedScoringStrategy';
import {MLScoringStrategy} from '../patterns/MLScoringStrategy';
import {FraudScoreRepository} from '../repositories/FraudScoreRepository';
import {ReturnRepository} from '../repositories/ReturnRepository';
import {AlertService} from './AlertService';
import {IReturn} from '../models/Return';
import {IFraudScore} from '../models/FraudScore';
export class ScoringService {
  private activeStrategy: ScoringStrategy;
  private activeStrategyName: 'rule-based'|'ml'='rule-based';
  constructor(
    private ruleStrategy: RuleBasedScoringStrategy,
    private mlStrategy: MLScoringStrategy,
    private fraudScoreRepo: FraudScoreRepository,
    private returnRepo: ReturnRepository,
    private alertService: AlertService
  ) {
    this.activeStrategy=ruleStrategy;
  }
  async scoreReturn(returnRequest: IReturn): Promise<IFraudScore> {
    const result=await this.activeStrategy.score(returnRequest);
    const riskLevel=result.score<=35?'LOW':result.score<=65?'MEDIUM':'HIGH';
    const fraudScore=await this.fraudScoreRepo.create({
      returnId: returnRequest._id,
      score: result.score,
      riskLevel,
      signalBreakdown: result.signalBreakdown,
      strategy: this.activeStrategyName
    });
    if (riskLevel==='LOW') {
      await this.returnRepo.update(returnRequest._id.toString(), {status: 'approved', decision: 'auto'});
    } else if (riskLevel==='HIGH') {
      await this.returnRepo.update(returnRequest._id.toString(), {status: 'rejected', decision: 'auto'});
      this.alertService.notifyAll(fraudScore);
    }
    return fraudScore;
  }
  setStrategy(name: 'rule-based'|'ml'): void {
    this.activeStrategyName=name;
    this.activeStrategy=name==='ml'?this.mlStrategy:this.ruleStrategy;
    console.log(`Scoring strategy switched to: ${this.activeStrategyName}`);
  }
  getActiveStrategy(): string {
    return this.activeStrategyName;
  }
}
