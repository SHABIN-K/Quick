import morgan from 'morgan';
import express from 'express';

import baseRouter from './routes';
import { middleware } from './middlewares';
import { errorHandler, notFoundHandler } from './error';

// Create an Express application
const app = express();

// app middlewares
app.use(middleware);

//logger
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

// api/routes
app.use(baseRouter);

// Error handlers
app.use(errorHandler);
app.use(notFoundHandler); // 404 route handler

export default app;
