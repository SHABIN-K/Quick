import jwt from 'jsonwebtoken';

export const generate = (email: string) => {
  return jwt.sign({ email }, process.env.JWT_TOKEN_SECRET as string, {
    expiresIn: 60 * 12,
  });
};

export const verifyToken = (token: string) => {
  return new Promise((resolve, reject) => {
    jwt.verify(token, process.env.JWT_TOKEN_SECRET as string, (err, decoded) => {
      if (err) {
        reject(err);
      } else {
        resolve(decoded);
      }
    });
  });
};
