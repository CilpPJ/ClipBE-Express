import { createClient } from '@supabase/supabase-js';

import { supabase } from '../../../db/supabase-client.js';

/**
 * 클립 ID로 특정 클립의 상세 정보를 조회합니다.
 * @param {number} clipId - 조회할 클립 ID
 * @param {string|null} userId - 클립을 조회하는 사용자 ID (선택사항)
 * @param {string|null} userToken - 사용자 JWT 토큰 (선택사항)
 * @returns {Promise<Object|null>} 클립 상세 정보 또는 null
 * @throws {Error} 데이터베이스 에러 발생 시
 */
export const findClipById = async (clipId, userId, userToken) => {
  let client = supabase;

  // 사용자 토큰이 있는 경우 사용자 컨텍스트로 클라이언트 생성
  if (userToken) {
    client = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_ANON_KEY, {
      global: { headers: { Authorization: `Bearer ${userToken}` } },
    });
  }

  try {
    // 우선 간단한 쿼리로 테스트 - maybeSingle()로 null 허용
    const { data, error } = await client.from('clips').select('*').eq('id', clipId).maybeSingle();

    if (error) {
      throw new Error(`클립 조회 실패: ${error.message}`);
    }

    return data; // null일 수 있음 (클립이 존재하지 않는 경우)
  } catch (error) {
    throw new Error(`클립 조회 중 오류가 발생했습니다: ${error.message}`);
  }
};
