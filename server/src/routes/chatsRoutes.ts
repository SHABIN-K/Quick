import express from 'express';
import { getChatController, getConversationController, getSingleChatController } from '../controlleres/chatsController';

const router = express.Router();

router.post('/get-chat', getChatController);

router.post('/conversations', getConversationController);

router.post('/get-conversations', getSingleChatController);

export default router;
