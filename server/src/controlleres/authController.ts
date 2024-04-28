import bcrypt from 'bcrypt';
import { Request, Response, NextFunction } from 'express';

import db from '../config/prismadb';
import { profilePicGenerator } from '../helpers';
import ErrorResponse from '../error/ErrorResponse';
import { generateToken } from '../helpers/jwtHelper';

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

    const accessToken = generateToken(email);

    // Set cookie with refresh token
    res.cookie('authToken', accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production', // Set to true in production
      maxAge: 1000 * 60 * 60 * 24 * 7, // 7 days
    });

    return res.status(200).json({
      success: true,
      message: 'Account created successfully',
      data: {
        name: newUser.name,
        username: newUser.username,
        email: newUser.email,
        profile: newUser.profile,
        confirmToken: accessToken,
      },
    });
  } catch (err) {
    console.error('Error in signupController:', err);
    return next(ErrorResponse.badRequest('Something went wrong'));
  }
};

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

    const accessToken = generateToken(email);

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
        username: user.username,
        email: user.email,
        profile: user.profile,
        accessToken,
      },
    });
  } catch (err) {
    return next(err);
  }
};

export const logoutController = async (req: Request, res: Response) => {
  res.clearCookie('authToken', {
    httpOnly: true,
    secure: true,
    sameSite: 'none',
  });

  return res.status(200).json({
    success: true,
    message: 'Logged out successfully',
  });
};