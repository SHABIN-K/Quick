import express from 'express';
import { getChatController, getConversationController } from '../controlleres/chatsController';

const router = express.Router();

router.post('/get-chat', getChatController);

router.post('/conversations', getConversationController);

export default router;
