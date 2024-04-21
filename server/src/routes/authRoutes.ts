import express from 'express';
import { loginValidation, signupValidation } from '../middlewares/validations';
import { loginController, signupController } from '../controlleres/authController';

const router = express.Router();

router.post('/signup', signupValidation, signupController);

router.post('/login', loginValidation, loginController);

export default router;
