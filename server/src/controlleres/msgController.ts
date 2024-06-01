import { Request, Response, NextFunction } from 'express';

import db from '../config/prismadb';
import { ErrorResponse } from '../error';
import { pusherServer } from '../config/pusher';

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

/**
 * Creates a new message and updates the conversation with the new message.
 * @param req - The request object.
 * @param res - The response object.
 * @param next - The next function.
 * @returns The response with the created message data.
 */
export const createMessagesControllerr = async (req: Request, res: Response, next: NextFunction) => {
  const user = req.userSession;
  const { message, image, conversationId } = req.body;
  try {
    // create message for the current user
    const newMessage = await db.message.create({
      data: {
        body: message,
        image: image,
        conversation: {
          connect: {
            id: conversationId,
          },
        },
        sender: {
          connect: {
            id: user?.id,
          },
        },
        seen: {
          connect: {
            id: user?.id,
          },
        },
      },
      include: {
        seen: true,
        sender: true,
      },
    });

    const updatedConversation = await db.conversation.update({
      where: {
        id: conversationId,
      },
      data: {
        lastMessageAt: new Date(),
        messages: {
          connect: {
            id: newMessage.id,
          },
        },
      },
      include: {
        users: true,
        messages: {
          include: {
            seen: true,
          },
        },
      },
    });

    await pusherServer.trigger(conversationId, 'messages:new', newMessage);

    const lastMsg = updatedConversation.messages[updatedConversation.messages.length - 1];

    updatedConversation.users.map((user) => {
      if (user?.email) {
        pusherServer.trigger(user.email, 'conversation:update', {
          id: conversationId,
          isGroup: updatedConversation.isGroup,
          message: [lastMsg],
        });
      }
    });

    return res.status(200).json({
      success: true,
      message: 'message founded',
      data: newMessage,
    });
  } catch (error) {
    console.error('Error is createMessageController:', error);
    return next(ErrorResponse.badRequest('An error occurred during create messages'));
  }
};
