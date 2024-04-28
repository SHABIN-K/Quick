import express from 'express';
import { getUsersController } from '../controlleres/chatsController';

const router = express.Router();

router.post('/users', getUsersController);

export default router;
