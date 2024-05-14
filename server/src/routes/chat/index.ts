import express from 'express';
import {
  getChatController,
  getConversationController,
  getSingleChatController,
  getMessagesController,
  geSingletMessagesController,
  getConversationByParamsController,
  deleteConversationByParamsController,
} from '../../controlleres/chatsController';

const router = express.Router();

//api/chats/get-conversations
router.get('/get-chats', getConversationController);




router.post('/get-chat', getChatController);

router.post('/conversations/:conversationId', getConversationByParamsController);

router.delete('/conversations/:conversationId', deleteConversationByParamsController);

router.get('/get-conversations/:chatId', getSingleChatController);

router.post('/get-messages', geSingletMessagesController);

router.post('/messages', getMessagesController);

export default router;
