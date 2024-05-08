import express from 'express';
import { loginValidation, signupValidation } from '../../middlewares/validations';
import {
  loginController,
  logoutController,
  signupController,
  refreshController,
  pusherController,
} from '../../controlleres/authController';

const router = express.Router();

// api/auth/signup
router.post('/signup', signupValidation, signupController);

// api/auth/login
router.post('/login', loginValidation, loginController);

// api/auth/logout
router.get('/logout', logoutController);

// api/auth/refresh-token
router.get('/refresh-token', refreshController);

// api/auth/pusher
router.get('/pusher', pusherController);

export default router;
