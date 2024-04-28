import { Request, Response, NextFunction } from 'express';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const getUsersController = (req: Request, res: Response, next: NextFunction) => {
  res.send('Got a GET request');
};
