import { Request, Response, NextFunction } from 'express';
import * as yup from 'yup';
import db from '../../config/prismadb';
import { userType } from '../../shared/type';

declare module 'express' {
  interface Request {
    validData?: userType;
  }
}

const signupSchema = yup.object().shape({
  name: yup
    .string()
    .transform((value) => (value !== null ? value.charAt(0).toUpperCase() + value.slice(1) : value))
    .trim()
    .required('Name can not be empty')
    .test('isPerfectString', 'Enter a valid name', (arg) => /^[A-Za-z ]+$/.test(arg)),
  username: yup
    .string()
    .trim()
    .required('Username can not be empty')
    .min(3, 'Username must be at least 3 characters')
    .max(20, 'Username can not exceed 20 characters')
    .matches(/^[a-zA-Z0-9_]*$/, 'Username can only contain letters, numbers, and underscores'),
  email: yup.string().trim().required('Email can not be empty').email('Enter a valid email'),
  password: yup
    .string()
    .trim()
    .required('Password can not be empty')
    .min(8, 'Too short password')
    .max(16, 'Too long password'),
});

const signupValidation = async (req: Request, res: Response, next: NextFunction) => {
  const validationErrors: { [key: string]: string[] } = {};
  const { name, username, email, password } = req.body;

  try {
    // Check if email and username is already registered
    const [existingUser, existingUsername] = await Promise.all([
      db.user.findFirst({ where: { email } }),
      db.user.findFirst({ where: { username } }),
    ]);

    if (existingUser) {
      validationErrors['email'] = ['Email already registered'];
    }

    if (existingUsername) {
      validationErrors['username'] = ['Username already registered'];
    }

    // Validate input fields
    const validatedData = await signupSchema.validate(
      { name, username, email, password },
      { stripUnknown: true, abortEarly: false },
    );
    // Set validated data to the request object
    req.validData = validatedData;
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

export default signupValidation;
