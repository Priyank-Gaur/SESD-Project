import {IFraudScore} from '../models/FraudScore';
import {Server} from 'socket.io';
export interface AlertObserver {
  notify(fraudScore: IFraudScore): void;
}
export class WebSocketAlertObserver implements AlertObserver {
  constructor(private io: Server) {}
  notify(fraudScore: IFraudScore): void {
    this.io.emit('fraud_alert', {
      returnId: fraudScore.returnId,
      score: fraudScore.score,
      riskLevel: fraudScore.riskLevel,
      strategy: fraudScore.strategy,
      timestamp: new Date().toISOString()
    });
  }
}
export class LogAlertObserver implements AlertObserver {
  notify(fraudScore: IFraudScore): void {
    console.log(`[ALERT] HIGH risk return detected — Return: ${fraudScore.returnId} | Score: ${fraudScore.score} | Strategy: ${fraudScore.strategy}`);
  }
}
