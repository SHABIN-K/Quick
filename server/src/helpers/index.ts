import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

/**
 * Generates a URL for a profile picture based on the given username.
 * @param username The username used to generate the profile picture URL.
 * @returns A URL for the profile picture.
 */
export const profilePicGenerator = (username: string) => {
  const baseURL = 'https://avatar.iran.liara.run/public/';
  const profilePicURL = `${baseURL}?username=${encodeURIComponent(username)}`;

  return profilePicURL;
};

/**
 * Generates a hashed password using bcrypt with a specified number of salt rounds.
 * @param password The password to be hashed.
 * @returns A promise that resolves to the hashed password.
 */
export const generatePass = async (password: string) => {
  const saltRounds = Number(process.env.APP_SALT_ROUNDS) || 10;
  const hashedPassword = await bcrypt.hash(password, saltRounds);

  return hashedPassword;
};

/**
 * Verifies a token using jwt with a specified secret.
 * @param token The user authentication token to be verified.
 * @param secret The secret used to verify the token.
 * @returns The decoded jwt token.
 */
export const verifyToken = (token: string, secret: string) => {
  const decodedToken = jwt.verify(token, secret);
  return decodedToken;
};

/**
 * Generates a token using the provided payload, secret, and expiry.
 * @param payload - The payload to be included in the token.
 * @param secret - The secret key used to sign the token.
 * @param expiry - The expiration time for the token.
 * @returns The generated token.
 */
export const generateToken = (payload: string, secret: string, expiry: string) => {
  const generatedToken = jwt.sign({ key: payload }, secret, { expiresIn: expiry });
  return generatedToken;
};
