export const config = {
  database: {
    url: process.env.DATABASE_URL!,
  },
  port: Number.isNaN(Number(process.env.PORT))
    ? 3000
    : Number(process.env.PORT),
  nodeEnv: process.env.NODE_ENV || 'development',
} as const;
