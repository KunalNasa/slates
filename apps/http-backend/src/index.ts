import express, { Request, RequestHandler, Response } from "express"
import {generateToken, verifyToken } from "@slates/backend-common/config"
import {signupSchema} from "@slates/common/schemas"

const app = express();

app.post('/signup', async (req : Request, res: Response) : Promise<any> => {
    const data = signupSchema.safeParse(req.body);

    if(!data.success){
        return res.json({
            error : "data invalidate"
        })
    }
    return res.json({
        message :"Hello"
    });
})

app.post('/signin', (req : Request, res: Response) => {
    res.send("Hello");
    const token = generateToken("123", req);
    console.log(token);
})
app.post('/room',  verifyToken as RequestHandler, (req : Request, res: Response) => {

})
app.listen(4000, () => {
    console.log("App started on port 3000");
})
