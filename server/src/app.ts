import cors from 'cors';
import morgan from 'morgan';
import express from 'express';
import cookieParser from 'cookie-parser';

// config env;
import 'dotenv/config';

import errorHandler from './error/errorHandler';

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

app.get('/', (req, res) => {
  console.log('hello world');
  res.send('helo world');
});

// 404 routes
app.use((req, res) => {
  res.status(404).json({ success: false, status: 404, message: 'Not found' });
});

// error handler
app.use(errorHandler);

export default app;
