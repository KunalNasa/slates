import { NextFunction, Request, Response } from "express";
import jwt, { JwtPayload } from "jsonwebtoken"
import { requestUser } from "../types/req";


export function verifyToken(req : Request, res : Response, next : NextFunction){
    const authHeader = req.headers.authorization;
    // console.log(authHeader);
    let token = authHeader && authHeader.split(' ')[1];
    // console.log(token);
    if (!token) {
        // console.log("My Cookies", req.cookies);
        token = req.cookies.jwt;
    }

    if (!token) {
        return res.status(401).json({ message: 'No token provided' });
    }
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET as string);
        const user : requestUser = (decoded as JwtPayload).user;
        req.user = user;
        next();
    } catch (err : any) {
        return res.status(403).json({ message: 'Failed to authenticate token' });
    }

}