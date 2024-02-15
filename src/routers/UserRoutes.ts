import BaseRouter from './BaseRouter';
import Controller from '../controllers/User';
import AuthGuard from '../middleware/authentication';
import validator from '../middleware/validator';

// export
class UserRoutes extends BaseRouter {
  public routes(): void {
    // get
    this.router.get('/', AuthGuard.checkAccessTokenStaff, Controller.getAllUser);
    this.router.get('/all', AuthGuard.checkAccessTokenStaff, Controller.getAllUser);
    this.router.get('/table', AuthGuard.checkAccessTokenAdmin, Controller.getTableUser);
    this.router.get('/:id', AuthGuard.checkAccessTokenAdmin, Controller.getUser);

    // post
    this.router.post('/', AuthGuard.checkAccessTokenAdmin, validator.validate, Controller.createUser);

    // patch
    this.router.patch('/:id', AuthGuard.checkAccessTokenAdmin, validator.validate, Controller.updateUser);
    this.router.patch('/changePassword/:id', AuthGuard.checkAccessTokenAdmin, validator.validate, Controller.changePassword);

    // delete
    this.router.delete('/:id', AuthGuard.checkAccessTokenAdmin, validator.validate, Controller.deleteUser);
  }
}

export default new UserRoutes().router;
