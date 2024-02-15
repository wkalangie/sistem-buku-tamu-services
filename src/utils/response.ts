import { Response } from 'express';
import { IDataRes, ICountData } from '../interfaces/Response';

export default (
  response: Response,
  status = 200,
  message?: String,
  success = false,
  aditionalData?: Object,
  countData: ICountData = {},
  summary?: Object
) => {
  let dataRes: IDataRes = {
    code: status,
    success,
    message: success ? message || 'success' : message || 'error request...',
  };
  if (countData?.total) {
    dataRes['totalData'] = countData.total;
    if (countData.total && countData.total > 0) {
      dataRes['page'] = countData.page || 1;
      dataRes['totalPage'] = countData.page == '-' ? countData.total : Math.ceil(countData.total / 10);
    }
  }
  if (aditionalData) {
    dataRes['data'] = aditionalData;
  }
  if (summary) {
    dataRes['summary'] = summary;
  }
  return response.status(status).send(dataRes);
};
