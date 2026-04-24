import { Router } from "express";
import { getAllCanchas } from "../controllers/cancha.controller";

const router = Router();
router.get("/", getAllCanchas);

export default router;