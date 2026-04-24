import { supabase } from "../config/supabase";

export const getConfig = async () => {
  const { data, error } = await supabase.from("configuracion").select("*");
  if (error) throw error;
  return data;
};

export const updateConfig = async (clave: string, valor: string) => {
  const { data, error } = await supabase
    .from("configuracion")
    .update({ valor })
    .eq("clave", clave);
  if (error) throw error;
  return data;
};