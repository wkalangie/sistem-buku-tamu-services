import BaseRouter from './BaseRouter';
import Controller from '../controllers/GuestBook';
import AuthGuard from '../middleware/authentication';
import validator from '../middleware/validator';

// export
class GuestBookRoutes extends BaseRouter {
  public routes(): void {
    // get
    this.router.get('/', AuthGuard.checkAccessTokenStaff, Controller.getAllGuestBook);
    this.router.get('/table', AuthGuard.checkAccessTokenStaff, Controller.getTableGuestBook);
    this.router.get('/:id', AuthGuard.checkAccessTokenStaff, Controller.getGuestBook);

    // post
    this.router.post('/', AuthGuard.checkAccessTokenStaff, validator.validate, Controller.createGuestBook);

    // patch
    this.router.patch('/:id', AuthGuard.checkAccessTokenStaff, validator.validate, Controller.updateGuestBook);

    // delete
    this.router.delete('/:id', AuthGuard.checkAccessTokenStaff, validator.validate, Controller.deleteGuestBook);
  }
}

export default new GuestBookRoutes().router;
