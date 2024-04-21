import * as yup from 'yup';
import ErrorResponse from '../../error/ErrorResponse';

import { Request, Response, NextFunction } from 'express';

declare module 'express' {
  interface Request {
    validDaata?: {
      email: string;
      password: string;
    };
  }
}
const loginSchema = yup.object().shape({
  email: yup.string().trim().required('Email can not be empty').email('Enter a valid email'),
  password: yup
    .string()
    .trim()
    .required('Password can not be empty')
    .min(8, 'Too short password')
    .max(16, 'Too long password'),
});

const loginValidation = (req: Request, res: Response, next: NextFunction) => {
  const { email, password } = req.body;
  loginSchema
    .validate({ email, password }, { stripUnknown: true, abortEarly: false })
    .then((data) => {
      req.validDaata = data;
      next();
    })
    .catch((err) => {
      const [validationErr] = err.errors;
      next(ErrorResponse.badRequest(validationErr));
    });
};

export default loginValidation;
