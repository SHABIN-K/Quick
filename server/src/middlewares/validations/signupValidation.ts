import { Request, Response, NextFunction } from 'express';
import * as yup from 'yup';

import ErrorResponse from '../../error/ErrorResponse';

declare module 'express' {
  interface Request {
    validData?: {
      name: string;
      email: string;
      password: string;
    };
  }
}

const signupSchema = yup.object().shape({
  name: yup
    .string()
    .transform((value) => (value !== null ? value.charAt(0).toUpperCase() + value.slice(1) : value))
    .trim()
    .required('Name can not be empty')
    .test('isPerfectString', 'Enter a valid name', (arg) => /^[A-Za-z ]+$/.test(arg)),
  email: yup.string().trim().required('Email can not be empty').email('Enter a valid email'),
  password: yup
    .string()
    .trim()
    .required('Password can not be empty')
    .min(8, 'Too short password')
    .max(16, 'Too long password')
});

const signupValidation = (req: Request, res: Response, next: NextFunction) => {
  const { name, email, password } = req.body;
  signupSchema
    .validate({ name, email, password }, { stripUnknown: true, abortEarly: false })
    .then((data) => {
      req.validData = data;
      next();
    })
    .catch((err) => {
      const [validationErr] = err.errors;
      next(ErrorResponse.badRequest(validationErr));
    });
};

export default signupValidation;
