import express from 'express';
import { getUsersController } from '../controlleres/userController';

const router = express.Router();

router.post('/get-users', getUsersController);

export default router;
