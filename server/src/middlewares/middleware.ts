import cors from 'cors';
import helmet from 'helmet';
import express from 'express';
import cookieParser from 'cookie-parser';
import rateLimit from 'express-rate-limit';

const limiterOptions = {
  windowMs: 60 * 60 * 1000, // 60 minutes
  max: 1000, // Limit each IP to 1000 requests per `window`
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
  message: 'Too many request from this IP. Please try again after an hour',
};

const corsOptions = {
  origin: process.env.APP_WEB_URL || 'http://localhost:3000',
  credentials: true,
  optionsSuccessStatus: 200,
};

const middleware = [
  //requestLogger, // logger custom middleware
  rateLimit(limiterOptions), // requist limiter
  helmet(), // set security HTTP headers
  cors(corsOptions),
  express.json(),
  cookieParser(),
  express.urlencoded({ extended: true }),
];


export default middleware;
