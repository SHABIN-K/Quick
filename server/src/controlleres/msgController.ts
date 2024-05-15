import { Request, Response, NextFunction } from 'express';

import db from '../config/prismadb';
import { ErrorResponse } from '../error';

/**
 * Retrieves messages for a given conversation ID.
 * @param req - The request object.
 * @param res - The response object.
 * @param next - The next function.
 * @returns A JSON response with the retrieved messages.
 */
export const getMessagesController = async (req: Request, res: Response, next: NextFunction) => {
  const { Id } = req.params;
  try {
    // Fetch message for the current user
    const message = await db.message.findMany({
      where: {
        conversationId: Id,
      },
      include: {
        sender: true,
        seen: true,
      },
      orderBy: {
        createdAt: 'asc',
      },
    });

    return res.status(200).json({
      success: true,
      message: 'message founded',
      data: message,
    });
  } catch (error) {
    console.error('Error is getMessageController:', error);
    return next(ErrorResponse.badRequest('An error occurred during get messages'));
  }
};
