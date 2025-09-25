import { supabase } from '../../../db/supabase-client.js';
import { CustomError } from '../../../utils/errors.js';

export const findProfileByNickname = async (nickname) => {
  const { data, error } = await supabase.from('profiles').select('id').eq('nickname', nickname).maybeSingle();

  if (error) {
    throw new CustomError('PROFILE_QUERY_ERROR', error.message, 500);
  }

  return data;
};
