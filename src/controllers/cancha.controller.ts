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

export const createCancha = async (req: Request, res: Response) => {
  try {
    const { nombre, tipo, ubicacion, precio_por_hora } = req.body;
    if (!nombre || !tipo) {
      return res.status(400).json({ error: "Nombre y tipo son requeridos" });
    }
    const nuevaCancha = await CanchaModel.createCancha({
      nombre,
      tipo,
      ubicacion: ubicacion || "",
      precio_por_hora: precio_por_hora || 120,
      estado: "disponible"
    });
    res.status(201).json(nuevaCancha);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const updateCancha = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    await CanchaModel.updateCancha(parseInt(id), req.body);
    const canchaActualizada = await CanchaModel.getCanchaById(parseInt(id));
    res.json(canchaActualizada);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const deleteCancha = async (req: Request, res: Response) => {
  try {
    await CanchaModel.deleteCancha(parseInt(req.params.id));
    res.json({ message: "Cancha eliminada" });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const updateCanchaEstado = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { estado, fecha_mantenimiento, hora_inicio_mantenimiento, hora_fin_mantenimiento } = req.body;

    if (!estado) {
      return res.status(400).json({ error: "El estado es requerido" });
    }

    const updateData: any = { estado };
    
    if (estado === 'mantenimiento') {
      if (fecha_mantenimiento) updateData.fecha_mantenimiento = fecha_mantenimiento;
      if (hora_inicio_mantenimiento) updateData.hora_inicio_mantenimiento = hora_inicio_mantenimiento;
      if (hora_fin_mantenimiento) updateData.hora_fin_mantenimiento = hora_fin_mantenimiento;
    } else {
      // Limpiar datos de mantenimiento si vuelve a disponible
      updateData.fecha_mantenimiento = null;
      updateData.hora_inicio_mantenimiento = null;
      updateData.hora_fin_mantenimiento = null;
    }

    const canchaActualizada = await CanchaModel.updateCanchaEstado(parseInt(id), updateData);
    res.json(canchaActualizada);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};