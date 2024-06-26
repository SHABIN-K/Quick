import { Request, Response, NextFunction } from 'express';
import ErrorResponse from './ErrorResponse';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const errorHandler = (err: ErrorResponse, req: Request, res: Response, next: NextFunction) => {
  console.error(err);

  if (err instanceof ErrorResponse) {
    return res.status(err.status).json({
      success: false,
      status: err.status,
      message: err.message,
    });
  }

  return res.status(500).json({ success: false, status: 500, message: 'Internal server error' });
};

// 404 route handler
const notFoundHandler = (req: Request, res: Response) => {
  res.status(404).json({ success: false, status: 404, message: 'Not found' });
};

export { errorHandler, notFoundHandler };
