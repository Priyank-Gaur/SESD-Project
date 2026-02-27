import {Order, IOrder} from '../models/Order';
export class OrderRepository {
  async findById(id: string): Promise<IOrder|null> {
    return Order.findById(id);
  }
  async findAll(): Promise<IOrder[]> {
    return Order.find({});
  }
  async findByUserId(userId: string): Promise<IOrder[]> {
    return Order.find({userId});
  }
  async create(data: Partial<IOrder>): Promise<IOrder> {
    const order=new Order(data);
    return order.save();
  }
  async update(id: string, data: Partial<IOrder>): Promise<IOrder|null> {
    return Order.findByIdAndUpdate(id, data, {new: true});
  }
  async delete(id: string): Promise<void> {
    await Order.findByIdAndDelete(id);
  }
}
