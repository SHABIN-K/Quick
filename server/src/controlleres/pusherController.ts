import { v4 as uuid_v4 } from 'uuid';
import { Request, Response, NextFunction } from 'express';

import { ErrorResponse } from '../error';
import { pusherServer } from '../config/pusher';

/**
 * fetch pusher server response
 * @param req The Express Request object.
 * @param res The Express Response object.
 * @param next The Express NextFunction for error handling.
 * @returns A JSON response indicating the success or failure of the pusher fetch process.
 */
export const pusherController = async (req: Request, res: Response, next: NextFunction) => {
  const { user } = req.body;
  try {
    if (!user) {
      return next(ErrorResponse.badRequest('unauthorized'));
    }
    console.log(user);
    const socketId = req.body.socket_id;
    const channel = req.body.channel_name;

    const presenceData = {
      user_id: uuid_v4(),
      user_info: { email: user, socket_id: uuid_v4() },
    };

    const authResponse = pusherServer.authorizeChannel(socketId, channel, presenceData);

    return res.send(authResponse);
  } catch (error) {
    return next(ErrorResponse.badRequest('An error occurred during pusher'));
  }
};
