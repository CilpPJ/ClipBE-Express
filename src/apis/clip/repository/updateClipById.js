import { supabase } from '../../../db/supabase-client.js';
import { CustomError } from '../../../utils/errors.js';

/**
 * 클립 ID와 사용자 ID를 기반으로 클립을 수정합니다.
 * @param {number} clipId 수정할 클립의 ID
 * @param {string} userId 클립 소유자의 사용자 ID
 * @param {Object} updateData 수정할 데이터
 * @param {string} [updateData.title] 클립 제목
 * @param {string} [updateData.url] 클립 URL
 * @param {string} [updateData.memo] 클립 메모
 * @param {number} [updateData.tagId] 태그 ID
 * @returns {Promise<Object>} 수정된 클립의 정보
 * @throws {CustomError} 클립을 찾을 수 없거나 수정에 실패한 경우
 */
export const updateClipById = async (clipId, userId, updateData) => {
  const { data, error } = await supabase
    .from('clips')
    .update(updateData)
    .eq('id', clipId)
    .eq('user_id', userId) // 소유자 검증
    .select('id, title, url, memo, tag_id')
    .single();

  if (error) {
    if (error.code === 'PGRST116') {
      throw new CustomError('CLIP_NOT_FOUND', '수정할 클립을 찾을 수 없습니다.', 404);
    }
    throw new CustomError('CLIP_UPDATE_ERROR', '클립 수정 중 오류가 발생했습니다.', 500);
  }

  return data;
};
