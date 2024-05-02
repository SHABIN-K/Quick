import { Request, Response, NextFunction } from 'express';
import ErrorResponse from '../error/ErrorResponse';
import db from '../config/prismadb';

export const getChatController = async (req: Request, res: Response, next: NextFunction) => {
  const { userId: email, chatId, isGroup, members, name } = req.body;

  console.log(isGroup, members, name);

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

    let newConversation;

    if (isGroup) {
      newConversation = await db.conversation.create({
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
    } else {
      const existingConversations = await db.conversation.findMany({
        where: {
          OR: [{ userIds: { equals: [currentUser.id, chatId] } }, { userIds: { equals: [chatId, currentUser.id] } }],
        },
      });

      newConversation =
        existingConversations[0] ||
        (await db.conversation.create({
          data: {
            users: {
              connect: [{ id: currentUser.id }, { id: chatId }],
            },
          },
          include: {
            users: true,
          },
        }));
    }

    return res.status(200).json({
      success: true,
      message: isGroup ? 'Group chat created successfully' : 'Chat found or created successfully',
      data: newConversation,
    });
  } catch (error) {
    console.error('Error in getChatController:', error);
    return next(error);
  }
};

export const getConversationController = async (req: Request, res: Response, next: NextFunction) => {
  const { email } = req.body;
  try {
    const currentUser = await db.user.findUnique({
      where: { email: email },
    });

    // Check if currentUser exists and has valid data
    if (!currentUser?.id || !currentUser?.email) {
      return next(ErrorResponse.badRequest('Unauthorized'));
    }

    // Fetch conversations for the current user
    const conversations = await db.conversation.findMany({
      orderBy: {
        lastMessageAt: 'desc',
      },
      where: {
        userIds: {
          has: currentUser.id,
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
      message: 'converstaion founded',
      data: conversations,
    });
  } catch (error) {
    console.error('Error in getConversationsController:', error);
    return next(error);
  }
};

export const getSingleChatController = async (req: Request, res: Response, next: NextFunction) => {
  const { chatId } = req.body;
  try {
    // Fetch conversations for the current user
    const conversations = await db.conversation.findMany({
      where: {
        id: chatId,
      },
      include: {
        users: true,
      },
    });
    console.log(conversations);
    return res.status(200).json({
      success: true,
      message: 'converstaion founded',
      data: conversations,
    });
  } catch (error) {
    console.error('Error is getSingleChatController:', error);
    return next(error);
  }
};
