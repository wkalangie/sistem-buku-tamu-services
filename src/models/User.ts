import { config } from '../config';
import { IResM } from '../interfaces/Response';
import { IUserParam } from '../interfaces/User';
const { pool: db } = config.database;

// export
export default class Users {
  // get all
  public static getAllUser = (param?: IUserParam): Promise<IResM> => {
    return new Promise((resolve, reject) => {
      try {
        const sqlParams: any[] = [];

        let qs = `select tu.* from sc_main.t_user tu where tu.id is not null`;

        let indexP = 1;
        if (param?.id) {
          qs += ` and tu.id = $${indexP}`;
          sqlParams.push(param.id);
          indexP++;
        }

        if (param?.full_name) {
          qs += ` and tu.full_name ilike '%' || $${indexP} || '%' `;
          sqlParams.push(param.full_name);
          indexP++;
        }

        if (param?.email) {
          qs += ` and tu.email = $${indexP}`;
          sqlParams.push(param.email);
          indexP++;
        }
        if (param?.role) {
          qs += ` and tu.role = $${indexP}`;
          sqlParams.push(param.role);
          indexP++;
        }

        if (param?.status) {
          qs += ` and tu.status = $${indexP}`;
          sqlParams.push(param.status);
          indexP++;
        }

        db.query(qs, sqlParams, (err: any, result: any) => {
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

  // get table user
  public static getTableUser = (param?: IUserParam): Promise<IResM> => {
    return new Promise((resolve, reject) => {
      try {
        let page = param?.page || 1;
        const offset = param?.offset || 10;
        page = (Number(page) - 1) * Number(offset);
        const sqlParams: String[] = [];

        let qs = 'select tu.* from sc_main.t_user tu where tu.id is not null';

        let indexP = 1;
        if (param?.id) {
          qs += ` and tu.id = $${indexP}`;
          sqlParams.push(param.id);
          indexP++;
        }

        if (param?.full_name) {
          qs += ` and tu.full_name ilike '%' || $${indexP} || '%' `;
          sqlParams.push(param.full_name);
          indexP++;
        }

        if (param?.email) {
          qs += ` and tu.email = $${indexP}`;
          sqlParams.push(param.email);
          indexP++;
        }
        if (param?.role) {
          qs += ` and tu.role = $${indexP}`;
          sqlParams.push(param.role);
          indexP++;
        }

        if (param?.status) {
          qs += ` and tu.status = $${indexP}`;
          sqlParams.push(param.status);
          indexP++;
        }

        qs += ' order by tu.created desc ';
        if (param?.page) {
          qs += ` OFFSET ${page} ROWS  FETCH FIRST ${offset} ROW ONLY`;
        }

        db.query(qs, sqlParams, (err: any, result: any) => {
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
}
