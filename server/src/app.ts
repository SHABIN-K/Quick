import morgan from 'morgan';
import express from 'express';
import { middleware } from './middlewares';
import { errorHandler, notFoundHandler } from './error';

// routes
import authRoute from './routes/authRoutes';
import usersRoute from './routes/usersRoutes';
import chatsRoute from './routes/chatsRoutes';
import logger from './helpers/logger';

// Create an Express application
const app = express();

// app middlewares
app.use(middleware);

app.use(morgan('combined', { stream: { write: (message) => logger.info(message) } }));

// api
app.use('/api/auth', authRoute);
app.use('/api/chats', chatsRoute);
app.use('/api/users', usersRoute);

// Error handlers
app.use(errorHandler);
app.use(notFoundHandler); // 404 route handler

export default app;
