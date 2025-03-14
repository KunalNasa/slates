import express, { Request, RequestHandler, Response } from "express"
import {verifyToken } from "@slates/backend-common/config"
import dotenv from "dotenv"
import authRoutes from './routes/auth.routes.js'
import userRoutes from './routes/user.routes.js'



dotenv.config();
const app = express();
app.use(express.json());


app.use('/api/auth', authRoutes);
app.use('/api/user', userRoutes);







// app.post('/signup', async (req : Request, res: Response) : Promise<any> => {
//     const data = req.body;
//     const isValid = signupSchema.safeParse(req.body);
//     if(!isValid.success){
//         return res.json({
//             error : "data invalidate"
//         })
//     }
//     const newUser = client.user.create({
//         data : {
//             username : data.username,
//             password : data.password,

//         }
//     })
//     return res.json({
//         message :"Hello"
//     });
// })
// app.use('/api/user', userRoutes);
// app.post('/signin', (req : Request, res: Response) => {
//     res.send("Hello");
//     const token = generateToken("123", req);
//     console.log(token);
// })


app.post('/room',  verifyToken as RequestHandler, (req : Request, res: Response) => {
    
})



app.listen(4000, () => {
    console.log("App started on port 4000");
})
