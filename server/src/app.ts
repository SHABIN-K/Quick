import cors from 'cors';
import morgan from 'morgan';
import express from 'express';
import cookieParser from 'cookie-parser';

// config env;
import 'dotenv/config';

import { errorHandler, notFoundHandler } from './error/errorHandler';

// routes
import authRoute from './routes/authRoutes';
import usersRoute from './routes/usersRoutes';
import chatsRoute from './routes/chatsRoutes';

// Create an Express application
const app = express();

// Allow requests from the specified origin with credentials
const corsOptions = {
  origin: process.env.CLIENT_URL || 'http://localhost:3000',
  credentials: true,
};

// Use CORS middleware
app.use(cors(corsOptions));
// body parsers
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));

// logger
app.use(
  morgan(function (tokens, req, res) {
    return [
      tokens.method(req, res),
      tokens.url(req, res),
      tokens.status(req, res),
      tokens.res(req, res, 'content-length'),
      '-',
      tokens['response-time'](req, res),
      'ms',
    ].join(' ');
  }),
);

// api
app.use('/api/auth', authRoute);
app.use('/api/chats', chatsRoute);
app.use('/api/users', usersRoute);

// Error handling middleware
app.use(errorHandler);

// 404 route handler
app.use(notFoundHandler);

export default app;
