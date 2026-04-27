import { Router } from "express";
import {
  getAllReservas,
  postReserva,
  updateReservaEstadoPago
} from "../controllers/reserva.controller";

const router = Router();

router.get("/", getAllReservas);
router.post("/", postReserva);
router.patch("/:id/estado-pago", updateReservaEstadoPago);

export default router;