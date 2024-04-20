import bcrypt from 'bcrypt';
import { Request, Response, NextFunction } from 'express';

import db from '../config/prismadb';
import { profilePicGenerator, sendVerificationOtp } from '../helpers';
import ErrorResponse from '../error/ErrorResponse';

export const signupController = async (req: Request, res: Response, next: NextFunction) => {
  const { name, email, password } = req.validData || { name: '', email: '', password: '' };
  let hashedpass, profilePic, savedData;

  try {
    // checking for duplicate user
    const user = await db.user.findFirst({
      where: { email: email },
    });

    if (user) return next(ErrorResponse.badRequest('Email already registed'));

    // generating password hash
    const saltRounds = Number(process.env.SALT_ROUNDS) || 10;
    hashedpass = await bcrypt.hash(password, saltRounds);

    //generating profile picture
    profilePic = profilePicGenerator(email);

    // saving to db
    savedData = await db.user.create({
      data: {
        name: name,
        email: email,
        hashedPassword: hashedpass,
        profile: profilePic,
      },
    });
  } catch (err) {
    console.log(err);
    return next(err);
  }
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
  //confirmatoin mail
  try {
    const response = await sendVerificationOtp(email);

    if (response.success)
      return res.status(200).json({
        success: true,
        data: {
          confirmToken: response.token,
        },
        message: 'Account created successfully and verifications otp send to your email',
      });
  } catch (err) {
    if (savedData.id) {
      await db.user.delete({ where: { id: savedData.id } });
    }
    return next(err);
  }
  return next(ErrorResponse.badRequest('Something went wrong'));
};
