import jwt from 'jsonwebtoken';
import { jwtConfig } from '../config/jwtOption';


export const verifyToken = (token: string) => {
  const decodedToken = jwt.verify(token, jwtConfig.ACCESS_TOKEN.secret as string);
  return decodedToken;
};
