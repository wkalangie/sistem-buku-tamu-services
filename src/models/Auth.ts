import { config } from '../config';
const { pool: db } = config.database;
import { IResM } from '../interfaces/Response';

export default class Auth {
  public static login = (data: any): Promise<IResM> => {
    return new Promise((resolve, reject) => {
      try {
        let qs = 'select * from sc_main.t_user a where a.email = $1 limit 1';
        db.query(qs, [data.email], (err: any, result: any) => {
          if (err) {
            reject({ success: false, error: err });
          }
          resolve({ success: true, data: result });
        });
      } catch (error) {
        reject(error);
      }
    });
  };

  public static revokeToken = (data: any, login?: any): Promise<IResM> => {
    return new Promise((resolve, reject) => {
      try {
        db.query(
          'INSERT INTO sc_log.auth_logs(id_people,access_token,refresh_token,is_active,flag_statement) VALUES($1,$2,$3,true,$4)',
          [data.id_people, data.accessToken, data.refreshToken, login ? '01' : '00'],
          (err: any, result: any) => {
            if (err) {
              reject({ success: false, error: err });
            }
            resolve({ success: true, result });
          }
        );
      } catch (error) {
        reject(error);
      }
    });
  };

  public static logoutToken = (data: any, logout?: any): Promise<IResM> => {
    return new Promise((resolve, reject) => {
      try {
        db.query(
          `UPDATE sc_log.auth_logs set is_active = false,updated = now()${logout ? ",flag_statement='11'" : ''} where refresh_token = $1`,
          [data.rToken],
          (err: any, result: any) => {
            if (err) {
              reject({ success: false, error: err });
            }
            resolve({ success: true, data: result });
          }
        );
      } catch (error) {
        reject(error);
      }
    });
  };

  public static checkToken = (data: any): Promise<IResM> => {
    return new Promise((resolve, reject) => {
      try {
        const qs = data.refresh
          ? 'select refresh_token from sc_log.auth_logs where refresh_token = $1 and is_active = false'
          : 'select refresh_token from sc_log.auth_logs where access_token = $1 and is_active = false';
        db.query(qs, [data.token], (err: any, result: any) => {
          if (err) {
            reject({ success: false, error: err });
          }
          resolve({ success: true, data: result });
        });
      } catch (error) {
        reject(error);
      }
    });
  };

  public static getStatusLogin = (id_people: string): Promise<IResM> => {
    return new Promise((resolve, reject) => {
      try {
        let qs = `select tul.id_people,max(tul.created) as last_login, tul.is_active as status_login from sc_log.auth_logs tul where tul.id_people=$1 group by tul.id_people,tul.is_active`;
        db.query(qs, [id_people], (error: any, result: any) => {
          if (error) {
            return reject({ success: false, error });
          }
          resolve({ success: true, data: result });
        });
      } catch (error) {
        reject(error);
      }
    });
  };
}
