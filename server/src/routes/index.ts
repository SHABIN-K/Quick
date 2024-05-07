import express from 'express';

import authRoute from './auth';
import usersRoute from './user';
import chatsRoute from './chat';

const router = express.Router();

// auth routes
router.use('/api/auth', authRoute);

//chats routes
router.use('/api/chats', chatsRoute);

//user routes
router.use('/api/users', usersRoute);

export default router;
