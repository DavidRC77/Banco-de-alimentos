import { Router } from "express";
import {
  getAllReservas,
  postReserva
} from "../controllers/reserva.controller";

const router = Router();

router.get("/", getAllReservas);
router.post("/", postReserva);

export default router;