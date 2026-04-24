import { supabase } from "../config/supabase";

export interface Configuracion {
  clave: string;
  valor: string;
}

export const getConfig = async (): Promise<Configuracion[]> => {
  const { data, error } = await supabase
    .from("configuracion")
    .select("*");

  if (error) {
    throw new Error(`Error obteniendo configuración: ${error.message}`);
  }

  return data || [];
};

export const updateConfig = async (clave: string, valor: string): Promise<void> => {
  const { error } = await supabase
    .from("configuracion")
    .update({ valor })
    .eq("clave", clave);

  if (error) {
    throw new Error(`Error actualizando configuración: ${error.message}`);
  }
};
