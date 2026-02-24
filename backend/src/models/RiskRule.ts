import mongoose, {Schema, Document} from 'mongoose';
export interface IRiskRule extends Document {
  signalName: string;
  weight: number;
  threshold: number;
  isActive: boolean;
}
const RiskRuleSchema=new Schema<IRiskRule>({
  signalName: {type: String, required: true, unique: true},
  weight: {type: Number, required: true},
  threshold: {type: Number, required: true},
  isActive: {type: Boolean, default: true}
});
export const RiskRule=mongoose.model<IRiskRule>('RiskRule', RiskRuleSchema);
