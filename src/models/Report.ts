import { config } from '../config';
import { IResM } from '../interfaces/Response';
import { IReportParam } from '../interfaces/Report';
const { pool: db } = config.database;

// export
export default class Report {
  public static getReport = (param?: IReportParam): Promise<IResM> => {
    return new Promise((resolve, reject) => {
      try {
        const type = param?.type;
        const year = param?.year ? parseInt(param?.year) : null;
        const month = param?.month ? parseInt(param?.month) : null;
        const sqlParams: any[] = [];

        let qs = '';
        if (type === 'year') {
          qs = `SELECT tgb.id, tgb.full_name, tgb.email, tgb.phone, tgb."instance",tgb.visit_purpose, TO_CHAR(tgb.created, 'YYYY-MM-DD HH24:MI:SS') as created_date,TO_CHAR(tgb.updated, 'YYYY-MM-DD HH24:MI:SS') as updated_date, tu.id as id_receptionist, tu.full_name as name_receptionist FROM sc_main.t_guest_book tgb left join sc_main.t_user tu on tu.id = tgb.id_client WHERE EXTRACT(YEAR FROM tgb.created) = ${year}`;
        } else {
          qs = `SELECT tgb.id, tgb.full_name, tgb.email, tgb.phone, tgb."instance",tgb.visit_purpose, TO_CHAR(tgb.created, 'YYYY-MM-DD HH24:MI:SS') as created_date,TO_CHAR(tgb.updated, 'YYYY-MM-DD HH24:MI:SS') as updated_date, tu.id as id_receptionist, tu.full_name as name_receptionist FROM sc_main.t_guest_book tgb left join sc_main.t_user tu on tu.id = tgb.id_client WHERE EXTRACT(MONTH FROM tgb.created) = ${month} and EXTRACT(YEAR FROM tgb.created) = ${year}`;
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
