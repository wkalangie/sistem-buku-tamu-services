import BaseRouter from './BaseRouter';
import Controller from '../controllers/Ping';

class PingRoutes extends BaseRouter {
  public routes(): void {
    this.router.get('/', Controller.ping);
  }
}

export default new PingRoutes().router;
