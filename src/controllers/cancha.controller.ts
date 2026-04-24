import { Request, Response } from "express";
import * as CanchaModel from "../models/cancha.model";

export const getAllCanchas = async (req: Request, res: Response) => {
  try {
    const canchas = await CanchaModel.getCanchas();
    res.json(canchas);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};