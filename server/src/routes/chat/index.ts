import express from 'express';
import {
  getcreateChatController,
  getChatController,
  getSingleChatController,
  getGroupChatController,
  getMessagesController,
  geSingletMessagesController,
  getConversationByParamsController,
  deleteConversationByParamsController,
} from '../../controlleres/chatsController';

const router = express.Router();

//api/chats/get-conversations
router.get('/get-chats', getChatController);

//api/chats/get--groupchats
router.get('/get-groupchats', getGroupChatController);

///
router.post('/get-chat', getcreateChatController);

router.post('/conversations/:conversationId', getConversationByParamsController);

router.delete('/conversations/:conversationId', deleteConversationByParamsController);

router.get('/get-conversations/:chatId', getSingleChatController);

router.post('/get-messages', geSingletMessagesController);

router.post('/messages', getMessagesController);

export default router;
