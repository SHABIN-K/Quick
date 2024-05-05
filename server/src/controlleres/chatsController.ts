import { Request, Response, NextFunction } from 'express';
import ErrorResponse from '../error/ErrorResponse';
import db from '../config/prismadb';

export const getChatController = async (req: Request, res: Response, next: NextFunction) => {
  const { userId: email, chatId, isGroup, members, name } = req.body;
  console.log(email, chatId);

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

    // Fetch conversations for the current user
    const conversations = await db.conversation.findMany({
      orderBy: {
        lastMessageAt: 'desc',
      },
      where: {
        userIds: {
          has: currentUser?.id,
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

export const getMessagesController = async (req: Request, res: Response, next: NextFunction) => {
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
    console.log(updatedConversation);

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

    return res.status(200).json({
      success: true,
      message: 'updatedMessage ',
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
