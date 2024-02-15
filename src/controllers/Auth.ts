import AuthModel from '../models/Auth';
import AuthToken from '../middleware/authentication';
import bcrypt from 'bcrypt';
import response from '../utils/response';
import { Request, Response } from 'express';
import { config } from '../config';
import { IResM } from '../interfaces/Response';

const { token: tokenConfig } = config;

class Auth {
  login = async (req: Request, res: Response): Promise<Response> => {
    try {
      const data = req.body;
      const dataRow: IResM = await AuthModel.login(data);

      if (dataRow.data.rows.length < 1) {
        return response(res, 422, 'Email atau password yang Anda masukkan salah');
      }

      const checkPass = await bcrypt.compare(data.password, dataRow.data.rows[0].password);
      if (!checkPass) {
        return response(res, 422, 'Email atau password yang Anda masukkan salah');
      }

      if (dataRow.data.rows[0]?.status === '02') {
        return response(res, 422, 'Akun anda dinonaktifkan');
      }

      const accessToken = await AuthToken.generateToken(
        { id_client: dataRow.data.rows[0].id, role: dataRow.data.rows[0].role },
        1440,
        tokenConfig.accessSecret
      );

      const refreshToken = await AuthToken.generateToken(
        { id_client: dataRow.data.rows[0].id, role: dataRow.data.rows[0].role },
        2880,
        tokenConfig.refreshSecret
      );

      // await AuthModel.revokeToken({ accessToken, refreshToken, id_client: dataRow.data.rows[0].id }, true);
      return response(res, 201, 'Berhasil login', true, { accessToken, refreshToken });
    } catch (error: any) {
      console.log(error);
      return response(res, 500, 'Terjadi kesalahan saat login');
    }
  };

  async logoutToken(req: any, res: Response): Promise<Response> {
    try {
      const users = req.users;
      if (!users.logouted) {
        const result = await AuthModel.logoutToken({ rToken: users.tokenR }, true);
        if (!result.success) {
          return response(res, 500, 'Terjadi kesalahan saat logout');
        }
      }
      return response(res, 200, 'Berhasil logout', true);
    } catch (error) {
      console.log(error);
      return response(res, 500, 'Terjadi kesalahan saat logout');
    }
  }
}

export default new Auth();
