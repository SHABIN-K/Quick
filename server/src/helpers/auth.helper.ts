import jwt from 'jsonwebtoken';
import db from '../config/prismadb';
import { jwtConfig } from '../config/jwtOption';
import logger from '../utils/logger';

type Payload = {
  id: string;
  name: string;
  email: string;
  username: string;
};

export const generateTokens = async (props: {
  payload: Payload;
}): Promise<{ accessToken: string; refreshToken: string }> => {
  const { payload } = props;

  // Generate access token
  const accessToken = jwt.sign({ data: payload }, jwtConfig.ACCESS_TOKEN.secret as string, {
    expiresIn: jwtConfig.ACCESS_TOKEN.expiry,
  });

  // Generate refresh token
  const refreshToken = jwt.sign({ data: payload }, jwtConfig.REFRESH_TOKEN.secret as string, {
    expiresIn: jwtConfig.REFRESH_TOKEN.expiry,
  });
  try {
    // Store refresh token in user account
    await db.account.upsert({
      where: { id: payload.id },
      update: { refresh_token: refreshToken, access_token: accessToken },
      create: { userId: payload.id, refresh_token: refreshToken, access_token: accessToken },
    });
  } catch (error) {
    console.log(error);
    logger.error(error);
  }

  return { accessToken, refreshToken };
};
