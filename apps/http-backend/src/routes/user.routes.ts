import { RequestHandler, Router } from "express";
import { createRoom, fetchChats, getAllRooms, getUserCreatedRooms, searchUsers, verifySlug } from "../controllers/user.controller.js";
import { verifyToken } from "@slates/backend-common/config";


const router : Router = Router();


router.use(verifyToken as RequestHandler);
router.post('/room', createRoom);
router.get('/chats/:roomId', fetchChats);
router.get('/room/:slug', verifySlug);
router.get('/search', searchUsers);
router.get('/myRooms', getUserCreatedRooms);
router.get('/getAllRooms', getAllRooms);


export default router;