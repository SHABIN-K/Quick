import { Request, Response, NextFunction } from 'express';

import db from '../config/prismadb';
import ErrorResponse from '../error/ErrorResponse';

/**
 * Retrieves the list of users from the database.
 * @param req - The request object.
 * @param res - The response object.
 * @param next - The next function.
 * @returns A JSON response containing the list of users.
 */
export const getUsersController = async (req: Request, res: Response, next: NextFunction) => {
  // Access session data
  const user = req.userSession;
  // Ensure email is available in userSession
  if (!user?.email) {
    return next(ErrorResponse.forbidden('Unauthorized: no access '));
  }

  try {
    const conversation = await db.conversation.findMany({
      orderBy: {
        createdAt: 'desc',
      },
      where: {
        isGroup: false,
        userIds: {
          has: user?.id,
        },
      },
      include: {
        users: {
          where: {
            id: {
              not: user?.id,
            },
          },
        },
      },
    });

    // Extract only the 'users' array from each conversation
    const users = conversation.map((value) => value.users).flat();

    return res.status(200).json({
      success: true,
      message: 'Users fetched successfully',
      data: users,
    });
  } catch (error) {
    console.error('Error in getUsersController:', error);
    return next(ErrorResponse.badRequest('An error occurred during get users'));
  }
};


/**
 * Retrieves all users from the database, excluding the current user.
 * Requires the user to be authenticated and have an email in the session.
 * Returns a JSON response with the list of users.
 *
 * @param req - The request object.
 * @param res - The response object.
 * @param next - The next function.
 * @returns A JSON response with the list of users.
 */
export const getAllUsersController = async (req: Request, res: Response, next: NextFunction) => {
  // Access session data
  const user = req.userSession;
  // Ensure email is available in userSession
  if (!user?.email) {
    return next(ErrorResponse.forbidden('Unauthorized: no access '));
  }

  try {
    const users = await db.user.findMany({
      orderBy: {
        createdAt: 'desc',
      },
      where: {
        NOT: {
          email: user?.email,
        },
      },
    });

    return res.status(200).json({
      success: true,
      message: 'All Users fetched successfully',
      data: users,
    });
  } catch (error) {
    console.error('Error in getAllUsersController:', error);
    return next(ErrorResponse.badRequest('An error occurred during get all users'));
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
