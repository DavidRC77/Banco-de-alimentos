import { Router } from "express";
import { getAllConfig, patchConfig } from "../controllers/configuracion.controller";

const router = Router();
router.get("/", getAllConfig);
router.patch("/", patchConfig);

export default router;