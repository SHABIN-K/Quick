import express from 'express';

import {
  getcreateChatController,
  getChatController,
  getSingleChatController,
  getGroupChatController,
  getMessagesControllerr,
  geSingletMessagesController,
  getConversationByParamsController,
  deleteConversationByParamsController,
} from '../../controlleres/chatsController';
import { getMessagesController } from '../../controlleres/msgController';

const router = express.Router();

//api/chats/get-chats
router.get('/get-chats', getChatController);

//api/chats/get-groupchats
router.get('/get-groupchats', getGroupChatController);

//api/chats/get-chats/:Id
router.get('/get-chats/:Id', getSingleChatController);

//api/chats/msg/get-messages/:Id
router.get('/msg/get-messages/:Id', getMessagesController);

///
router.post('/get-chat', getcreateChatController);

router.post('/conversations/:conversationId', getConversationByParamsController);

router.delete('/conversations/:conversationId', deleteConversationByParamsController);

router.get('/get-conversations/:chatId', getSingleChatController);

router.post('/get-messages', geSingletMessagesController);

router.post('/messages', getMessagesControllerr);

export default router;
