export const jwtConfig = {
  secret: process.env.ACCESS_TOKEN_SECRET || "your_access_secret_here",
  signOptions: {
    expiresIn: 300, // 5 minutes in seconds
  },
};

export const jwtRefreshConfig = {
  secret: process.env.REFRESH_TOKEN_SECRET || "your_refresh_secret_here",
  signOptions: {
    expiresIn: 86400, // 1 day in seconds
  },
};
