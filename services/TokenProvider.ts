import dotenv from "dotenv";

export class TokenProvider{
    static getToken(): string | undefined{
        dotenv.config();
        return process.env.TOKEN;
    }
}