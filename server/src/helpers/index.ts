import * as crypto from 'crypto';
// random profile pic genarator to use as default
export const profilePicGenerator = (email: string) => {
  const hash = crypto.createHash('md5').update(email).digest('hex');
  return `https://www.gravatar.com/avatar/${hash}?d=retro`;
};
