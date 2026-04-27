import { Request, Response } from "express";
import * as ReservaModel from "../models/reserva.model";

export const getAllReservas = async (req: Request, res: Response) => {
  try {
    const { all } = req.query;
    let reservas;
    
    if (all === 'true') {
      reservas = await ReservaModel.getReservasAll();
    } else {
      reservas = await ReservaModel.getReservas();
    }
    
    res.json(reservas);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const postReserva = async (req: Request, res: Response) => {
  try {
    const { cancha_id, fecha, hora_inicio, hora_fin, monto, estado_pago } = req.body;
    const hasConflict = await ReservaModel.checkConflict(cancha_id, fecha, hora_inicio, hora_fin);
    
    if (hasConflict) {
      return res.status(409).json({ error: "La cancha ya está reservada en ese horario." });
    }

    const nuevaReserva = await ReservaModel.createReserva({
      ...req.body,
      monto: monto || 0,
      estado_pago: estado_pago || 'pendiente'
    });
    res.status(201).json(nuevaReserva);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const updateReservaEstadoPago = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { estado_pago } = req.body;

    if (!estado_pago) {
      return res.status(400).json({ error: "El estado de pago es requerido" });
    }

    const reservaActualizada = await ReservaModel.updateReservaEstadoPago(parseInt(id), estado_pago);
    res.json(reservaActualizada);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};