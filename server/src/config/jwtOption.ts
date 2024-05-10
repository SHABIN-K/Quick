export const jwtConfig = {
  ACCESS_TOKEN: {
    secret: process.env.APP_ACCESS_TOKEN_SECRET,
    expiry: process.env.APP_ACCESS_TOKEN_EXPIRY,
  },
  REFRESH_TOKEN: {
    secret: process.env.APP_REFRESH_TOKEN_SECRET,
    expiry: process.env.APP_REFRESH_TOKEN_EXPIRY,
  },
  RESET_PASSWORD_TOKEN: {
    secret: process.env.APP_RESET_PASSWORD_TOKEN_SECRET,
    expiry: process.env.APP_RESET_PASSWORD_TOKEN_EXPIRY_MINS,
  },
};
