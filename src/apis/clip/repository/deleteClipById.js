import { supabase } from '../../../db/supabase-client.js';
import { CustomError } from '../../../utils/errors.js';

/**
 * ID로 클립을 삭제합니다.
 * @param {number} clipId - 삭제할 클립의 고유 ID
 * @returns {Promise<Object>} 삭제된 클립의 기본 정보
 * @throws {CustomError} 클립을 찾을 수 없거나 삭제에 실패한 경우
 */
export const deleteClipById = async (clipId) => {
  const { data, error } = await supabase.from('clips').delete().eq('id', clipId).select('id, title').single();

  if (error) {
    if (error.code === 'PGRST116') {
      throw new CustomError('CLIP_NOT_FOUND', '삭제할 클립을 찾을 수 없습니다.', 404);
    }
    throw new CustomError('CLIP_DELETE_ERROR', error.message, 500);
  }

  return data;
};
