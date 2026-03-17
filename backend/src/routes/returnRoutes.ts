import {Router} from 'express';
import {ReturnController} from '../controllers/ReturnController';
import {authMiddleware} from '../middleware/authMiddleware';
export default function returnRoutes(controller: ReturnController): Router {
  const router=Router();
  router.post('/', authMiddleware, controller.createReturn);
  router.get('/', authMiddleware, controller.getAllReturns);
  router.get('/:id', authMiddleware, controller.getReturnById);
  router.patch('/:id/decision', authMiddleware, controller.updateDecision);
  router.post('/toggle', authMiddleware, controller.toggleStrategy);
  return router;
}
