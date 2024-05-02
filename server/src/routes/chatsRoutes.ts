import express from 'express';
import {
  getChatController,
  getConversationController,
  getSingleChatController,
  getMessagesController,
  geSingletMessagesController,
} from '../controlleres/chatsController';

const router = express.Router();

router.post('/get-chat', getChatController);

router.post('/conversations', getConversationController);

router.post('/get-conversations', getSingleChatController);

router.post('/get-messages', geSingletMessagesController);

router.post('/messages', getMessagesController);

export default router;
