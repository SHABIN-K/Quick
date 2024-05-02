import express from 'express';
import {
  getChatController,
  getConversationController,
  getSingleChatController,
  getMessagesController,
} from '../controlleres/chatsController';

const router = express.Router();

router.post('/get-chat', getChatController);

router.post('/conversations', getConversationController);

router.post('/get-conversations', getSingleChatController);

router.post('/get-messages', getMessagesController);

export default router;
