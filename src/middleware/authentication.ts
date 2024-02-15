import { Response, NextFunction } from 'express';
import { config } from '../config';
import { IResM } from '../interfaces/Response';
import AuthModel from '../models/Auth';
import { verifDate, generateNowPlusTime } from '../utils';
import { decrypt, encrypt } from '../utils/token';
import response from '../utils/response';

class AuthGuard {
  public checkAccessToken = async (req: any, res: Response, next: NextFunction) => {
    try {
      if (!req.headers.authorization) {
        return response(res, 401, 'Unauthorized Access');
      }
      const bearer = req.headers.authorization.split(' ');
      const token = bearer[1];
      const check = await this.verifyToken(token, config.server.access_secret, false, true);
      req.users = check.data;
      next();
    } catch (error: any) {
      response(res, 401, error.message || 'Unauthorized Access');
    }
  };

  public checkAccessTokenAdmin = async (req: any, res: Response, next: NextFunction) => {
    try {
      if (!req.headers.authorization) {
        return response(res, 401, 'Unauthorized Access');
      }
      const bearer = req.headers.authorization.split(' ');
      const token = bearer[1];
      const check = await this.verifyToken(token, config.server.access_secret, false, true);
      req.users = check.data;
      if (!['01'].includes(check.data.role)) {
        return response(res, 401, 'Unauthorized Access');
      }
      next();
    } catch (error: any) {
      response(res, 401, error.message || 'Unauthorized Access');
    }
  };

  public checkAccessTokenStaff = async (req: any, res: Response, next: NextFunction) => {
    try {
      if (!req.headers.authorization) {
        return response(res, 401, 'Unauthorized Access');
      }
      const bearer = req.headers.authorization.split(' ');
      const token = bearer[1];
      const check = await this.verifyToken(token, config.server.access_secret, false, true);
      req.users = check.data;
      if (!['01', '02'].includes(check.data.role)) {
        return response(res, 401, 'Unauthorized Access');
      }
      next();
    } catch (error: any) {
      response(res, 401, error.message || 'Unauthorized Access');
    }
  };

  public checkAccessSocketToken = async (socket: any, next: any) => {
    try {
      const header = socket.handshake.headers['authorization'];

      if (!header) {
        return next(new Error('Unauthorized access'));
      }

      const bearer = header.split(' ');
      const token = bearer[1];

      const check = await this.verifyToken(token, config.server.access_secret, false, true);
      if (check.message === 'Token verified') next();
    } catch (error) {
      console.log(error);
      return next(error);
    }
  };

  public verifyToken = (data: any, secret: string, lgout = false, exp = false): Promise<IResM> => {
    return new Promise(async (resolve, reject) => {
      const cryptData: any = await decrypt(data);
      const token = cryptData.split('|');
      const validateDate = verifDate(token[4]);
      if (!validateDate) {
        if (lgout) {
          reject(new Error('Invalid Token'));
        } else if (exp) {
          reject(new Error('Expired token...'));
        }
      } else if (token[0] !== secret) {
        reject(new Error('Invalid Token'));
      }
      resolve({ message: 'Token verified', data: { id_people: token[1], role: token[2] } });
    });
  };
  public generateToken = async (data: any, expires: number, secret: string) => {
    try {
      const now = Date.now();
      const cryptID = await encrypt(`${secret}|${data.id_people}|${data.role}|${now}|${generateNowPlusTime(now, expires)}`);
      return cryptID;
    } catch (error) {
      return error;
    }
  };
  public checkRefreshToken = async (req: any, res: Response, next: NextFunction) => {
    try {
      if (!req.headers.authorization) {
        return response(res, 401, 'Unauthorized Access');
      }
      const bearer = req.headers.authorization.split(' ');
      const token = bearer[1];
      const check = await this.verifyToken(token, config.token.refreshSecret, true);
      const result = await AuthModel.checkToken({ token, refresh: true });
      if (result.data.rowCount > 0) {
        return response(res, 401, 'Invalid token');
      }
      req.users = { ...check.data, tokenR: token };
      next();
    } catch (error: any) {
      console.log(error);
      response(res, 401, error.message || 'Unauthorized Access');
    }
  };
  public checkRefreshTokenLogout = async (req: any, res: Response, next: NextFunction) => {
    try {
      if (!req.headers.authorization) {
        return response(res, 401, 'Unauthorized Access');
      }
      const bearer = req.headers.authorization.split(' ');
      const token = bearer[1];
      const check = await this.verifyToken(token, config.token.refreshSecret, true, true);
      const result = await AuthModel.checkToken({ token, refresh: true });

      if (result.data.rowCount > 0) {
        req.users = { ...check.data, tokenR: token, logouted: true };
      } else {
        req.users = { ...check.data, tokenR: token };
      }
      next();
    } catch (error: any) {
      console.log(error);
      response(res, 401, error.message || 'Unauthorized Access');
    }
  };
}

export default new AuthGuard();
