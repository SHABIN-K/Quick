import bcrypt from 'bcrypt';

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
