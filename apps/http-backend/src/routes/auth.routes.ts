import { Router } from "express";
import { signin, signout, signup } from "../controllers/auth.controller.js";


const router: Router = Router();

router.post('/signup', signup);
router.post('/signin', signin);
router.post('/logout', signout);



export default router;