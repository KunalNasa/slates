import { signinSchema, signupSchema } from "@slates/common/schemas";
import { client } from "@slates/db/client";
import { Request, Response } from "express";
import bcrypt from "bcrypt"
import { APIResponse, ErrorResponse, generateToken, requestUser, User } from "@slates/backend-common/config";

export async function signup(req : Request, res: Response) : Promise<any> {
    try {
        const data = req.body;
        const isDataValid = signupSchema.safeParse(data);
        if(!isDataValid.success){
            const response : ErrorResponse = {
                success : false,
                message : "Invalid data passed"
            }
            return res.status(400).json(response);
        }
        const isUsernameTaken = await client.user.findFirst({
            where : {
                username : data.username
            }
        })
        if(isUsernameTaken){
            const response : ErrorResponse = {
                success : false,
                message : "Username already taken"
            }
            return res.status(400).json(response);
        }
        const isUserAlreadyExists = await client.user.findFirst({
            where : {
                email : data.email
            }
        })
        if(isUserAlreadyExists){
            const response : ErrorResponse = {
                success : false,
                message : "User already exists with this email"
            }
            return res.status(400).json(response);
        }
        const hashedPassword = await bcrypt.hash(data.password, 10);
        const newUser = await client.user.create({
            data : {
                username : data.username,
                email : data.email,
                password : hashedPassword
            }
        })
        if(!newUser){
            return;
        }
        const response : APIResponse<User> = {
            success : true,
            message : "User created successfully",
            data : newUser
        }
        return res.status(201).json(response);
    } catch (error : any) {
        console.log('Error creating user', error.message);
        const response : ErrorResponse = {
            success : false,
            message : "Internal server error"
        }
        return res.status(500).json(response);
    }
    
}

export async function signin(req : Request, res: Response) : Promise<any> {
    try {
        const data = req.body;
        const isDataValid = signinSchema.safeParse(data);
        if(!isDataValid.success){
            const response : ErrorResponse = {
                success : false,
                message : "Invalid data passed"
            }
            return res.status(400).json(response);
        }
        const user = await client.user.findFirst({
            where : {
                OR: [
                    { email: data.identifier },
                    { username: data.identifier }
                ]   
            }
        })

        if(user){
            const isPasswordCorrect = await bcrypt.compare(data.password, user.password);
            if(!isPasswordCorrect){
                const response : ErrorResponse = {
                    success : false,
                    message : "Incorrect credentials"
                }
                return res.status(400).json(response);
            }
            const userDataForRequest : requestUser = {
                id : user.id,
                email : user.email,
                username : user.username
            }
            const token = generateToken(userDataForRequest, req, res);
            req.user = {
                id : user.id,
                username : user.username,
                email : user.email,
            };
            type responseType = {
                token : typeof token,
                user : typeof user
            }
            const response : APIResponse<responseType> = {
                success : true,
                message : "User signed in successfully",
                data : {
                    token,
                    user
                }
            }
            return res.status(201).json(response);

        }else{
            const response : ErrorResponse = {
                success : false,
                message : "User Not Found"
            }
            return res.status(404).json(response);
        }
    } catch (error : any) {
        console.log("Error in signin route", error.message);
        const response : ErrorResponse = {
            success : false,
            message : "Internal Server Error"
        }
        return res.status(500).json(response);
    }
    
}