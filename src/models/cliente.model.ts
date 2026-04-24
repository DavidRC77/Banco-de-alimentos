import { supabase } from "../config/supabase";

export interface Cliente {
  id: number;
  nombre: string;
  telefono?: string;
  email?: string;
}

export const getClientes = async (): Promise<Cliente[]> => {
  const { data, error } = await supabase
    .from("clientes")
    .select("*")
    .order("nombre", { ascending: true });

  if (error) {
    throw new Error(`Error obteniendo clientes: ${error.message}`);
  }

  return data || [];
};

export const getClienteById = async (id: number): Promise<Cliente | null> => {
  const { data, error } = await supabase
    .from("clientes")
    .select("*")
    .eq("id", id)
    .single();

  if (error && error.code !== "PGRST116") {
    throw new Error(`Error obteniendo cliente: ${error.message}`);
  }

  return data || null;
};

export const createCliente = async (cliente: Omit<Cliente, "id">): Promise<Cliente> => {
  const { data, error } = await supabase
    .from("clientes")
    .insert([cliente])
    .select()
    .single();

  if (error) {
    throw new Error(`Error creando cliente: ${error.message}`);
  }

  return data as Cliente;
};

export const deleteCliente = async (id: number) => {
  const { error } = await supabase.from("clientes").delete().eq("id", id);
  if (error) throw error;
};

export const updateCliente = async (id: number, data: any) => {
  const { error } = await supabase.from("clientes").update(data).eq("id", id);
  if (error) throw error;
};