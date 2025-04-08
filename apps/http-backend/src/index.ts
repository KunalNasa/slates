import express from "express"
import dotenv from "dotenv"
import authRoutes from './routes/auth.routes.js'
import userRoutes from './routes/user.routes.js'
import cors from "cors"
import cookieParser from "cookie-parser"

dotenv.config();


const app = express();
app.use(express.json());
app.use(cors({
    origin: 'http://localhost:3000',
    credentials: true
}));
app.use(cookieParser());
app.use('/api/auth', authRoutes);
app.use('/api/user', userRoutes);

app.listen(4000, () => {
    console.log("App started on port 4000");
})
