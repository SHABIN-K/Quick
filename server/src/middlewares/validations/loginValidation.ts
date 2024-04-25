import * as yup from 'yup';
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

const loginValidation = async (req: Request, res: Response, next: NextFunction) => {
  const validationErrors: { [key: string]: string[] } = {};
  const { email, password } = req.body;
  try {
    const validatedData = await loginSchema.validate({ email, password }, { stripUnknown: true, abortEarly: false });
    // Set validated data to the request object
    req.validDaata = validatedData;
    next();
  } catch (err) {
    if (err instanceof yup.ValidationError) {
      err.inner.forEach((error: yup.ValidationError) => {
        const fieldName = error.path || '';
        if (!validationErrors[fieldName]) {
          validationErrors[fieldName] = [];
        }
        validationErrors[fieldName].push(error.message);
      });
    }

    return res.status(400).json({
      success: false,
      message: validationErrors,
    });
  }
};

export default loginValidation;
