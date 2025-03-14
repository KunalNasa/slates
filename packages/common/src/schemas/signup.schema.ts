import z from "zod";

export const signupSchema = z.object({
    username : z.string(),
    password : z.string(),
    email : z.string()
})