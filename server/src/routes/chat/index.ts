import express from 'express';

import {
  getcreateChatController,
  getChatController,
  getSingleChatController,
  getGroupChatController,
  getChatByParamsController,
  updateChatController,
  deleteChatController,
} from '../../controlleres/chatsController';
import { createMessagesControllerr, getMessagesController } from '../../controlleres/msgController';

const router = express.Router();

// Get messages by chat ID
router.get('/msg/get-messages/:Id', getMessagesController);

// Create a new message
router.post('/msg/create-msg', createMessagesControllerr);

// Get all chats
router.get('/get-chats', getChatController);

// Get all group chats
router.get('/get-groupchats', getGroupChatController);

// Get a single chat by ID
router.get('/get-chats/:Id', getSingleChatController);

// Mark a chat as seen
router.get('/:Id/seen', getChatByParamsController);

// Create a new chat
router.post('/create-chat', getcreateChatController);

// Add members to a chat
router.patch('/add-members', updateChatController);

// Delete a chat by ID
router.delete('/delete-chat/:Id', deleteChatController);

export default router;
