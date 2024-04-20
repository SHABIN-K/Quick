import express from 'express';
import { signupValidation } from '../middlewares/validations';
import { signupController } from '../controlleres/authController';

const router = express.Router();

router.post('/signup', signupValidation, signupController);
router.get('/test', (req, res) => {
  res.send('helo world');
});

export default router;
