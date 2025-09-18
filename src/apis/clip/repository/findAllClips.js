import { supabase } from '../../../db/supabase-client.js';

export const findAllClips = async () => {
  const { data, error } = await supabase.from('clips').select('*');

  if (error) {
    throw error;
  }
  return data;
};
