const { validationResult } = require('express-validator');

export default class validator {
  // Middleware
  public static validate = (req: any, res: any, next: any) => {
    const errors = validationResult(req);
    if (errors.isEmpty()) {
      return next();
    }
    const extractedErrors: any[] = [];
    let id;
    // errors.array().map((err) => extractedErrors.push({ [err.param]: err.msg }));
    errors.array().map((err: any) => {
      typeof err.msg === 'object' ? extractedErrors.push(err.msg.msg) : extractedErrors.push('&bull; ' + err.msg);
      id = typeof err.msg === 'object' && err.msg.id;
    });

    return res.status(req.status_error || 422).json({
      code: req.status_error || 422,
      success: false,
      message: extractedErrors.join('<br>'),
    });
  };
}
