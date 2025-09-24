import { supabase } from '../../../db/supabase-client.js';

/**
 * nickname으로 기존 사용자가 존재하는지 확인합니다.
 * @param {string} nickname - 확인할 닉네임
 * @returns {Promise<boolean>} 중복 여부 (true: 중복됨, false: 사용 가능)
 * @throws {Error} 데이터베이스 에러 발생 시
 */
export const checkNicknameExists = async (nickname) => {
  if (!nickname) {
    throw new Error('닉네임이 필요합니다.');
  }

  // profiles 테이블에서 닉네임 조회
  const { data, error } = await supabase
    .from('profiles')
    .select('id')
    .eq('nickname', nickname)
    .single();

  if (error) {
    // 데이터를 찾을 수 없는 경우는 정상적인 상황 (PGRST116)
    if (error.code === 'PGRST116') {
      return false; // 중복되지 않음 (사용 가능)
    }
    throw new Error(`닉네임 중복 확인 실패: ${error.message}`);
  }

  // 닉네임이 존재하는 경우
  return data ? true : false; // 중복됨
};