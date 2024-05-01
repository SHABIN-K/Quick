import { JwtPayload } from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';

import ErrorResponse from '../error/ErrorResponse';
import { verifyToken } from '../helpers/jwtHelper';

interface ExtendedRequest extends Request {
  userData?: JwtPayload['data']; // Type from your JwtPayload interface
}

export const userAuthorization = async (req: ExtendedRequest, res: Response, next: NextFunction) => {
  const token = req.headers?.authorization?.split(' ')[1];

  if (!token) return next(ErrorResponse.unauthorized('Unauthorized'));

  try {
    const decode = verifyToken(token) as JwtPayload;

    if (!decode || !decode.data || !decode.data.email || !decode.data.id) {
      return next(ErrorResponse.badRequest('Invalid token data'));
    }

    req.userData = decode.data;
    return next();
  } catch (err) {
    console.error('Error in userAuthorization middleware:', err);
    return next(ErrorResponse.forbidden('Forbidden'));
  }
};
