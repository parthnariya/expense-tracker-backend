export const config = {
  database: {
    url: process.env.DATABASE_URL!,
  },
  port: process.env.PORT || 3000,
  nodeEnv: process.env.NODE_ENV || 'development',
} as const;
