import { Request, Response } from "express";
import * as ConfigModel from "../models/configuracion.model";

export const getAllConfig = async (req: Request, res: Response) => {
  try {
    const config = await ConfigModel.getConfig();
    res.json(config);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const patchConfig = async (req: Request, res: Response) => {
  try {
    const { clave, valor } = req.body;
    await ConfigModel.updateConfig(clave, valor);
    res.json({ message: "Configuración actualizada" });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};