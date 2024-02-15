import { Request, Response } from 'express';
import response from '../utils/response';

class Ping {
  ping(req: Request, res: Response): Response {
    try {
      return response(res, 200, 'Ping', true);
    } catch (error) {
      return response(res, 400);
    }
  }
}

export default new Ping();
