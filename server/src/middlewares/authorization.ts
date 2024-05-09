import { JwtPayload } from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';

import ErrorResponse from '../error/ErrorResponse';
import { verifyToken } from '../helpers';
import { jwtConfig } from '../config/jwtOption';

interface ExtendedRequest extends Request {
  userSession?: JwtPayload['data'];
}

export const authenticate = (req: ExtendedRequest, res: Response, next: NextFunction) => {
  try {
    // Extract access token from cookies or headers
    const accessToken = req.headers?.authorization?.split(' ')[1];
    console.log(accessToken);

    if (!accessToken) return next(ErrorResponse.unauthorized('Unauthorized access.'));

    // Verify token
    const secret = jwtConfig.ACCESS_TOKEN.secret as string;
    const decode = verifyToken(accessToken as string, secret) as JwtPayload;
    console.log(decode);

    if (!decode || !decode.data || !decode.data.email || !decode.data.id) {
      return next(ErrorResponse.badRequest('Invalid token data'));
    }

    // If token is valid, attach user data to request object
    req.userSession = decode.data;

    // Proceed to the next middleware or route handler
    return next();
  } catch (err) {
    console.error('Error in userAuthorization middleware:', err);
    return next(ErrorResponse.badRequest('something went wrong'));
  }
};
