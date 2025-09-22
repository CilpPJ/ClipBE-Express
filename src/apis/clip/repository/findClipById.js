import { supabase } from '../../../db/supabase-client.js';
import { CustomError } from '../../../utils/errors.js';

export const findClipById = async (clipId) => {
  const { data, error } = await supabase
    .from('clips')
    .select(
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
    )
    .eq('id', clipId)
    .single();

  if (error) {
    if (error.code === 'PGRST116') {
      // No rows returned
      throw new CustomError('클립을 찾을 수 없습니다.', 404);
    }
    console.error('Supabase error:', error);
    throw new CustomError('데이터베이스 조회에 실패했습니다.', 500);
  }
  return data;
};
