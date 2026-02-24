import mongoose, {Schema, Document} from 'mongoose';
export interface IReturn extends Document {
  orderId: mongoose.Types.ObjectId;
  userId: mongoose.Types.ObjectId;
  reason: string;
  requestedAt: Date;
  status: 'pending'|'approved'|'rejected';
  decision: 'auto'|'manual';
  getReason(): string;
}
const ReturnSchema=new Schema<IReturn>({
  orderId: {type: Schema.Types.ObjectId, ref: 'Order', required: true},
  userId: {type: Schema.Types.ObjectId, ref: 'User', required: true},
  reason: {type: String, required: true},
  requestedAt: {type: Date, default: Date.now},
  status: {type: String, enum: ['pending','approved','rejected'], default: 'pending'},
  decision: {type: String, enum: ['auto','manual'], default: 'auto'}
});
ReturnSchema.methods.getReason=function(): string { return this.reason; };
export const Return=mongoose.model<IReturn>('Return', ReturnSchema);
