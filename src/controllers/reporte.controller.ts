import { Request, Response } from "express";
import * as ReporteModel from "../models/reporte.model";

export const getReporteFinanciero = async (req: Request, res: Response) => {
  try {
    const { inicio, fin } = req.query;

    const data = await ReporteModel.getReporteFinanciero(
      inicio as string | undefined,
      fin as string | undefined
    );

    res.json(data);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};