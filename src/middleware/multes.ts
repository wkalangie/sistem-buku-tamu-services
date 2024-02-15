import multer from 'multer';
import path from 'path';
import response from '../utils/response';
import fs from 'fs-extra';
import { Request, Response, NextFunction } from 'express';

const publicStorage = multer.diskStorage({
  destination: (req: Request, file: any, cb: any) => {
    if (!fs.existsSync('./public')) {
      fs.mkdirSync('./public', { recursive: true });
    }
    if (!fs.existsSync('./public' + (req.body.file_path || ''))) {
      fs.mkdirSync('./public' + (req.body.file_path || ''), { recursive: true });
    }
    cb(null, './public/' + req.body.file_path);
  },
  filename: (req: Request, file: any, cb: any) => {
    cb(null, req.body.file_name);
  },
});

const privateStorage = multer.diskStorage({
  destination: (req: Request, file: any, cb: any) => {
    if (!fs.existsSync('./private')) {
      fs.mkdirSync('./private', { recursive: true });
    }
    if (!fs.existsSync('./private' + (req.body.file_path || ''))) {
      fs.mkdirSync('./private' + (req.body.file_path || ''), { recursive: true });
    }
    cb(null, './private' + (req.body.file_path || ''));
  },
  filename: (req: Request, file: any, cb: any) => {
    // console.log(req.users)
    cb(null, req.body.file_name);
  },
});

const excelUserStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    if (!fs.existsSync('./private')) {
      fs.mkdirSync('./private', { recursive: true });
    }
    cb(null, './private');
  },
  filename: (req, file, cb) => {
    cb(null, `userdata-${Date.now()}${path.extname(file.originalname)}`);
  },
});

const fileFilterPrivate = (req: Request, file: any, cb: any) => {
  const allowedExt = /|txtjpg|png|xlsx|pdf|docx|doc/i;
  const isAllowed = allowedExt.test(path.extname(file.originalname));
  console.log(path.extname(file.originalname));
  if (!isAllowed) return cb(new Error('File not allowed'));
  cb(null, true);
};

const fileFilterPublic = (req: Request, file: any, cb: any) => {
  const allowedExt = /|txtjpg|png|xlsx|pdf|docx|doc/i;
  const isAllowed = allowedExt.test(path.extname(file.originalname));
  console.log(path.extname(file.originalname));
  if (!isAllowed) return cb(new Error('File not allowed'));
  cb(null, true);
};

const fileFilterExcel = (req: Request, file: any, cb: any) => {
  const allowedExt = /|xlsx|xls/i;
  const isAllowed = allowedExt.test(path.extname(file.originalname));
  console.log(path.extname(file.originalname));
  if (!isAllowed) return cb(new Error('File not allowed'));
  cb(null, true);
};

const imageFileFilter = (req: Request, file: any, cb: any) => {
  const allowedExt = /jpg|png|jpeg|svg|gif/i;
  const isAllowed = allowedExt.test(path.extname(file.originalname));
  console.log(path.extname(file.originalname));
  if (!isAllowed) return cb(new Error('Images only'));
  cb(null, true);
};
const bytes = 1000;

const power = (byte: number, n: any): any => {
  if (n) return byte * power(byte, n - 1);
  return 1;
};
export const uploadPublic = multer({
  storage: publicStorage,
  limits: {
    fileSize: 200 * power(bytes, 2),
  },
  fileFilter: fileFilterPublic,
});
export const uploadPrivate = multer({
  storage: privateStorage,
  limits: {
    fileSize: 200 * 10 ** 6,
  },
  fileFilter: fileFilterPrivate,
});

export const uploadUserExcel = multer({
  storage: excelUserStorage,
  limits: {
    fileSize: 5 * power(bytes, 2),
  },
  fileFilter: fileFilterExcel,
});

export const errorMulterHandler = (uploadFunction: any) => {
  return (req: Request, res: Response, next: NextFunction) => {
    uploadFunction(req, res, function (err: any) {
      if (err) return response(res, 500, err);
      next();
    });
  };
};
