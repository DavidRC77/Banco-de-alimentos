import { supabase } from "../config/supabase";

export interface Cancha {
  id: number;
  nombre: string;
  tipo: string;
  ubicacion?: string;
}

export const getCanchas = async (): Promise<Cancha[]> => {
  const { data, error } = await supabase
    .from("canchas")
    .select("*")
    .order("nombre", { ascending: true });

  if (error) {
    throw new Error(`Error obteniendo canchas: ${error.message}`);
  }

  return data || [];
};

export const getCanchaById = async (id: number): Promise<Cancha | null> => {
  const { data, error } = await supabase
    .from("canchas")
    .select("*")
    .eq("id", id)
    .single();

  if (error && error.code !== "PGRST116") {
    throw new Error(`Error obteniendo cancha: ${error.message}`);
  }

  return data || null;
};

export const createCancha = async (cancha: Omit<Cancha, "id">): Promise<Cancha> => {
  const { data, error } = await supabase
    .from("canchas")
    .insert([cancha])
    .select()
    .single();

  if (error) {
    throw new Error(`Error creando cancha: ${error.message}`);
  }

  return data as Cancha;
};

export const deleteCancha = async (id: number) => {
  const { error } = await supabase.from("canchas").delete().eq("id", id);
  if (error) throw error;
};

export const updateCancha = async (id: number, data: any) => {
  const { error } = await supabase.from("canchas").update(data).eq("id", id);
  if (error) throw error;
};