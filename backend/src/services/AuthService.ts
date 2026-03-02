import jwt from 'jsonwebtoken';
import {UserRepository} from '../repositories/UserRepository';
import {IUser} from '../models/User';
export class AuthService {
  constructor(private userRepo: UserRepository) {}
  async register(data: {name: string; email: string; password: string; role?: string; address?: string; deviceFingerprint?: string}): Promise<{user: IUser; token: string}> {
    const existing=await this.userRepo.findByEmail(data.email);
    if (existing) throw new Error('Email already registered');
    const user=await this.userRepo.create({
      name: data.name,
      email: data.email,
      passwordHash: data.password,
      role: (data.role as 'customer'|'merchant')||'customer',
      address: data.address||'',
      deviceFingerprint: data.deviceFingerprint||''
    });
    const token=this.generateToken(user);
    return {user, token};
  }
  async login(data: {email: string; password: string}): Promise<{user: IUser; token: string}> {
    const user=await this.userRepo.findByEmail(data.email);
    if (!user) throw new Error('Invalid credentials');
    const isMatch=await user.comparePassword(data.password);
    if (!isMatch) throw new Error('Invalid credentials');
    const token=this.generateToken(user);
    return {user, token};
  }
  private generateToken(user: IUser): string {
    return jwt.sign(
      {id: user._id, email: user.email, role: user.role},
      process.env.JWT_SECRET||'default_secret',
      {expiresIn: '24h'}
    );
  }
}
