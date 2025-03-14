import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import { requestUser } from "../types/req";

export function generateToken(user : requestUser, req: Request, res: Response) {
    const token = jwt.sign({ user : user }, process.env.JWT_SECRET as string, {
        expiresIn: "15d", // Optional: Set token expiry
    });

    res.cookie("jwt", token, { 
        maxAge: 15 * 24 * 60 * 60 * 1000, // 15 days in milliseconds
        httpOnly: true,
        sameSite: "strict", // Helps prevent CSRF attacks
        secure: process.env.NODE_ENV === "production", // HTTPS only in production
    });

    return token;
}
