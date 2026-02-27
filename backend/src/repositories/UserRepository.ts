import {User, IUser} from '../models/User';
export class UserRepository {
  async findById(id: string): Promise<IUser|null> {
    return User.findById(id);
  }
  async findByEmail(email: string): Promise<IUser|null> {
    return User.findOne({email});
  }
  async findAll(): Promise<IUser[]> {
    return User.find({});
  }
  async create(data: Partial<IUser>): Promise<IUser> {
    const user=new User(data);
    return user.save();
  }
  async update(id: string, data: Partial<IUser>): Promise<IUser|null> {
    return User.findByIdAndUpdate(id, data, {new: true});
  }
  async delete(id: string): Promise<void> {
    await User.findByIdAndDelete(id);
  }
  async findByAddress(address: string): Promise<IUser[]> {
    if (!address||address==='') return [];
    return User.find({address});
  }
  async findByDeviceFingerprint(fingerprint: string): Promise<IUser[]> {
    if (!fingerprint||fingerprint==='') return [];
    return User.find({deviceFingerprint: fingerprint});
  }
  async getDistinctAddresses(): Promise<string[]> {
    return User.distinct('address', {address: {$ne: ''}});
  }
  async getDistinctFingerprints(): Promise<string[]> {
    return User.distinct('deviceFingerprint', {deviceFingerprint: {$ne: ''}});
  }
}
