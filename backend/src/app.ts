import express from 'express';
import cors from 'cors';
import http from 'http';
import dotenv from 'dotenv';
import {Server as SocketIOServer} from 'socket.io';
import {connectDB} from './config/db';
import {UserRepository} from './repositories/UserRepository';
import {OrderRepository} from './repositories/OrderRepository';
import {ReturnRepository} from './repositories/ReturnRepository';
import {FraudScoreRepository} from './repositories/FraudScoreRepository';
import {RuleBasedScoringStrategy} from './patterns/RuleBasedScoringStrategy';
import {MLScoringStrategy} from './patterns/MLScoringStrategy';
import {WebSocketAlertObserver, LogAlertObserver} from './patterns/AlertObserver';
import {AuthService} from './services/AuthService';
import {ScoringService} from './services/ScoringService';
import {ReturnService} from './services/ReturnService';
import {AlertService} from './services/AlertService';
import {ClusterService} from './services/ClusterService';
import {AuthController} from './controllers/AuthController';
import {ReturnController} from './controllers/ReturnController';
import {OrderController} from './controllers/OrderController';
import {DashboardController} from './controllers/DashboardController';
import authRoutes from './routes/authRoutes';
import returnRoutes from './routes/returnRoutes';
import orderRoutes from './routes/orderRoutes';
import dashboardRoutes from './routes/dashboardRoutes';
import {initAlertSocket} from './socket/alertSocket';
import {errorHandler} from './middleware/errorHandler';
dotenv.config();
// Safely format the CLIENT_URL to prevent trailing slash CORS mismatches
let clientUrl = process.env.CLIENT_URL || 'http://localhost:3000';
if (clientUrl.endsWith('/')) {
  clientUrl = clientUrl.slice(0, -1);
}

const app=express();
const server=http.createServer(app);
const io=new SocketIOServer(server, {
  cors: {origin: clientUrl, methods: ['GET','POST','PATCH']}
});
app.use(cors({origin: clientUrl}));
app.use(express.json());
const userRepo=new UserRepository();
const orderRepo=new OrderRepository();
const returnRepo=new ReturnRepository();
const fraudScoreRepo=new FraudScoreRepository();
const ruleStrategy=new RuleBasedScoringStrategy(returnRepo, userRepo, orderRepo);
const mlStrategy=new MLScoringStrategy(returnRepo, userRepo, orderRepo, process.env.ML_SERVICE_URL||'http://localhost:8000');
const alertService=new AlertService();
if (!process.env.VERCEL) {
  const wsObserver=new WebSocketAlertObserver(io);
  alertService.addObserver(wsObserver);
  initAlertSocket(io);
}

const logObserver=new LogAlertObserver();
alertService.addObserver(logObserver);

const authService=new AuthService(userRepo);
const scoringService=new ScoringService(ruleStrategy, mlStrategy, fraudScoreRepo, returnRepo, alertService);
const returnService=new ReturnService(returnRepo, orderRepo, scoringService);
const clusterService=new ClusterService(userRepo);
const authController=new AuthController(authService);
const returnController=new ReturnController(returnService, scoringService);
const orderController=new OrderController(orderRepo);
const dashboardController=new DashboardController(returnRepo, fraudScoreRepo, clusterService, scoringService);

app.use('/api/auth', authRoutes(authController));
app.use('/api/returns', returnRoutes(returnController));
app.use('/api/orders', orderRoutes(orderController));
app.use('/api/dashboard', dashboardRoutes(dashboardController));
app.use('/api/scoring', returnRoutes(returnController));

app.use(errorHandler);
if (process.env.VERCEL) {
  connectDB();
} else {
  const PORT=process.env.PORT||3001;
  connectDB().then(()=>{
    server.listen(PORT, ()=>{
      console.log(`Server running on port ${PORT}`);
    });
  });
}

export default app;
