import mongoose, {Schema, Document} from 'mongoose';
export interface IOrder extends Document {
  userId: mongoose.Types.ObjectId;
  itemName: string;
  itemPrice: number;
  purchaseDate: Date;
  deliveryDate: Date;
  isSealed: boolean;
  getItemPrice(): number;
  getDaysSinceDelivery(): number;
  getIsSealed(): boolean;
}
const OrderSchema=new Schema<IOrder>({
  userId: {type: Schema.Types.ObjectId, ref: 'User', required: true},
  itemName: {type: String, required: true},
  itemPrice: {type: Number, required: true},
  purchaseDate: {type: Date, required: true},
  deliveryDate: {type: Date, required: true},
  isSealed: {type: Boolean, default: false}
});
OrderSchema.methods.getItemPrice=function(): number { return this.itemPrice; };
OrderSchema.methods.getDaysSinceDelivery=function(): number {
  const diff=Date.now()-this.deliveryDate.getTime();
  return Math.floor(diff/(1000*60*60*24));
};
OrderSchema.methods.getIsSealed=function(): boolean { return this.isSealed; };
export const Order=mongoose.model<IOrder>('Order', OrderSchema);
