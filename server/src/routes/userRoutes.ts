import express from 'express';
import { getUser } from '../controlleres/userController';

const router = express.Router();

router.get('/profile', getUser);

export default router;
