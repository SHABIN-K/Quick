import morgan from 'morgan';
import express from 'express';

import baseRouter from './routes';
import logger from './utils/logger';
import { middleware } from './middlewares';
import { errorHandler, notFoundHandler } from './error';

// Create an Express application
const app = express();

// app middlewares
app.use(middleware);

//logger

app.use(morgan('combined', { stream: { write: (message) => logger.info(message) } }));

// api/routes
app.use(baseRouter);

// Error handlers
app.use(errorHandler);
app.use(notFoundHandler); // 404 route handler

export default app;
