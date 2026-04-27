import { Router } from "express";
import { getAllCanchas, createCancha, updateCancha, deleteCancha, updateCanchaEstado } from "../controllers/cancha.controller";

const router = Router();
router.get("/", getAllCanchas);
router.post("/", createCancha);
router.put("/:id", updateCancha);
router.delete("/:id", deleteCancha);
router.patch("/:id/estado", updateCanchaEstado);

export default router;