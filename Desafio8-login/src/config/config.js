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
} = process.env