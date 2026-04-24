import { supabase } from "../config/supabase";

export const getReporteData = async (inicio?: string, fin?: string) => {
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
  if (error) throw error;
  return data;
};