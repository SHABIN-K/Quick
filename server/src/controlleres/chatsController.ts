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

/**
 * Retrieves a conversation by its ID and returns the conversation data along with the last message.
 * Also updates the "seen" status of the last message and triggers pusher events.
 * @param req - The request object.
 * @param res - The response object.
 * @param next - The next function.
 * @returns The conversation data and the updated message.
 */
export const getChatByParamsController = async (req: Request, res: Response, next: NextFunction) => {
  // Access session data
  const user = req.userSession;

  const { Id } = req.params;
  try {
    if (!user) {
      return next(ErrorResponse.unauthorized('unauthorized'));
    }

    // Fetch conversation for the current user
    const conversation = await db.conversation.findUnique({
      where: {
        id: Id,
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
        message: 'conversation not started yet',
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
            id: user?.id,
          },
        },
      },
    });
   
    await pusherServer.trigger(Id!, 'message:update', updatedMessage);

    await pusherServer.trigger(user?.email, 'conversation:update', {
      id: Id,
      isGroup: conversation.isGroup,
      messages: [updatedMessage],
    });

    if (lastMessage.seenIds.indexOf(user.id) !== -1) {
      return res.status(200).json({
        success: true,
        message: 'conversation founded',
      });
    }

    return res.status(200).json({
      success: true,
      message: 'updatedMessage',
    });
  } catch (error) {
    console.error('Error is getChatByParamsController:', error);
    return next(ErrorResponse.badRequest('An error occurred during get messages'));
  }
};

/**
 * Handles the creation of a chat or retrieval of an existing chat.
 * @param req - The request object.
 * @param res - The response object.
 * @param next - The next function.
 * @returns A JSON response indicating the success status and the created/retrieved chat data.
 */
export const getcreateChatController = async (req: Request, res: Response, next: NextFunction) => {
  const user = req.userSession;
  const { chatId: userId, isGroup, members, name } = req.body;
  try {
    if (!user?.id || !user?.email) {
      return next(ErrorResponse.badRequest('Unauthorized'));
    }

    if (isGroup && (!members || members.length < 2 || !name)) {
      return next(ErrorResponse.unauthorized('Add two members and a group name to create a group chat'));
    }

    if (isGroup) {
      const newConversation = await db.conversation.create({
        data: {
          name,
          isGroup,
          users: {
            connect: [...members.map((member: { value: string }) => ({ id: member.value })), { id: user.id }],
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
        OR: [{ userIds: { equals: [user.id, userId] } }, { userIds: { equals: [userId, user.id] } }],
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
        isGroup: false,
        users: {
          connect: [
            {
              id: user.id,
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
    return next(ErrorResponse.badRequest('An error occurred during create chat'));
  }
};

/**
 * Deletes a chat conversation.
 * @param req - The request object.
 * @param res - The response object.
 * @param next - The next function.
 * @returns A JSON response indicating the success of the operation and the deleted conversation data.
 */
export const deleteChatController = async (req: Request, res: Response, next: NextFunction) => {
  const { Id } = req.params;
  const user = req.userSession;

  try {
    // Fetch conversation for the current user
    const existingConversation = await db.conversation.findUnique({
      where: {
        id: Id,
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
        id: Id,
        userIds: {
          hasSome: [user?.id ?? ''],
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
    console.error('Error is deleteChatController:', error);
    return next(ErrorResponse.badRequest('An error occurred during delete chat'));
  }
};

/**
 * update chat members.
 * @param req - The request object.
 * @param res - The response object.
 * @param next - The next function.
 * @returns A JSON response indicating the success of the operation and the deleted conversation data.
 */
export const updateChatController = async (req: Request, res: Response, next: NextFunction) => {
  const user = req.userSession;
  const { groupId, isGroup, members } = req.body;

  try {
    if (!user?.id || !user?.email) {
      return next(ErrorResponse.badRequest('Unauthorized'));
    }

    if (isGroup && !members) {
      return next(ErrorResponse.unauthorized('Unauthorized: Invalid group chat data'));
    }

    const updatedGroup = await db.conversation.update({
      where: { id: groupId },
      data: {
        users: {
          connect: [...members.map((member: { value: string }) => ({ id: member.value })), { id: user.id }],
        },
      },
      include: {
        users: true,
      },
    });

    updatedGroup.users.forEach((user) => {
      if (user.email) {
        pusherServer.trigger(user.email, 'conversation:new', updatedGroup);
      }
    });

    return res.status(200).json({
      success: true,
      message: 'Group chat udpated successfully',
      // data: updatedGroup,
    });
  } catch (error) {
    console.error('Error in updateChatController:', error);
    return next(ErrorResponse.badRequest('An error occurred during add member'));
  }
};
