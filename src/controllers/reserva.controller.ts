import { Request, Response } from "express";
import * as ReservaModel from "../models/reserva.model";

export const getAllReservas = async (req: Request, res: Response) => {
  try {
    const reservas = await ReservaModel.getReservas();
    res.json(reservas);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const postReserva = async (req: Request, res: Response) => {
  try {
    const { cancha_id, fecha, hora_inicio, hora_fin } = req.body;
    const hasConflict = await ReservaModel.checkConflict(cancha_id, fecha, hora_inicio, hora_fin);
    
    if (hasConflict) {
      return res.status(409).json({ error: "La cancha ya está reservada en ese horario." });
    }

    const nuevaReserva = await ReservaModel.createReserva(req.body);
    res.status(201).json(nuevaReserva);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};