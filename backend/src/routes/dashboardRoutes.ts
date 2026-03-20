import {Router} from 'express';
import {DashboardController} from '../controllers/DashboardController';
import {authMiddleware} from '../middleware/authMiddleware';
export default function dashboardRoutes(controller: DashboardController): Router {
  const router=Router();
  router.get('/stats', authMiddleware, controller.getStats);
  router.get('/clusters', authMiddleware, controller.getClusters);
  router.get('/signals', authMiddleware, controller.getSignals);
  return router;
}
