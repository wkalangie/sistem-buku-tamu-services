import DbControll from './../utils/Crud';
import response from '../utils/response';
import { Response } from 'express';
import UserModel from './../models/User';
import { IUserParam } from '../interfaces/User';
import { config } from '../config';
import bcrypt from 'bcrypt';

const { tx } = config.database;

// export
class User {
  // get all
  async getAllUser(req: IUserParam, res: Response): Promise<Response> {
    try {
      const result = await UserModel.getAllUser(req?.query);

      if (result.success) {
        result.data.rows.map((i: any) => {
          delete i.totalcount;
          delete i.password;
        });
        return response(res, 200, 'Berhasil mendapatkan daftar user', true, result.data.rows);
      } else {
        return response(res, 500, 'Terjadi kesalahan');
      }
    } catch (error) {
      console.log(error);
      return response(res, 500, 'Terjadi kesalahan');
    }
  }

  // get table user
  async getTableUser(req: IUserParam, res: Response): Promise<Response> {
    try {
      const page = parseInt(req?.query?.page);
      const offset = parseInt(req?.query?.offset);

      const result = await UserModel.getTableUser(req?.query);

      if (result.success) {
        const countData = { total: result.data.rowCount > 0 ? parseInt(result.data.rows[0].totalcount) : 0, page, offset };
        result.data.rows.map((i: any) => {
          delete i.totalcount;
          delete i.password;
        });
        return response(res, 200, 'Berhasil mendapatkan daftar user', true, result.data.rows, page ? countData : {});
      } else {
        return response(res, 500, 'Terjadi kesalahan');
      }
    } catch (error) {
      console.log(error);
      return response(res, 500, 'Terjadi kesalahan');
    }
  }

  // get user
  async getUser(req: IUserParam, res: Response): Promise<Response> {
    try {
      // 1. get data
      const result = await UserModel.getAllUser({ id: req.params.id });

      if (result.success) {
        return response(res, 200, 'Berhasil mendapatkan data user', true, result.data.rows);
      } else {
        return response(res, 500, 'Terjadi kesalahan');
      }
    } catch (error) {
      console.log(error);
      return response(res, 500, 'Terjadi kesalahan');
    }
  }

  // create user
  createUser = async (req: IUserParam, res: Response) => {
    try {
      tx(async (client: any) => {
        const salt = await bcrypt.genSalt(13);
        const newPassword = await bcrypt.hash(req.body.password, salt);

        const dataUser = await UserModel.getAllUser(req?.query);
        const users = dataUser?.data?.rows;
        let userExist = false;

        for (let i = 0; i < users?.length; i++) {
          if (users[i]?.email === req.body.email) {
            userExist = true;
          }
        }
        if (!userExist) {
          // 1. insert data
          const createAccount = await DbControll.createData({ ...req.body, password: newPassword }, 'sc_main.t_user', 'id', client);

          // 2. create log activity
          await DbControll.insertLog(req.body.id_client, 'Menambahkan user baru', req, client);

          if (createAccount.success) {
            return response(res, 201, `berhasil menambahkan pengguna baru`, true);
          }
        } else {
          return response(res, 400, `email pengguna sudah terdaftar`, false);
        }
      }, res);
    } catch (error) {
      return response(res, 500, 'Gagal menambahkan pengguna baru');
    }
  };

  // update user
  updateUser = async (req: IUserParam, res: Response) => {
    try {
      tx(async (client: any) => {
        // prevent column updates it shouldn't do by themselves
        delete req.body.password;

        // 1. get old data
        const currentData = await UserModel.getAllUser({ id: req.params.id });

        // 2. create log activity
        const log = await DbControll.insertLog(
          req.body.id_client,
          `Mengubah data pengguna ${currentData.data.rows[0].full_name} (${req.params.id})`,
          req,
          client
        );

        // 3. move old data to sc_log
        await DbControll.createData({ ...currentData.data.rows[0], id_user_activity: log.data.rows[0].id }, 'sc_log.user_logs', 'id', client);

        // 4. update data
        const whereUpdate = { id: req.params.id, qs: 'id' };
        await DbControll.updateData(whereUpdate, { ...req.body, updated_by: req.body.id_client }, 'sc_main.t_user', client);

        return response(res, 200, `Data pengguna berhasil diperbarui`, true);
      }, res);
    } catch (error: any) {
      return response(res, 500, 'Gagal memperbarui data pengguna');
    }
  };

  // change password
  changePassword = async (req: IUserParam, res: Response) => {
    try {
      tx(async (client: any) => {
        // prevent column updates it shouldn't do by themselves
        const salt = await bcrypt.genSalt(13);
        const newPassword = await bcrypt.hash(req.body.password, salt);

        // 1. get old data
        const currentData = await UserModel.getAllUser({ id: req.params.id });

        // 2. create log activity
        const log = await DbControll.insertLog(
          req.body.id_client,
          `Mereset password pengguna ${currentData.data.rows[0].full_name} (${req.params.id})`,
          req,
          client
        );

        // 3. move old data to sc_log
        await DbControll.createData({ ...currentData.data.rows[0], id_user_activity: log.data.rows[0].id }, 'sc_log.user_logs', 'id', client);

        // 4. update data
        const whereUpdate = { id: req.params.id, qs: 'id' };
        await DbControll.updateData(whereUpdate, { password: newPassword, updated_by: req.body.id_client }, 'sc_main.t_user', client);

        return response(res, 200, `Password pengguna berhasil diperbarui`, true);
      }, res);
    } catch (error: any) {
      return response(res, 500, 'Gagal memperbarui password pengguna');
    }
  };

  // delete user
  deleteUser = async (req: IUserParam, res: Response) => {
    try {
      tx(async (client: any) => {
        // 1. get old data
        const currentData = await UserModel.getAllUser({ id: req.params.id });

        // 2. create log activity
        const log = await DbControll.insertLog(
          req.body.id_client,
          `Menghapus data pengguna ${currentData.data.rows[0].full_name} (${currentData.data.rows[0].id})`,
          req,
          client
        );

        // 3. move old data to sc_log
        await DbControll.createData(
          { ...currentData.data.rows[0], id_client: req.body.id_client, deleted_by: req.body.id_client, id_user_activity: log.data.rows[0].id },
          'sc_log.user_logs',
          'id',
          client
        );

        // 4. delete data
        const whereDelete = { id: req.params.id, qs: 'id' };
        await DbControll.deleteData(whereDelete, 'sc_main.t_user', client);

        return response(res, 200, `Pengguna berhasil dihapus`, true);
      }, res);
    } catch (error: any) {
      return response(res, 500, 'Gagal menghapus pengguna');
    }
  };
}

export default new User();
