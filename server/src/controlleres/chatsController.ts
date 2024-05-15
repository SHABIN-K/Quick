import { Request, Response, NextFunction } from 'express';

import db from '../config/prismadb';
import { userPayload } from '../shared/type';
import { pusherServer } from '../config/pusher';
import ErrorResponse from '../error/ErrorResponse';

// Extend the Request type to include the userSession property
declare module 'express' {
  interface Request {
    userSession?: userPayload;
  }
}

/**
 * Retrieves conversations for the current user.
 * @param req - The request object.
 * @param res - The response object.
 * @param next - The next function.
 * @returns A JSON response with the fetched conversations.
 */
export const getChatController = async (req: Request, res: Response, next: NextFunction) => {
  // Access session data
  const user = req.userSession;

  try {
    // Ensure email is available in userSession
    if (!user?.email) {
      return next(ErrorResponse.forbidden('Unauthorized: Invalid group chat data'));
    }

    // Fetch conversations for the current user
    const conversations = await db.conversation.findMany({
      orderBy: {
        lastMessageAt: 'desc',
      },
      where: {
        isGroup: false,
        userIds: {
          has: user?.id,
        },
      },
      include: {
        users: true,
        messages: {
          include: {
            seen: true,
            sender: true,
          },
        },
      },
    });

    return res.status(200).json({
      success: true,
      message: 'chats founded',
      data: conversations,
    });
  } catch (error) {
    console.error('Error in getConversationsController:', error);
    return next(ErrorResponse.badRequest('An error occurred during get chats'));
  }
};

/**
 * Retrieves Group conversations for the current user.
 * @param req - The request object.
 * @param res - The response object.
 * @param next - The next function.
 * @returns A JSON response with the fetched conversations.
 */
export const getGroupChatController = async (req: Request, res: Response, next: NextFunction) => {
  // Access session data
  const user = req.userSession;

  try {
    // Ensure email is available in userSession
    if (!user?.email) {
      return next(ErrorResponse.forbidden('Unauthorized: Invalid group chat data'));
    }

    // Fetch conversations for the current user
    const conversations = await db.conversation.findMany({
      orderBy: {
        lastMessageAt: 'desc',
      },
      where: {
        isGroup: true,
        userIds: {
          has: user?.id,
        },
      },
      include: {
        users: true,
        messages: {
          include: {
            seen: true,
            sender: true,
          },
        },
      },
    });

    return res.status(200).json({
      success: true,
      message: 'chats founded',
      data: conversations,
    });
  } catch (error) {
    console.error('Error in getGroupChatController:', error);
    return next(ErrorResponse.badRequest('An error occurred during get Group chats'));
  }
};

/**
 * Retrieves a single chat based on the provided Id.
 * @param req - The request object.
 * @param res - The response object.
 * @param next - The next function.
 * @returns The JSON response containing the fetched conversation.
 */
export const getSingleChatController = async (req: Request, res: Response, next: NextFunction) => {
  const { Id } = req.params;

  try {
    // Fetch conversations for the current user
    const conversations = await db.conversation.findMany({
      where: {
        id: Id,
      },
      include: {
        users: true,
      },
    });

    return res.status(200).json({
      success: true,
      message: 'converstaion founded',
      data: conversations,
    });
  } catch (error) {
    console.error('Error is getSingleChatController:', error);
    return next(ErrorResponse.badRequest('An error occurred during get single chats'));
  }
};

///

///
export const getcreateChatController = async (req: Request, res: Response, next: NextFunction) => {
  const { userId: email, chatId: userId, isGroup, members, name } = req.body;
  try {
    const currentUser = await db.user.findUnique({
      where: { email: email },
    });

    if (!currentUser?.id || !currentUser?.email) {
      return next(ErrorResponse.badRequest('Unauthorized'));
    }

    if (isGroup && (!members || members.length < 2 || !name)) {
      return next(ErrorResponse.unauthorized('Unauthorized: Invalid group chat data'));
    }

    if (isGroup) {
      const newConversation = await db.conversation.create({
        data: {
          name,
          isGroup,
          users: {
            connect: [...members.map((member: { value: string }) => ({ id: member.value })), { id: currentUser.id }],
          },
        },
        include: {
          users: true,
        },
      });

      newConversation.users.forEach((user) => {
        if (user.email) {
          pusherServer.trigger(user.email, 'conversation:new', newConversation);
        }
      });

      return res.status(200).json({
        success: true,
        message: 'Group chat created successfully',
        data: newConversation,
      });
    }

    const existingConversations = await db.conversation.findMany({
      where: {
        OR: [{ userIds: { equals: [currentUser.id, userId] } }, { userIds: { equals: [userId, currentUser.id] } }],
      },
    });

    const singleConversation = existingConversations[0];

    if (singleConversation) {
      return res.status(200).json({
        success: true,
        message: 'Chat found or created successfully',
        data: singleConversation,
      });
    }

    const newConversation = await db.conversation.create({
      data: {
        users: {
          connect: [
            {
              id: currentUser.id,
            },
            {
              id: userId,
            },
          ],
        },
      },
      include: {
        users: true,
      },
    });

    newConversation.users.map((user) => {
      if (user.email) {
        pusherServer.trigger(user.email, 'conversation:new', newConversation);
      }
    });

    return res.status(200).json({
      success: true,
      message: 'Chat found or created successfully',
      data: newConversation,
    });
  } catch (error) {
    console.error('Error in getChatController:', error);
    return next(error);
  }
};

export const geSingletMessagesController = async (req: Request, res: Response, next: NextFunction) => {
  const { chatId } = req.body;
  try {
    // Fetch message for the current user
    const message = await db.message.findMany({
      where: {
        conversationId: chatId,
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
    return next(error);
  }
};

export const getMessagesControllerr = async (req: Request, res: Response, next: NextFunction) => {
  const { message, image, conversationId, userId: email } = req.body;
  try {
    const currentUser = await db.user.findUnique({
      where: { email: email },
    });

    // Fetch message for the current user
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
            id: currentUser?.id,
          },
        },
        seen: {
          connect: {
            id: currentUser?.id,
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
    console.error('Error is getMessageController:', error);
    return next(error);
  }
};

export const getConversationByParamsController = async (req: Request, res: Response, next: NextFunction) => {
  const { conversationId } = req.params;
  const { email } = req.body;

  try {
    const currentUser = await db.user.findUnique({
      where: { email: email },
    });

    if (!currentUser?.id || !currentUser?.email) {
      return next(ErrorResponse.badRequest('unauthorized'));
    }
    // Fetch conversation for the current user
    const conversation = await db.conversation.findUnique({
      where: {
        id: conversationId,
      },
      include: {
        messages: {
          include: {
            seen: true,
          },
        },
        users: true,
      },
    });

    if (!conversation) {
      return next(ErrorResponse.badRequest('Invalid ID'));
    }

    // Find the last message
    const lastMessage = conversation.messages[conversation.messages.length - 1];

    if (!lastMessage) {
      return res.status(200).json({
        success: true,
        message: 'conversation founded',
        data: conversation,
      });
    }

    // Update seen of last message
    const updatedMessage = await db.message.update({
      where: {
        id: lastMessage.id,
      },
      include: {
        sender: true,
        seen: true,
      },
      data: {
        seen: {
          connect: {
            id: currentUser?.id,
          },
        },
      },
    });

    await pusherServer.trigger(currentUser?.email, 'conversation:update', {
      id: conversationId,
      messages: [updatedMessage],
    });

    if (lastMessage.seenIds.indexOf(currentUser.id) !== -1) {
      return res.status(200).json({
        success: true,
        message: 'conversation founded',
        data: conversation,
      });
    }

    await pusherServer.trigger(conversationId!, 'message:update', updatedMessage);

    return res.status(200).json({
      success: true,
      message: 'updatedMessage',
      data: updatedMessage,
    });
  } catch (error) {
    console.error('Error is getMessageController:', error);
    return next(error);
  }
};

export const deleteConversationByParamsController = async (req: Request, res: Response, next: NextFunction) => {
  const { conversationId } = req.params;
  const { email } = req.body;

  try {
    const currentUser = await db.user.findUnique({
      where: { email: email },
    });

    // Fetch conversation for the current user
    const existingConversation = await db.conversation.findUnique({
      where: {
        id: conversationId,
      },
      include: {
        users: true,
      },
    });

    if (!existingConversation) {
      return next(ErrorResponse.badRequest('Invalid ID'));
    }

    // Find the last message
    const deletedConversation = await db.conversation.deleteMany({
      where: {
        id: conversationId,
        userIds: {
          hasSome: [currentUser?.id ?? ''],
        },
      },
    });

    existingConversation.users.forEach((user) => {
      if (user.email) {
        pusherServer.trigger(user.email, 'conversation:remove', existingConversation);
      }
    });

    return res.status(200).json({
      success: true,
      message: 'conversation deleted successfully',
      data: deletedConversation,
    });
  } catch (error) {
    console.error('Error is getMessageController:', error);
    return next(error);
  }
};
