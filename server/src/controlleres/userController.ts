import { Request, Response, NextFunction } from 'express';
import ErrorResponse from '../error/ErrorResponse';
import db from '../config/prismadb';

export const getUsersController = async (req: Request, res: Response, next: NextFunction) => {
  const { email } = req.body;

  if (!email) next(ErrorResponse.badRequest('Email is missing or invalid'));

  try {
    const users = await db.user.findMany({
      orderBy: {
        createdAt: 'desc',
      },
      where: {
        NOT: {
          email: email,
        },
      },
      select: {
        id: true,
        name: true,
        username: true,
        email: true,
        profile: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    return res.status(200).json({
      success: true,
      message: 'Users fetched successfully',
      data: users,
    });
  } catch (error) {
    console.error('Error in chatsController:', error);
    return next(error);
  }
};

export const updateUserController = async (req: Request, res: Response, next: NextFunction) => {
  const { name, email } = req.body;
  try {
    const currentUser = await db.user.findUnique({
      where: { email: email },
    });

    if (!currentUser) {
      return next(ErrorResponse.badRequest('something wernt wrong'));
    }

    const updatedUser = await db.user.update({
      where: {
        id: currentUser?.id,
      },
      data: {
        name: name,
      },
    });

    return res.status(200).json({
      success: true,
      message: 'User updated successfully',
      data: updatedUser,
    });
  } catch (error) {
    console.error('Error in updateUserController:', error);
    return next(error);
  }
};
