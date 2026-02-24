import mongoose, {Schema, Document} from 'mongoose';
import bcrypt from 'bcryptjs';
export interface IUser extends Document {
  name: string;
  email: string;
  passwordHash: string;
  role: 'customer'|'merchant';
  address: string;
  deviceFingerprint: string;
  accountCreatedAt: Date;
  comparePassword(plain: string): Promise<boolean>;
  getAccountAge(): number;
}
const UserSchema=new Schema<IUser>({
  name: {type: String, required: true},
  email: {type: String, required: true, unique: true},
  passwordHash: {type: String, required: true},
  role: {type: String, enum: ['customer','merchant'], default: 'customer'},
  address: {type: String, default: ''},
  deviceFingerprint: {type: String, default: ''},
  accountCreatedAt: {type: Date, default: Date.now}
});
UserSchema.pre('save', async function(next) {
  if (!this.isModified('passwordHash')) return next();
  this.passwordHash=await bcrypt.hash(this.passwordHash, 10);
  next();
});
UserSchema.methods.comparePassword=async function(plain: string): Promise<boolean> {
  return bcrypt.compare(plain, this.passwordHash);
};
UserSchema.methods.getAccountAge=function(): number {
  const diff=Date.now()-this.accountCreatedAt.getTime();
  return Math.floor(diff/(1000*60*60*24));
};
export const User=mongoose.model<IUser>('User', UserSchema);
