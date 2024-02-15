import { config } from '../config';
import { IResM } from '../interfaces/Response';
import { IGuestBookParam } from '../interfaces/GuestBook';
const { pool: db } = config.database;

// export
export default class GuestBook {
  // get all
  public static getAllGuestBook = (param?: IGuestBookParam): Promise<IResM> => {
    return new Promise((resolve, reject) => {
      try {
        const sqlParams: any[] = [];

        let qs = `select tgb.*, tu.id as employee_id, tu.full_name as employee_name
        from sc_main.t_guest_book tgb 
        left join sc_main.t_user tu on tu.id = tgb.id_client
        where tgb.id is not null`;

        let indexP = 1;
        if (param?.id) {
          qs += ` and tgb.id = $${indexP}`;
          sqlParams.push(param.id);
          indexP++;
        }

        if (param?.full_name) {
          qs += ` and tgb.full_name ilike '%' || $${indexP} || '%' `;
          sqlParams.push(param.full_name);
          indexP++;
        }

        if (param?.email) {
          qs += ` and tgb.email = $${indexP}`;
          sqlParams.push(param.email);
          indexP++;
        }

        if (param?.phone) {
          qs += ` and tgb.phone = $${indexP}`;
          sqlParams.push(param.phone);
          indexP++;
        }

        if (param?.instance) {
          qs += ` and tgb.instance = $${indexP}`;
          sqlParams.push(param.instance);
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

  // get table GuestBook
  public static getTableGuestBook = (param?: IGuestBookParam): Promise<IResM> => {
    return new Promise((resolve, reject) => {
      try {
        let page = param?.page || 1;
        const offset = param?.offset || 10;
        page = (Number(page) - 1) * Number(offset);
        const sqlParams: String[] = [];

        let qs = `select tgb.*, tu.id as employee_id, tu.full_name as employee_name
        from sc_main.t_guest_book tgb 
        left join sc_main.t_user tu on tu.id = tgb.id_client
        where tgb.id is not null`;

        let indexP = 1;
        if (param?.id) {
          qs += ` and tgb.id = $${indexP}`;
          sqlParams.push(param.id);
          indexP++;
        }

        if (param?.full_name) {
          qs += ` and tgb.full_name ilike '%' || $${indexP} || '%' `;
          sqlParams.push(param.full_name);
          indexP++;
        }

        if (param?.email) {
          qs += ` and tgb.email = $${indexP}`;
          sqlParams.push(param.email);
          indexP++;
        }

        if (param?.phone) {
          qs += ` and tgb.phone = $${indexP}`;
          sqlParams.push(param.phone);
          indexP++;
        }

        if (param?.instance) {
          qs += ` and tgb.instance = $${indexP}`;
          sqlParams.push(param.instance);
          indexP++;
        }

        qs += ' order by tgb.created desc ';
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
