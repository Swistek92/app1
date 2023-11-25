import { Router } from "express";
import * as controller from "../controllers/index";

export const router = Router();

router.get("/helloapi", controller.helloapi);

router.post("/openai", controller.openai);
router.post("/moderation", controller.moderation);
router.post("/blogger", controller.blogger);
router.post("/liar", controller.liar);
router.post("/inprompt", controller.inprompt);
router.post("/embedding", controller.embedding);
router.post("/whisper", controller.whisper);
router.post("/functions", controller.functions);
router.post("/rodo", controller.rodo);
router.post("/scraper", controller.scraper);
router.post("/whoami", controller.whoami);
router.post("/search", controller.search);
router.post("/people", controller.people);
router.post("/knowledge", controller.knowledge);
