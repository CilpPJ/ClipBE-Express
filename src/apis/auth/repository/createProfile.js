import { supabase } from '../../../db/supabase-client.js';

export const createProfile = async ({ id, nickname }) => {
  const { data, error } = await supabase.from('profiles').insert([{ id, nickname }]).select();

  if (error) {
    throw error;
  }
  return data[0];
};
