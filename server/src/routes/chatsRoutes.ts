import express from 'express';
import { getUsersController, getConversationsController } from '../controlleres/chatsController';

const router = express.Router();

router.post('/users', getUsersController);

router.post('/conversations', getConversationsController);

export default router;
