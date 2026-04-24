import { Router } from "express";
import { getAllClientes, removeCliente, modifyCliente } from "../controllers/cliente.controller";

const router = Router();
router.get("/", getAllClientes);
router.delete("/:id", removeCliente);
router.put("/:id", modifyCliente);

export default router;