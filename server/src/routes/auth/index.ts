import express from 'express';
import {
  loginController,
  logoutController,
  signupController,
  refreshController,
  pusherController,
  forgotPasswordController,
  resetPasswordController,
} from '../../controlleres/authController';
import { loginValidation, signupValidation, resetPassValidation } from '../../middlewares/validations';

const router = express.Router();

// api/auth/signup
router.post('/signup', signupValidation, signupController);

// api/auth/login
router.post('/login', loginValidation, loginController);

// api/auth/logout
router.get('/logout', logoutController);

// api/auth/refresh-token
router.get('/refresh-token', refreshController);

// api/auth/forget-password
router.post('/forgot-password', forgotPasswordController);

// api/auth/forget-password
router.post('/reset-password', resetPassValidation, resetPasswordController);

// api/auth/pusher
router.post('/pusher', pusherController);

export default router;
