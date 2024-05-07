import winston from 'winston';
import 'winston-daily-rotate-file';

const { combine, timestamp, printf, colorize, align, json } = winston.format;

const logLevels = {
  fatal: 0,
  error: 1,
  warn: 2,
  info: 3,
  debug: 4,
  trace: 5,
};


const fileRotateTransport = new winston.transports.DailyRotateFile({
  filename: './logs/%DATE%/combined-%DATE%.log',
  datePattern: 'YYYY-MM-DD',
  maxFiles: '1d',
});

const logger = winston.createLogger({
  levels: logLevels,
  level: process.env.APP_LOG_LEVEL || 'info',
  format: combine(
    colorize({ all: true }),
    timestamp({
      format: 'YYYY-MM-DD hh:mm:ss.SSS A',
    }),
    align(),
    printf((info) => `[${info.timestamp}] ${info.level}: ${info.message}`),
    json(),
  ),
  defaultMeta: { service: 'user-service' },
  transports: [
    fileRotateTransport,
    new winston.transports.Console(),
    new winston.transports.File({ filename: './logs/app-error.log', level: 'error' }),
    new winston.transports.File({ filename: './logs/combined.log' }),
  ],
});

if (process.env.NODE_ENV !== 'production') {
  logger.add(
    new winston.transports.Console({
      format: winston.format.simple(),
    }),
  );
}

export default logger;
