import { supabase } from "../config/supabase";

export interface Reporte {
  id: number;
  fecha: string;
  monto: number;
  estado_pago: string;
  clientes?: { nombre: string };
  canchas?: { nombre: string };
}

export const getReporteFinanciero = async (inicio?: string, fin?: string): Promise<Reporte[]> => {
  let query = supabase
    .from("reservas")
    .select(`
      id,
      fecha,
      monto,
      estado_pago,
      clientes (nombre),
      canchas (nombre)
    `);

  if (inicio && fin) {
    query = query.gte("fecha", inicio).lte("fecha", fin);
  }

  const { data, error } = await query.order("fecha", { ascending: false });

  if (error) {
    throw new Error(`Error obteniendo reporte: ${error.message}`);
  }

  return data || [];
};
