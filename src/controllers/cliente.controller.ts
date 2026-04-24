import { Request, Response } from "express";
import * as ClienteModel from "../models/cliente.model";

export const getAllClientes = async (req: Request, res: Response) => {
  try {
    const clientes = await ClienteModel.getClientes();
    res.json(clientes);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};
export const removeCliente = async (req: Request, res: Response) => {
  try {
    await ClienteModel.deleteCliente(parseInt(req.params.id));
    res.json({ message: "Eliminado" });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const modifyCliente = async (req: Request, res: Response) => {
  try {
    await ClienteModel.updateCliente(parseInt(req.params.id), req.body);
    res.json({ message: "Actualizado" });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};