import express from 'express';
import { loginValidation, signupValidation } from '../../middlewares/validations';
import { loginController, logoutController, signupController, pusherController } from '../../controlleres/authController';

const router = express.Router();

// api/auth/signup
router.post('/signup', signupValidation, signupController);

router.post('/login', loginValidation, loginController);

router.get('/logout', logoutController);

router.get('/pusher', pusherController);

export default router;
