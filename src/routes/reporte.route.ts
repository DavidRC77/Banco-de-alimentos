import { Router } from "express";
import { getReporteFinanciero } from "../controllers/reporte.controller";

const router = Router();
router.get("/", getReporteFinanciero);

export default router;