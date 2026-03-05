import {IReturn} from '../models/Return';
import {ISignalBreakdown} from '../models/FraudScore';
export interface ScoringResult {
  score: number;
  signalBreakdown: ISignalBreakdown[];
}
export interface ScoringStrategy {
  score(returnRequest: IReturn): Promise<ScoringResult>;
}
