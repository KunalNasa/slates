import { signinSchema, signupSchema } from "@slates/common/schemas";
import { client } from "@slates/db/client";
import { Request, Response } from "express";
import bcrypt from "bcrypt"
import { generateToken, requestUser } from "@slates/backend-common/config";

export async function signup(req : Request, res: Response) : Promise<any> {
    try {
        const data = req.body;
        const isDataValid = signupSchema.safeParse(data);
        if(!isDataValid.success){
            return res.status(400).json({
                error : "Invalid data passed"
            })
        }
        const isUsernameAvailable = await client.user.findFirst({
            where : {
                username : data.username
            }
        })
        if(isUsernameAvailable){
            return res.status(400).json({
                error : "Username already taken",
            })
        }
        const isUserAlreadyExists = await client.user.findFirst({
            where : {
                email : data.email
            }
        })
        if(isUserAlreadyExists){
            return res.status(400).json({
                error : "User already exists with this email"
            })
        }
        const hashedPassword = await bcrypt.hash(data.password, 10);
        const newUser = await client.user.create({
            data : {
                username : data.username,
                email : data.email,
                password : hashedPassword
            }
        })
        return res.status(201).json({
            success : true,
            message : "User created successfully",
            data : newUser
        })
    } catch (error : any) {
        console.log('Error creating user', error.message);
        return res.status(500).json({
            error : "Internal server Error"
        })
    }
    
}

export async function signin(req : Request, res: Response) : Promise<any> {
    try {
        const data = req.body;
        const isDataValid = signinSchema.safeParse(data);
        if(!isDataValid.success){
            return res.status(400).json({
                error : "Invalid data passed"
            })
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
                return res.status(400).json({
                    error : "Incorrect credentials"
                })
            }
            const userDataForRequest : requestUser = {
                _id : user.id,
                email : user.email,
                username : user.username
            }
            const token = generateToken(userDataForRequest, req, res);
            req.user = {
                _id : user.id,
                username : user.username,
                email : user.email,
            };
            return res.status(201).json({
                sucess : true,
                message : "User signed in",
                data : {
                    token : token,
                    user : req.user
                }
            })

        }else{
            return res.status(404).json({
                error : "User not found"
            })
        }
    } catch (error : any) {
        console.log("Error in signin route", error.message);
        return res.status(500).json({
            error : "Internal server error"
        })
    }
    
}