import { supabase } from '../../../db/supabase-client.js';

/**
 * user_id로 profiles 테이블에서 유저 정보를 찾습니다.
 * @param {string} userId - 유저의 고유 ID (UUID)
 */
export const findProfileByUserId = async (userId) => {
  const { data, error } = await supabase.from('profiles').select('nickname').eq('id', userId).single();

  if (error) {
    // 일치하는 프로필이 없어도 에러가 발생할 수 있으므로, 로그만 남기고 null 반환
    console.error('findProfileByUserId Error:', error);
    return null;
  }
  return data;
};
