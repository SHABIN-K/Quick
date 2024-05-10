import * as yup from 'yup';
import { Request, Response, NextFunction } from 'express';

declare module 'express' {
  interface Request {
    resetPass?: {
      password: string;
      token: string;
    };
  }
}

const resetPassSchema = yup.object().shape({
  password: yup
    .string()
    .trim()
    .required('Password can not be empty')
    .min(8, 'Too short password')
    .max(16, 'Too long password'),
  token: yup
    .string()
    .trim()
    .required('We encountered an issue with the password reset link. Please request a new one.'),
});

/**
 * Validates the reset password request.
 *
 * @param token - The token object.
 * @param password - The password object.
 */
const resetPassValidation = async (req: Request, res: Response, next: NextFunction) => {
  const validationErrors: { [key: string]: string[] } = {};
  const { token, password } = req.body;
  try {
    const validatedData = await resetPassSchema.validate(
      { password, token },
      { stripUnknown: true, abortEarly: false },
    );

    // Set validated data to the request object
    req.resetPass = validatedData;
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

export default resetPassValidation;
