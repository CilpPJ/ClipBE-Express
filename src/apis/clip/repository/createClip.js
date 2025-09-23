import { supabase } from '../../../db/supabase-client.js';

/**
 * 새로운 클립을 데이터베이스에 저장합니다.
 * @param {Object} clipData - 클립 데이터
 * @param {string} clipData.title - 클립 제목
 * @param {string} clipData.url - 클립 URL
 * @param {number} clipData.tagId - 태그 ID
 * @param {string} clipData.userId - 사용자 ID
 * @param {string} [clipData.memo] - 클립 메모 (선택사항)
 * @param {string} [clipData.thumbnail] - 썸네일 URL (선택사항)
 * @returns {Promise<Object>} 생성된 클립 데이터
 * @throws {Error} 데이터베이스 에러 발생 시
 */
export const createClip = async (clipData) => {
  // 데이터베이스는 snake_case를 사용하므로 변환
  const dbData = {
    title: clipData.title,
    url: clipData.url,
    tag_id: clipData.tagId,
    user_id: clipData.userId,
    memo: clipData.memo,
    thumbnail: clipData.thumbnail,
  };

  const { data, error } = await supabase.from('clips').insert([dbData]).select().single();

  if (error) {
    throw new Error(`클립 생성 실패: ${error.message}`);
  }

  return data;
};
