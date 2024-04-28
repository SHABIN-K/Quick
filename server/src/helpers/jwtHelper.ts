import jwt from 'jsonwebtoken';

export const generateToken = (email: string) => {
  return jwt.sign({ email }, process.env.JWT_TOKEN_SECRET as string, {
    expiresIn: 60 * 12,
  });
};
export const verifyToken = (token: string) => {
  console.log(token);

  return jwt.verify(token, process.env.JWT_TOKEN_SECRET as string);
};
