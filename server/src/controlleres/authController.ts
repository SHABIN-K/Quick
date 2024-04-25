import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';

import db from '../config/prismadb';
import { profilePicGenerator } from '../helpers';
import ErrorResponse from '../error/ErrorResponse';

export const signupController = async (req: Request, res: Response, next: NextFunction) => {
  const { name, username, email, password } = req.validData || { name: '', username: '', email: '', password: '' };

  try {
    // generating password hash
    const saltRounds = Number(process.env.SALT_ROUNDS) || 10;
    const hashedpass = await bcrypt.hash(password, saltRounds);

    //generating profile picture
    const profilePic = profilePicGenerator(username);

    // saving to db
    const newUser = await db.user.create({
      data: {
        name: name,
        username: username,
        email: email,
        hashedPassword: hashedpass,
        profile: profilePic,
      },
    });

    const token = jwt.sign({ userID: newUser.id }, process.env.JWT_TOKEN_SECRET as string, { expiresIn: 60 * 12 });

    // Set cookie with refresh token
    res.cookie('refreshToken', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production', // Set to true in production
      maxAge: 1000 * 60 * 60 * 24 * 7, // 7 days
    });

    return res.status(200).json({
      success: true,
      message: 'Account created successfully',
      data: {
        name: newUser.name,
        email: newUser.email,
        username: newUser.username,
        profile: newUser.profile,
        confirmToken: token,
      },
    });
  } catch (err) {
    console.error('Error in signupController:', err);
    return next(ErrorResponse.badRequest('Something went wrong'));
  }
};
//confirmatoin mail
// {
//   id: '6623f49a90b3894970a35b19',
//   name: 'Shabink',
//   email: 'dogemdan@twittwer.md',
//   profile: 'https://www.gravatar.com/avatar/7a9652bf7591b69cd9f97fe56dc0dd72?d=retro',
//   hashedPassword: '$2b$10$IzfTy1FDmdk/U//sMsZ6me7KE00VWQivE4NJSBmFicLd6lBwKWtci',
//   createdAt: 2024-04-20T17:00:10.779Z,
//   updatedAt: 2024-04-20T17:00:10.779Z,
//   conversationIds: [],
//   seenMessageIds: []
// }

export const loginController = async (req: Request, res: Response, next: NextFunction) => {
  const { email, password } = req.validDaata || { email: '', password: '' };

  try {
    const user = await db.user.findFirst({
      where: { email: email },
    });
    // invalid email
    if (!user) return next(ErrorResponse.badRequest('Invalid email or passwrod'));

    const match = await bcrypt.compare(password, user.hashedPassword as string);
    // invalid password
    if (!match) return next(ErrorResponse.badRequest('Invalid email or passwrod'));

    const accessToken = jwt.sign(
      { data: { email: user.email, id: user.id } },
      process.env.ACCESS_TOKEN_SECRET as string,
      {
        expiresIn: 60 * 10,
      },
    );

    res.cookie('authToken', accessToken, {
      httpOnly: true,
      secure: true,
      maxAge: 1000 * 60 * 60 * 24 * 7,
    });

    return res.status(200).json({
      success: true,
      message: 'Logged in successfully',
      data: {
        name: user.name,
        email: user.email,
        profile: user.profile,
        accessToken,
      },
    });
  } catch (err) {
    return next(err);
  }
};
