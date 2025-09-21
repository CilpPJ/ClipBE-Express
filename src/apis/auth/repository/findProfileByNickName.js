import { supabase } from '../../../db/supabase-client.js';

export const findProfileByNickname = async (nickname) => {
  const { data, error } = await supabase.from('profiles').select('id').eq('nickname', nickname).single();

  if (error && error.code !== 'PGRST116') {
    throw error;
  }
  return data;
};
