import { createClient } from '@supabase/supabase-js';

import { supabase } from '../../../db/supabase-client.js';

/**
 * 태그 이름으로 태그 ID를 조회합니다.
 * @param {string} tagName - 조회할 태그 이름
 * @param {string} userId - 태그를 소유한 사용자 ID
 * @returns {Promise<Object|null>} 태그 데이터 (id, name 포함) 또는 null
 * @throws {Error} 데이터베이스 에러 발생 시
 */
export const findTagByName = async (tagName, userId, userToken) => {
  const client = userToken
    ? createClient(process.env.SUPABASE_URL, process.env.SUPABASE_ANON_KEY, {
      global: { headers: { Authorization: `Bearer ${userToken}` } },
    })
    : supabase;

  const { data, error } = await client
    .from('tags')
    .select('id, name')
    .eq('name', tagName)
    .eq('user_id', userId)
    .single();

  if (error) {
    if (error.code === 'PGRST116') {
      // No rows found - 태그가 존재하지 않음
      return null;
    }
    throw new Error(`태그 조회 실패: ${error.message}`);
  }

  return data;
};
