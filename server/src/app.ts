import cors from 'cors';
import morgan from 'morgan';
import express from 'express';
import cookieParser from 'cookie-parser';

// config env;
import 'dotenv/config';

import { errorHandler, notFoundHandler } from './error/errorHandler';

// routes
import userRoute from './routes/userRoutes';

// Create an Express application
const app = express();

// Use CORS middleware
app.use(cors());
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
app.use('/api', userRoute);

// Error handling middleware
app.use(errorHandler);

// 404 route handler
app.use(notFoundHandler);

export default app;
