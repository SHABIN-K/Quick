import { JwtPayload } from 'jsonwebtoken';
import { NextFunction, Request } from 'express';

import { verifyToken } from '../helpers';
import { ErrorResponse } from '../error';
import { jwtConfig } from '../config/jwtOption';

export const getServerUser = (req: Request, next: NextFunction) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  const secret = jwtConfig.ACCESS_TOKEN.secret as string;
  try {
    if (token) {
      const session = verifyToken(token as string, secret) as JwtPayload;
      return session.data;
    } else {
      return next(ErrorResponse.unauthorized('Unauthorized: Token is missing'));
    }
  } catch (error) {
    return next(ErrorResponse.badRequest('something went wrong'));
  }
};
