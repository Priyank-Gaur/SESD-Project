import {Request, Response} from 'express';
import {OrderRepository} from '../repositories/OrderRepository';
export class OrderController {
  constructor(private orderRepo: OrderRepository) {}
  createOrder=async (req: Request, res: Response): Promise<void>=>{
    try {
      const order=await this.orderRepo.create(req.body);
      res.status(201).json(order);
    } catch (error: unknown) {
      res.status(400).json({error: 'Failed to create order'});
    }
  };
  getOrdersByUser=async (req: Request, res: Response): Promise<void>=>{
    try {
      const orders=await this.orderRepo.findByUserId(req.params.userId);
      res.status(200).json(orders);
    } catch {
      res.status(500).json({error: 'Failed to fetch orders'});
    }
  };
}
