import { supabase } from '../../../db/supabase-client.js';
import { CustomError } from '../../../utils/errors.js';

/**
 * 클립 ID와 사용자 ID를 기반으로 클립을 삭제합니다.
 * @param {number} clipId 삭제할 클립의 ID
 * @param {string} userId 클립 소유자의 사용자 ID
 * @returns {Promise<Object>} 삭제된 클립의 기본 정보 (id, title)
 * @throws {CustomError} 클립을 찾을 수 없거나 삭제에 실패한 경우
 */
export const deleteClipById = async (clipId, userId) => {
  const { data, error } = await supabase
    .from('clips')
    .delete()
    .eq('id', clipId)
    .eq('user_id', userId) // 소유자 검증 추가
    .select('id, title')
    .single();

  if (error) {
    if (error.code === 'PGRST116') {
      throw new CustomError('CLIP_NOT_FOUND', '삭제할 클립을 찾을 수 없습니다.', 404);
    }
    throw new CustomError('CLIP_DELETE_ERROR', '클립 삭제 중 오류가 발생했습니다.', 500);
  }

  return data;
};
