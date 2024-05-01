import { Request, Response, NextFunction } from 'express';
import ErrorResponse from '../error/ErrorResponse';
import db from '../config/prismadb';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
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
    });

    return res.status(200).json({
      success: true,
      message: 'Users fetched successfully',
      data: users,
    });
  } catch (error) {
    console.error('Error in chatsController:', error);
    return next(ErrorResponse.badRequest('Something went wrong'));
  }
};
