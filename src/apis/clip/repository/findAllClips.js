import { supabase } from '../../../db/supabase-client.js';
import { CustomError } from '../../../utils/errors.js';

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
    console.error('Supabase error:', error);
    throw new CustomError('데이터베이스 조회에 실패했습니다.', 500);
  }
  return data;
};
