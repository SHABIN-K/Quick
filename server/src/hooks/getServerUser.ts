import { NextFunction, Request } from 'express';
import { JwtPayload } from 'jsonwebtoken';
import { verifyToken } from '../helpers/jwt.helper';
import { ErrorResponse } from '../error';

export const getServerUser = (req: Request, next: NextFunction) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  try {
    if (token) {
      const session = verifyToken(token as string) as JwtPayload;
      return session.data;
    } else {
      return next(ErrorResponse.unauthorized('Unauthorized: Token is missing'));
    }
  } catch (error) {
    return next(ErrorResponse.badRequest('something went wrong'));
  }
};
