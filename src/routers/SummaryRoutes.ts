import BaseRouter from './BaseRouter';
import Controller from '../controllers/Summary';
import AuthGuard from '../middleware/authentication';

// export
class SummaryRoutes extends BaseRouter {
  public routes(): void {
    // get
    this.router.get('/', AuthGuard.checkAccessToken, Controller.getSummaryGlobal);
    this.router.get('/chart-guest-book', AuthGuard.checkAccessToken, Controller.getReportPerYear);
  }
}

export default new SummaryRoutes().router;
