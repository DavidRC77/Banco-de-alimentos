import { supabase } from "../config/supabase";

export interface Reserva {
  id?: number;
  cliente_id: number;
  cancha_id: number;
  fecha: string;
  hora_inicio: string;
  hora_fin: string;
  monto?: number;
  estado_pago?: string;
  clientes?: { nombre: string };
  canchas?: { nombre: string };
}

export const getReservas = async (fecha?: string): Promise<Reserva[]> => {
  // Si no se proporciona fecha, usar hoy
  const fechaFiltro = fecha || new Date().toISOString().split('T')[0];
  
  const { data, error } = await supabase
    .from("reservas")
    .select(`
      *,
      clientes (nombre),
      canchas (nombre)
    `)
    .eq("fecha", fechaFiltro)
    .order("hora_inicio", { ascending: true });

  if (error) {
    throw new Error(`Error obteniendo reservas: ${error.message}`);
  }

  return (data as any) || [];
};

export const getReservasAll = async (): Promise<Reserva[]> => {
  const { data, error } = await supabase
    .from("reservas")
    .select(`
      *,
      clientes (nombre),
      canchas (nombre)
    `)
    .order("fecha", { ascending: true });

  if (error) {
    throw new Error(`Error obteniendo reservas: ${error.message}`);
  }

  return (data as any) || [];
};

export const checkConflict = async (
  cancha_id: number,
  fecha: string,
  hora_inicio: string,
  hora_fin: string
): Promise<boolean> => {
  const { data, error } = await supabase
    .from("reservas")
    .select("id")
    .eq("cancha_id", cancha_id)
    .eq("fecha", fecha)
    .lt("hora_inicio", hora_fin)
    .gt("hora_fin", hora_inicio)
    .limit(1);

  if (error) {
    throw new Error(`Error verificando conflicto: ${error.message}`);
  }

  return (data?.length ?? 0) > 0;
};

export const createReserva = async (reserva: Reserva): Promise<Reserva> => {
  const { data, error } = await supabase
    .from("reservas")
    .insert([reserva])
    .select(`
      *,
      clientes (nombre),
      canchas (nombre)
    `)
    .single();

  if (error) {
    throw new Error(`Error creando la reserva: ${error.message}`);
  }

  return data as Reserva;
};

export const updateReservaEstadoPago = async (id: number, estado_pago: string): Promise<Reserva> => {
  const { data, error } = await supabase
    .from("reservas")
    .update({ estado_pago })
    .eq("id", id)
    .select(`
      *,
      clientes (nombre),
      canchas (nombre)
    `)
    .single();

  if (error) {
    throw new Error(`Error actualizando estado de pago: ${error.message}`);
  }

  return data as Reserva;
};