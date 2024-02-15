import BaseRoutes from './BaseRouter';
import Controller from '../controllers/Auth';
import AuthGuard from '../middleware/authentication';
import AuthValidator from '../middleware/authValidator';
import validator from '../middleware/validator';

class AuthRoutes extends BaseRoutes {
  public routes(): void {
    this.router.post('/login', validator.validate, Controller.login);
    this.router.post('/logout', AuthGuard.checkRefreshToken, Controller.logoutToken);
  }
}

export default new AuthRoutes().router;
