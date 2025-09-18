import { supabase } from '../../../db/supabase-client.js';

export const findAllClips = async () => {
  const { data, error } = await supabase.from('clips').select(
    `
      title,
      tag_id,
      url,
      memo,
      created_at,
      thumbnail,
      tags (
        name
      )
    `
  );

  if (error) {
    throw error;
  }
  return data;
};
