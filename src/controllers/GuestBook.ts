import DbControll from './../utils/Crud';
import response from '../utils/response';
import { Response } from 'express';
import GuestBookModel from './../models/GuestBook';
import { IGuestBookParam } from '../interfaces/GuestBook';
import { config } from '../config';

const { tx } = config.database;

class GuestBook {
  // get all
  async getAllGuestBook(req: IGuestBookParam, res: Response): Promise<Response> {
    try {
      const result = await GuestBookModel.getAllGuestBook(req?.query);

      if (result.success) {
        return response(res, 200, 'Berhasil mendapatkan daftar Buku Tamu', true, result.data.rows);
      } else {
        return response(res, 500, 'Terjadi kesalahan');
      }
    } catch (error) {
      console.log(error);
      return response(res, 500, 'Terjadi kesalahan');
    }
  }

  // get table guest book
  async getTableGuestBook(req: IGuestBookParam, res: Response): Promise<Response> {
    try {
      const page = parseInt(req?.query?.page);
      const offset = parseInt(req?.query?.offset);

      const result = await GuestBookModel.getTableGuestBook(req?.query);

      if (result.success) {
        const countData = { total: result.data.rowCount > 0 ? parseInt(result.data.rows[0].totalcount) : 0, page, offset };

        return response(res, 200, 'Berhasil mendapatkan daftar buku tamu', true, result.data.rows, page ? countData : {});
      } else {
        return response(res, 500, 'Terjadi kesalahan');
      }
    } catch (error) {
      console.log(error);
      return response(res, 500, 'Terjadi kesalahan');
    }
  }

  // get guest book
  async getGuestBook(req: IGuestBookParam, res: Response): Promise<Response> {
    try {
      // 1. get data
      const result = await GuestBookModel.getAllGuestBook({ id: req.params.id });

      if (result.success) {
        return response(res, 200, 'Berhasil mendapatkan data buku tamu', true, result.data.rows);
      } else {
        return response(res, 500, 'Terjadi kesalahan');
      }
    } catch (error) {
      console.log(error);
      return response(res, 500, 'Terjadi kesalahan');
    }
  }

  // create guest book
  createGuestBook = async (req: IGuestBookParam, res: Response) => {
    try {
      tx(async (client: any) => {
        // 1. insert data
        const createAccount = await DbControll.createData({ ...req.body, created_by: req.body.id_client }, 'sc_main.t_guest_book', 'id', client);

        // 2. create log activity
        await DbControll.insertLog(req.body.id_client, 'Menambahkan data', req, client);

        if (createAccount.success) {
          return response(res, 201, `Berhasil menambahkan data`, true);
        }
      }, res);
    } catch (error) {
      return response(res, 500, 'Gagal menambahkan data');
    }
  };

  // update guest book
  updateGuestBook = async (req: IGuestBookParam, res: Response) => {
    try {
      tx(async (client: any) => {
        // 1. update data
        const whereUpdate = { id: req.params.id, qs: 'id' };
        await DbControll.updateData(whereUpdate, { ...req.body, updated_by: req.body.id_client }, 'sc_main.t_guest_book', client);

        return response(res, 200, `Data berhasil diperbarui`, true);
      }, res);
    } catch (error: any) {
      return response(res, 500, 'Gagal memperbarui data');
    }
  };

  // delete guest book
  deleteGuestBook = async (req: IGuestBookParam, res: Response) => {
    try {
      tx(async (client: any) => {
        // 1. delete data
        const whereDelete = { id: req.params.id, qs: 'id' };
        await DbControll.deleteData(whereDelete, 'sc_main.t_guest_book', client);

        return response(res, 200, `Data berhasil dihapus`, true);
      }, res);
    } catch (error: any) {
      return response(res, 500, 'Gagal menghapus data');
    }
  };
}

export default new GuestBook();
