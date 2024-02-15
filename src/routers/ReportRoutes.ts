import BaseRouter from './BaseRouter';
import Controller from '../controllers/Report';
import AuthGuard from '../middleware/authentication';

// export
class ReportRoutes extends BaseRouter {
  public routes(): void {
    // get
    this.router.get('/', AuthGuard.checkAccessToken, Controller.getReport);
  }
}

export default new ReportRoutes().router;
