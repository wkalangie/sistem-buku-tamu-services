export interface IResM {
  data?: {} | any;
  message?: string;
  success?: boolean;
  error?: Error;
  result?: {} | any;
}
export interface IParamsPagination {
  page?: number;
  offset?: number;
}

export interface IDataRes {
  code: number;
  success: boolean;
  message?: string | String;
  totalData?: number;
  page?: number | string;
  totalPage?: number;
  data?: any;
  summary?: any;
}

export interface ICountData {
  total?: number;
  page?: number | string;
}
