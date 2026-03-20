import {Router} from 'express';
import {OrderController} from '../controllers/OrderController';
import {authMiddleware} from '../middleware/authMiddleware';
export default function orderRoutes(controller: OrderController): Router {
  const router=Router();
  router.post('/', authMiddleware, controller.createOrder);
  router.get('/:userId', authMiddleware, controller.getOrdersByUser);
  return router;
}
