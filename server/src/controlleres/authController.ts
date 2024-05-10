import bcrypt from 'bcrypt';
import { Request, Response, NextFunction } from 'express';
import { JwtPayload, TokenExpiredError } from 'jsonwebtoken';

import db from '../config/prismadb';
import { userPayload } from '../shared/type';
import { pusherServer } from '../config/pusher';
import { jwtConfig } from '../config/jwtOption';
import ErrorResponse from '../error/ErrorResponse';
import { getServerUser } from '../hooks/getServerUser';
import { compileHTMLEmailTemplate, sendMail } from '../helpers/mail.helper';
import { generateAccessTokenAndRefreshToken } from '../helpers/auth.helper';
import { generatePass, generateToken, profilePicGenerator, verifyToken } from '../helpers';

declare module 'express-session' {
  interface SessionData {
    user: userPayload;
  }
}

/**
 * Handles user signup by creating a new user account, generating access and refresh tokens,
 * and setting cookies with the tokens.
 * @param req The Express Request object.
 * @param res The Express Response object.
 * @param next The Express NextFunction object.
 * @returns A JSON response indicating the success or failure of the signup process.
 */
const signupController = async (req: Request, res: Response, next: NextFunction) => {
  const { name, username, email, password } = req.validData || { name: '', username: '', email: '', password: '' };
  try {
    // generating password hash
    const hashedpass = await generatePass(password);

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

    const payload = {
      id: newUser.id,
      name,
      email,
      username,
    };

    req.session.user = payload;

    const { accessToken, refreshToken } = await generateAccessTokenAndRefreshToken({ payload });

    // Set cookies with tokens
    res.cookie('authToken', accessToken, {
      httpOnly: true,
      secure: process.env.APP_NODE_ENV === 'production', // Set to true in production
      maxAge: 1000 * 60 * 60 * 24 * 7, // 7 days
    });

    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: process.env.APP_NODE_ENV === 'production', // Set to true in production
      maxAge: 1000 * 60 * 60 * 24 * 30, // 30 days
    });

    // Send success response with user data and access token
    return res.status(200).json({
      success: true,
      message: 'Account created successfully',
      data: {
        id: newUser.id,
        name: newUser.name,
        username: newUser.username,
        email: newUser.email,
        profile: newUser.profile,
        confirmToken: accessToken,
      },
    });
  } catch (err) {
    console.error('Error in signupController:', err);
    return next(ErrorResponse.badRequest('An error occurred during signup'));
  }
};

/**
 * Authenticates a user by email and password, and generates access and refresh tokens upon successful login.
 * @param req The Express Request object.
 * @param res The Express Response object.
 * @returns A JSON response indicating the success or failure of the login process.
 */
const loginController = async (req: Request, res: Response) => {
  const { email, password } = req.signUpData || { email: '', password: '' };
  const validationErrors: { [key: string]: string[] } = {};
  try {
    // Find user by email
    const user = await db.user.findFirst({
      where: { email: email },
    });
    // invalid email
    if (!user) {
      validationErrors['email'] = ['Did you mistype your email address?'];
    }

    // Handle invalid email
    const match = await bcrypt.compare(password, user?.hashedPassword as string);

    // Handle invalid password
    if (!match) {
      validationErrors['password'] = ['Oops! The password you entered does not match.'];
    }

    // Construct payload for tokens
    const payload: userPayload = {
      id: user?.id as string,
      name: user?.name as string,
      email: user?.email as string,
      username: user?.username as string,
    };

    // Store user details in session
    req.session.user = payload;

    // Generate tokens
    const { accessToken, refreshToken } = await generateAccessTokenAndRefreshToken({ payload });

    // Set cookies with tokens
    res.cookie('authToken', accessToken, {
      httpOnly: true,
      secure: process.env.APP_NODE_ENV === 'production', // Set to true in production
      maxAge: 1000 * 60 * 60 * 24 * 7, // 7 days
    });

    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: process.env.APP_NODE_ENV === 'production', // Set to true in production
      maxAge: 1000 * 60 * 60 * 24 * 30, // 30 days (adjust as needed)
    });

    // Send success response with user data and access token
    return res.status(200).json({
      success: true,
      message: 'Logged in successfully',
      data: {
        id: user?.id,
        name: user?.name,
        username: user?.username,
        email: user?.email,
        profile: user?.profile,
        confirmToken: accessToken,
      },
    });
  } catch (err) {
    return res.status(400).json({
      success: false,
      message: validationErrors,
    });
  }
};

/**
 * Logs out the user by clearing authentication cookies and destroying the session.
 * @param req The Express Request object.
 * @param res The Express Response object.
 * @param next The Express NextFunction for error handling.
 * @returns A JSON response indicating the success or failure of the logout process.
 */
const logoutController = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = getServerUser(req, next);
    const userId = user?.id;

    if (!userId) {
      return next(ErrorResponse.notFound('User ID not found in session'));
    }

    // Remove user account from the database
    await db.account.deleteMany({
      where: {
        userId,
      },
    });

    // Clear the auth token cookie
    res.clearCookie('authToken', {
      httpOnly: true,
      secure: true,
      sameSite: 'none',
    });

    // Clear the refresh token cookie
    res.clearCookie('refreshToken', {
      httpOnly: true,
      secure: true,
      sameSite: 'none',
    });

    // Destroy the session
    req.session.destroy((err) => {
      if (err) {
        console.error('Error destroying session:', err);
        return next(ErrorResponse.badRequest('An error occurred during logout'));
      }

      return res.status(200).json({
        success: true,
        message: 'Logged out successfully',
      });
    });
  } catch (error) {
    console.error('Error in logoutController:', error);
    return next(ErrorResponse.badRequest('An error occurred during logout'));
  }
};

/**
 * create new  generates access and refresh tokens upon
 * @param req The Express Request object.
 * @param res The Express Response object.
 * @param next The Express NextFunction for error handling.
 * @returns A JSON response indicating the success or failure of the forgetpassword process.
 */
const refreshController = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // Extract refresh token from cookies or headers
    let refreshToken = req.cookies?.refreshToken;

    if (!refreshToken) {
      const authHeader = req.headers['authorization'];
      const accessToken = authHeader && authHeader.split(' ')[1];

      if (!accessToken) {
        return next(ErrorResponse.badRequest('Access token is required'));
      }

      const userAccount = await db.account.findFirst({ where: { access_token: accessToken } });

      if (!userAccount) {
        return next(ErrorResponse.badRequest('Invalid access token'));
      }

      refreshToken = userAccount.refresh_token;
    }

    // Ensure refresh token is available
    if (!refreshToken) {
      return next(ErrorResponse.badRequest('Refresh token is required'));
    }

    // Verify refresh token
    const secret = jwtConfig.REFRESH_TOKEN.secret as string;
    const decode = verifyToken(refreshToken as string, secret) as JwtPayload;

    // Retrieve user data based on decoded token
    const user = await db.user.findFirst({
      where: { id: decode?.data?.id },
    });

    // Generate new tokens
    const payload: userPayload = {
      id: decode?.data?.id,
      name: decode?.data?.name,
      email: decode?.data?.email,
      username: decode.data.username,
    };

    const { accessToken, refreshToken: newRefreshToken } = await generateAccessTokenAndRefreshToken({ payload });

    // Set cookies with new tokens
    res.cookie('authToken', accessToken, {
      httpOnly: true,
      secure: process.env.APP_NODE_ENV === 'production',
      maxAge: 1000 * 60 * 60 * 24 * 7, // 7 days
    });

    res.cookie('refreshToken', newRefreshToken, {
      httpOnly: true,
      secure: process.env.APP_NODE_ENV === 'production',
      maxAge: 1000 * 60 * 60 * 24 * 30, // 30 days
    });

    // Send the new tokens in the response
    return res.status(200).json({
      success: true,
      message: 'Tokens refreshed successfully',
      data: {
        id: decode?.data?.id,
        name: decode?.data?.name,
        username: decode?.data?.username,
        email: decode?.data?.email,
        profile: user?.profile,
        confirmToken: accessToken,
      },
    });
  } catch (error) {
    console.error('Error in refreshController:', error);
    return next(ErrorResponse.badRequest('An error occurred during refreshing token'));
  }
};

/**
 * create new password by destorying the old password
 * @param req The Express Request object.
 * @param res The Express Response object.
 * @param next The Express NextFunction for error handling.
 * @returns A JSON response indicating the success or failure of the refreshtoken process.
 */
const forgotPasswordController = async (req: Request, res: Response, next: NextFunction) => {
  const { email } = req.body;
  const validationErrors: { [key: string]: string[] } = {};

  // validating email
  if (
    !email ||
    !/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(
      email,
    )
  ) {
    return next(ErrorResponse.badRequest('Enter your email'));
  }
  try {
    // Find user by email
    const user = await db.user.findFirst({
      where: { email: email },
    });
    // invalid email
    if (!user) {
      validationErrors['email'] = ['Did you mistype your email address?'];

      return res.status(400).json({
        success: false,
        message: validationErrors,
      });
    }

    const secret = jwtConfig.RESET_PASSWORD_TOKEN.secret as string;
    const payload = user.email;
    const expiry = jwtConfig.RESET_PASSWORD_TOKEN.expiry as string;

    //generate reset token
    const token = generateToken(payload as string, secret, expiry);
    const url = `${process.env.APP_WEB_URL}/forget-password/${token}`;

    const emailTemplatePath = `./src/utils/template/reset-password-email.html`;
    const emailContent = await compileHTMLEmailTemplate(emailTemplatePath, {
      resetUrl: url,
    });

    // send mail
    await sendMail(email, 'Forgot Password Link', emailContent);

    return res.status(200).json({
      success: true,
      message: 'A password reset link has been sent to your email.',
    });
  } catch (error) {
    console.error('Error in forgotPasswordController:', error);
    return next(ErrorResponse.badRequest('An error occurred during forget password'));
  }
};

/**
 * Handles the reset password functionality.
 *
 * @param req - The request object.
 * @param res - The response object.
 * @param next - The next function.
 * @returns A JSON response indicating the success or failure of the password reset.
 */
const resetPasswordController = async (req: Request, res: Response, next: NextFunction) => {
  const { token, password } = req.resetPass || { password: '', token: '' };
  try {
    // Verify refresh token
    const secret = jwtConfig.RESET_PASSWORD_TOKEN.secret as string;
    const decode = verifyToken(token, secret) as JwtPayload;

    if (!decode.key) return next(ErrorResponse.notFound('Invalid reset link'));

    // generating password hash
    const hashedpass = await generatePass(password);

    // updateing to db
    await db.user.update({
      where: { email: decode.key },
      data: {
        hashedPassword: hashedpass,
      },
    });

    return res.status(200).json({
      success: true,
      message: 'Password updated successfully',
    });
  } catch (error) {
    if ((error as TokenExpiredError).name === 'TokenExpiredError')
      return next(ErrorResponse.badRequest('Reset link expired, generate new one'));

    console.error('Error in resetPasswordController:', error);
    return next(ErrorResponse.badRequest('An error occurred during reset password'));
  }
};

/**
 * fetch pusher server response
 * @param req The Express Request object.
 * @param res The Express Response object.
 * @param next The Express NextFunction for error handling.
 * @returns A JSON response indicating the success or failure of the pusher fetch process.
 */
const pusherController = async (req: Request, res: Response, next: NextFunction) => {
  const user = getServerUser(req, next);
  try {
    if (!user?.email) {
      return next(ErrorResponse.badRequest('unauthorized'));
    }

    const socketId = req.body.socket_id;
    const channel = req.body.channel_name;
    const data = {
      user_id: user?.email,
    };

    const authResponse = pusherServer.authorizeChannel(socketId, channel, data);

    return res.send(authResponse);
  } catch (error) {
    return next(ErrorResponse.badRequest('An error occurred during pusher'));
  }
};

export {
  signupController,
  loginController,
  logoutController,
  refreshController,
  forgotPasswordController,
  resetPasswordController,
  pusherController,
};
