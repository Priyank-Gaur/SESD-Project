import mongoose, {Schema, Document} from 'mongoose';
export interface ISignalBreakdown {
  signalName: string;
  fired: boolean;
  weight: number;
  contribution: number;
}
export interface IFraudScore extends Document {
  returnId: mongoose.Types.ObjectId;
  score: number;
  riskLevel: 'LOW'|'MEDIUM'|'HIGH';
  signalBreakdown: ISignalBreakdown[];
  strategy: 'rule-based'|'ml';
  createdAt: Date;
}
const SignalBreakdownSchema=new Schema<ISignalBreakdown>({
  signalName: {type: String, required: true},
  fired: {type: Boolean, required: true},
  weight: {type: Number, required: true},
  contribution: {type: Number, required: true}
}, {_id: false});
const FraudScoreSchema=new Schema<IFraudScore>({
  returnId: {type: Schema.Types.ObjectId, ref: 'Return', required: true},
  score: {type: Number, required: true},
  riskLevel: {type: String, enum: ['LOW','MEDIUM','HIGH'], required: true},
  signalBreakdown: [SignalBreakdownSchema],
  strategy: {type: String, enum: ['rule-based','ml'], required: true},
  createdAt: {type: Date, default: Date.now}
});
export const FraudScore=mongoose.model<IFraudScore>('FraudScore', FraudScoreSchema);
