import {AlertObserver} from '../patterns/AlertObserver';
import {IFraudScore} from '../models/FraudScore';
export class AlertService {
  private observers: AlertObserver[]=[];
  addObserver(observer: AlertObserver): void {
    this.observers.push(observer);
  }
  removeObserver(observer: AlertObserver): void {
    this.observers=this.observers.filter(o=>o!==observer);
  }
  notifyAll(fraudScore: IFraudScore): void {
    this.observers.forEach(observer=>observer.notify(fraudScore));
  }
}
