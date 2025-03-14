import { RequestHandler, Router } from "express";
import { createRoom } from "../controllers/user.controller.js";
import { verifyToken } from "@slates/backend-common/config";


const router : Router = Router();


router.post('/room', verifyToken as RequestHandler,createRoom);

export default router;