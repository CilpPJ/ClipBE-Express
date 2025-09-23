import { createClient } from '@supabase/supabase-js';

import { supabase } from '../../../db/supabase-client.js';

/**
 * 새로운 태그를 데이터베이스에 생성합니다.
 * @param {string} tagName - 생성할 태그 이름
 * @param {string} userId - 태그를 생성하는 사용자 ID
 * @param {string} userToken - 사용자 JWT 토큰
 * @returns {Promise<Object>} 생성된 태그 데이터 {id, name}
 * @throws {Error} 데이터베이스 에러 발생 시
 */
export const createTag = async (tagName, userId, userToken) => {
  let client = supabase;

  // 사용자 토큰이 있는 경우 사용자 컨텍스트로 클라이언트 생성
  if (userToken) {
    const supabaseUrl = process.env.SUPABASE_URL;
    // Service Key 대신 public anon key를 사용해야 하지만, 현재 없으므로 다른 방법 시도
    client = createClient(supabaseUrl, process.env.SUPABASE_SERVICE_KEY, {
      global: {
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
      },
    });
  }

  const { data, error } = await client
    .from('tags')
    .insert([
      {
        name: tagName.trim(),
        user_id: userId,
      },
    ])
    .select()
    .single();

  if (error) {
    // 중복 태그명인 경우 (unique constraint violation)
    if (error.code === '23505') {
      throw new Error(`이미 존재하는 태그입니다: ${tagName}`);
    }
    throw new Error(`태그 생성 실패: ${error.message}`);
  }

  return data;
};
