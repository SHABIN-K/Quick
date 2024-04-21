import { Request, Response, NextFunction } from 'express';
import * as yup from 'yup';

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
    .max(16, 'Too long password'),
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
      //console.log(err.inner);
      const validationErrors: { [key: string]: string[] } = {};
      err.inner.forEach((error: yup.ValidationError) => {
        const fieldName = error.path || '';
        if (!validationErrors[fieldName]) {
          validationErrors[fieldName] = [];
        }
        validationErrors[fieldName].push(error.message);
      });
    
      return res.status(400).json({
        success: false,
        status: err.status,
        message: validationErrors,
      });
    });
};
//intersted

export default signupValidation;
