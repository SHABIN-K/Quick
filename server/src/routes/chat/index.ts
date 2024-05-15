import express from 'express';

import {
  getcreateChatController,
  getChatController,
  getSingleChatController,
  getGroupChatController,
  getMessagesControllerr,
  geSingletMessagesController,
  getChatByParamsController,
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

//api/chats/:Id/seen
router.get('/:Id/seen', getChatByParamsController);

///
router.post('/get-chat', getcreateChatController);

router.delete('/conversations/:conversationId', deleteConversationByParamsController);

router.get('/get-conversations/:chatId', getSingleChatController);

router.post('/get-messages', geSingletMessagesController);

router.post('/messages', getMessagesControllerr);

export default router;
