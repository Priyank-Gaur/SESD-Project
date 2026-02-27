import {Return, IReturn} from '../models/Return';
export class ReturnRepository {
  async findById(id: string): Promise<IReturn|null> {
    return Return.findById(id).populate('userId').populate('orderId');
  }
  async findAll(): Promise<IReturn[]> {
    return Return.find({}).populate('userId').populate('orderId').sort({requestedAt: -1});
  }
  async findByUserId(userId: string): Promise<IReturn[]> {
    return Return.find({userId});
  }
  async create(data: Partial<IReturn>): Promise<IReturn> {
    const returnDoc=new Return(data);
    return returnDoc.save();
  }
  async update(id: string, data: Partial<IReturn>): Promise<IReturn|null> {
    return Return.findByIdAndUpdate(id, data, {new: true});
  }
  async delete(id: string): Promise<void> {
    await Return.findByIdAndDelete(id);
  }
  async countRecentByUser(userId: string, days: number): Promise<number> {
    const since=new Date(Date.now()-days*24*60*60*1000);
    return Return.countDocuments({userId, requestedAt: {$gte: since}});
  }
  async countByStatus(status: string): Promise<number> {
    return Return.countDocuments({status});
  }
  async countAll(): Promise<number> {
    return Return.countDocuments({});
  }
}
