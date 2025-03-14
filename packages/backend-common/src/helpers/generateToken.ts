import { Request } from "express";
import jwt from "jsonwebtoken"


export async function generateToken(userId : string, req : Request) {
    // signed by secret, put userId in token
    const token = jwt.sign({userId}, process.env.JWT_SECRET as string)

    req.cookies.set('jwt', token, { 
		maxAge: 15 * 24 * 60 * 60 * 1000, // MS
        httpOnly: true,
		sameSite: "strict", // CSRF attacks cross-site request forgery attacks
        secure: process.env.NODE_ENV === 'production' 
    })
    return token;

}