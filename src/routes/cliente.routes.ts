import { Router } from "express";
import { getAllClientes, createCliente, removeCliente, modifyCliente } from "../controllers/cliente.controller";

const router = Router();
router.get("/", getAllClientes);
router.post("/", createCliente);
router.delete("/:id", removeCliente);
router.put("/:id", modifyCliente);

export default router;