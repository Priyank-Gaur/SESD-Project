import {Request, Response} from 'express';
import {AuthService} from '../services/AuthService';
export class AuthController {
  constructor(private authService: AuthService) {}
  register=async (req: Request, res: Response): Promise<void>=>{
    try {
      const result=await this.authService.register(req.body);
      res.status(201).json(result);
    } catch (error: unknown) {
      const message=error instanceof Error ? error.message : 'Registration failed';
      res.status(400).json({error: message});
    }
  };
  login=async (req: Request, res: Response): Promise<void>=>{
    try {
      const result=await this.authService.login(req.body);
      res.status(200).json(result);
    } catch (error: unknown) {
      const message=error instanceof Error ? error.message : 'Login failed';
      res.status(401).json({error: message});
    }
  };
}
