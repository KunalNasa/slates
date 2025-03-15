import { RequestHandler, Router } from "express";
import { createRoom, fetchChats, verifySlug } from "../controllers/user.controller.js";
import { verifyToken } from "@slates/backend-common/config";


const router : Router = Router();


// router.use(verifyToken as RequestHandler);
router.post('/room', createRoom);
router.get('/chats/:roomId', fetchChats);
router.get('/room/:slug', verifySlug);

export default router;