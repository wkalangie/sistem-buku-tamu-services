const { body, check } = require('express-validator');
import UserModel from './../models/User';

export default class AuthValidator {
  public static registrationValidator = () => {
    return [
      body('role').not().isIn(['01', '02']).withMessage('Anda tidak dapat mendaftar sebagai Admin atau Staf'),
      body('role').isIn(['01', '02', '03']).withMessage('Data tidak valid'),

      // email must be an email
      body('email').isEmail().withMessage('Format email tidak valid'),
      check('email').custom(async (value: String) => {
        return UserModel.getAllUser({ email: value }).then((result) => {
          if (result.data?.rows[0]?.id) {
            return Promise.reject('Email telah digunakan. Mohon gunakan email lain');
          }
        });
      }),

      // password must be at least 5 chars long
      body('password')
        .isLength({ min: 8 })
        .withMessage('Password minimal 8 karakter')
        .matches(/\d/)
        .withMessage('Password harus mengandung angka')
        .matches(/^(?=.*\d)(?=.*[a-zA-Z0-9]).(?=.*[ `!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~])/)
        .withMessage('Password harus mengandung special character'),

      // full_name must be at least 3 chars long
      body('full_name').isLength({ min: 2 }).withMessage('Nama lengkap minimal 2 karakter'),
    ];
  };

  public static loginValidator = () => {
    return [
      // email must be an email
      body('email').isEmail().withMessage('Format email tidak valid'),
      check('email').custom(async (value: String) => {
        return UserModel.getAllUser({ email: value }).then((result) => {
          if (result.data.rowCount === 0) {
            return Promise.reject('Email atau password yang Anda masukkan salah');
          } else {
            if (result.data?.rows[0].status === '00') {
              if (result.data?.rows[0].role === '01') {
                return Promise.reject('Akun anda belum aktif. Silahkan cek email Anda untuk aktivasi');
              } else {
                return Promise.reject('Akun anda belum aktif. Silahkan hubungi staf perpustakaan untuk aktivasi');
              }
            }
          }
        });
      }),

      // password must be at least 5 chars long
      body('password')
        .isLength({ min: 8 })
        .withMessage('Password minimal 8 karakter')
        .matches(/\d/)
        .withMessage('Password harus mengandung angka')
        .matches(/^(?=.*\d)(?=.*[a-zA-Z0-9]).(?=.*[ `!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~])/)
        .withMessage('Password harus mengandung special character'),
    ];
  };

  public static loginSIAKADValidator = () => {
    return [
      check('username').custom(async (value: String, { req }: any) => {
        return UserModel.getAllUser(value.includes('@') ? { email: value } : { id_employee: value }).then((result) => {
          if (result.data.rowCount === 0) {
            req.query.login_siakad = 'Y';
            req.query.create_new = 'Y';
          } else {
            req.query.login_siakad = 'Y';
            req.query.create_new = 'N';
          }
        });
      }),
    ];
  };

  public static forgotPasswordValidator = () => {
    return [
      // email must be an email
      body('email').isEmail().withMessage('Format email tidak valid'),
      check('email').custom(async (value: String) => {
        return UserModel.getAllUser({ email: value }).then((result) => {
          if (result.data?.rowCount === 0) {
            return Promise.reject('Email tidak terdaftar');
          }
          if (result.data?.rows[0]?.role === '04') {
            return Promise.reject('Email ini terdaftar pada aplikasi SIAKAD. Lakukan reset password melalui aplikasi tersebut');
          }
        });
      }),
    ];
  };

  public static resetPasswordValidator = () => {
    return [
      body('otp').exists().withMessage('Otp tidak valid'),

      body('password')
        .isLength({ min: 8 })
        .withMessage('Password minimal 8 karakter')
        .matches(/\d/)
        .withMessage('Password harus mengandung angka')
        .matches(/^(?=.*\d)(?=.*[a-zA-Z0-9]).(?=.*[ `!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~])/)
        .withMessage('Password harus mengandung special character'),
    ];
  };
}
