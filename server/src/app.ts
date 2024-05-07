import morgan from 'morgan';
import express from 'express';

import routes from './routes';
import logger from './helpers/logger';
import { middleware } from './middlewares';
import { errorHandler, notFoundHandler } from './error';

// Create an Express application
const app = express();

// app middlewares
app.use(middleware);

//logger

app.use(morgan('combined', { stream: { write: (message) => logger.info(message) } }));

// api/routes
app.use(routes);

// Error handlers
app.use(errorHandler);
app.use(notFoundHandler); // 404 route handler

export default app;
