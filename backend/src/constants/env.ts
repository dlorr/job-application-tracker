import "dotenv/config";

const getEnv = (key: string, defaultValue?: string): string => {
  const value = process.env[key] ?? defaultValue;
  if (value === undefined) {
    throw new Error(`Missing environment variable: ${key}`);
  }
  return value;
};

export const NODE_ENV = getEnv("NODE_ENV", "development");
export const PORT = Number(getEnv("PORT", "4003"));
export const APP_ORIGIN = getEnv("APP_ORIGIN", "http://localhost:5173");
export const DATABASE_URL = getEnv("DATABASE_URL");
