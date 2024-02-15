import { config } from '../config';
import { IResM } from '../interfaces/Response';
import { ISummaryParam } from '../interfaces/Summary';
const { pool: db } = config.database;

// export
export default class Summary {
  public static getSummaryGlobal = (param?: ISummaryParam): Promise<IResM> => {
    return new Promise((resolve, reject) => {
      try {
        const role = param?.role || '';
        const sqlParams: any[] = [];

        let qs = '';
        if (role === '01') {
          qs = `select count(tu.*) as total_user,
          (select count(tu2.*) from sc_main.t_user tu2 where tu2.role = '01') as total_user_admin,
          (select count(tu3.*) from sc_main.t_user tu3 where tu3.role = '02') as total_user_staff,
          (select count(tgb.*) from sc_main.t_guest_book tgb) as total_guest_book
          from sc_main.t_user tu`;
        } else {
          qs = 'select count(tgb.*) as total_guest_book from sc_main.t_guest_book tgb';
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

  public static getReportPerYear = (params?: ISummaryParam): Promise<IResM> => {
    return new Promise((resolve, reject) => {
      try {
        const date1 = new Date(`${params?.year}-01-01`);
        const date2 = new Date(`${params?.year}-12-31`);
        const qs = `select date_part('month',a.list_month) as month, b.total_report from (SELECT GENERATE_SERIES
          (
              (DATE($1)),
              (DATE($2)),
              interval '1 MONTH'
          )::DATE  as list_month) a left join (
            select count(a.id) as total_report, date_trunc('month',date(a.created)) as created from sc_main.t_guest_book a
               group by date_trunc('month',date(a.created))
            ) b on  date_trunc('month',date(b.created))
            = date_trunc('month',a.list_month)`;

        db.query(qs, [date1, date2], (err: any, result: any) => {
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
