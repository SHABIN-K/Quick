import express from 'express';

import authRoute from './auth';
import usersRoute from './user';
import chatsRoute from './chat';
import { authenticate } from '../middlewares';

const router = express.Router();

// auth routes
router.use('/api/auth', authRoute);

//chats routes
router.use('/api/chats', authenticate, chatsRoute);

//user routes
router.use('/api/users', usersRoute);

router.use('/api', (req, res) => {
  res.status(200).json({ success: true, message: 'The API is up and running.' });
});

export default router;
