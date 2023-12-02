import { config } from "dotenv";

config({
    path: `.env.${process.env.NODE_ENV || "development"}.local`,
});

export const {
    NODE_ENV,
    PORT,
    DB_HOST,
    DB_NAME,
    DB_PASSWORD,
    DB_USER,
    DB_CNN,
    ORIGIN,
    S_SECRET,
    SALT,
    CLIENT_ID,
    CLIENT_SECRET,
    CALLBACK_URL,
    JWT_SECRET,
    SIGNED_COOKIE,
} = process.env