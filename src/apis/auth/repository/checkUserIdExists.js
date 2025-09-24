import { supabase } from '../../../db/supabase-client.js';

/**
 * userId로 기존 사용자가 존재하는지 확인합니다.
 * @param {string} userId - 확인할 사용자 ID
 * @returns {Promise<boolean>} 중복 여부 (true: 중복됨, false: 사용 가능)
 * @throws {Error} 데이터베이스 에러 발생 시
 */
export const checkUserIdExists = async (userId) => {
  if (!userId) {
    throw new Error('사용자 ID가 필요합니다.');
  }

  // Supabase Auth 테이블에서 이메일 형태로 조회
  const email = `${userId}@clip.com`;
  const { data, error } = await supabase.auth.admin.getUserByEmail(email);

  if (error) {
    // 사용자를 찾을 수 없는 경우는 정상적인 상황
    if (error.message.includes('User not found')) {
      return false; // 중복되지 않음 (사용 가능)
    }
    throw new Error(`사용자 ID 중복 확인 실패: ${error.message}`);
  }

  // 사용자가 존재하는 경우
  return data.user ? true : false; // 중복됨
};
