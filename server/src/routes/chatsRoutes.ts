import express from 'express';
import {
  getChatController,
  getConversationController,
  getSingleChatController,
  getMessagesController,
  geSingletMessagesController,
  getConversationByParamsController,
  deleteConversationByParamsController,
} from '../controlleres/chatsController';

const router = express.Router();

router.post('/get-chat', getChatController);

router.post('/conversations/:conversationId', getConversationByParamsController);

router.delete('/conversations/:conversationId', deleteConversationByParamsController);

router.post('/conversations', getConversationController);

router.post('/get-conversations', getSingleChatController);

router.post('/get-messages', geSingletMessagesController);

router.post('/messages', getMessagesController);

export default router;
