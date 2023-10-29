import { Router } from "express";
import * as controller from "../controllers/index";

export const router = Router();

router.get("/helloapi", controller.helloapi);

router.post("/openai", controller.openai);
router.post("/moderation", controller.moderation);
