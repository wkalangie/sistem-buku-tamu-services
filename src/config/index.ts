const Pool = require('pg').Pool;
import dotenv from 'dotenv';
import { Response } from 'express';
import response from '../utils/response';
dotenv.config();

const SERVER_PORT = process.env.SERVER_PORT ? Number(process.env.SERVER_PORT) : 1337;
const ACCESS_SECRET = process.env.ACCESS_SECRET ? process.env.ACCESS_SECRET : 'default';
const REFRESH_SECRET = process.env.REFRESH_SECRET ? process.env.REFRESH_SECRET : 'default';
const { REACT_APP, SPACES_ACCESS, SPACES_SECRET, EMAIL_USER, EMAIL_PASSWORD, DB_HOST, DB_PORT, DB_DATABASE, DB_PASSWORD, DB_USER, BE_SIAKAD } =
  process.env;
const pool = new Pool({
  user: DB_USER,
  password: DB_PASSWORD,
  host: DB_HOST,
  port: DB_PORT,
  database: DB_DATABASE,
  ssl: {
    rejectUnauthorized: false,
  },
});

const tx = (callback: any, res: Response) => {
  pool.connect().then(async (client: any) => {
    try {
      await client.query(`set TIMEZONE = 'Asia/Bangkok'`);
      await client.query('BEGIN');
      await callback(client);
      await client.query('COMMIT');
      client.release();
    } catch (err: any) {
      await client.query('ROLLBACK');
      client.release();
      response(res, 500, 'Transaction failed');
    }
  });
};

export const config = {
  server: {
    port: SERVER_PORT,
    access_secret: ACCESS_SECRET,
  },
  database: {
    pool,
    tx,
  },
  token: {
    accessSecret: ACCESS_SECRET,
    refreshSecret: REFRESH_SECRET,
  },
  envConf: {
    reactApp: REACT_APP,
    siakad: BE_SIAKAD,
  },
  storage: {
    access: SPACES_ACCESS || 'access',
    secret: SPACES_SECRET || 'secret',
  },
};
