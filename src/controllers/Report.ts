import response from '../utils/response';
import { Response } from 'express';
import ReportModel from '../models/Report';
import { IReportParam } from '../interfaces/Report';

// export
class Report {
  async getReport(req: IReportParam, res: Response): Promise<Response> {
    try {
      const type = req?.query?.type;
      const year = req?.query?.year;
      const month = req?.query?.month;

      const result = await ReportModel.getReport({ type: type, year: year, month: month });

      if (result.success) {
        return response(res, 200, 'Berhasil mendapatkan Report', true, result?.data?.rows);
      } else {
        return response(res, 500, 'Terjadi kesalahan');
      }
    } catch (error) {
      console.log(error);
      return response(res, 500, 'Terjadi kesalahan');
    }
  }
}

export default new Report();
