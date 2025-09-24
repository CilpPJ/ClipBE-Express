import { supabase } from '../../../db/supabase-client.js';
import { CustomError } from '../../../utils/errors.js';

/**
 * 닉네임 존재 여부를 확인합니다.
 * @param {string} nickname - 확인할 닉네임
 * @returns {Promise<boolean>} 닉네임 존재 여부
 * @throws {Error} 데이터베이스 에러 발생 시
 */
export const checkNicknameExists = async (nickname) => {
  if (!nickname) {
    throw new CustomError('닉네임은 필수입니다.', 400);
  }

  try {
    // profiles 테이블에서 닉네임 중복 확인
    const { data, error } = await supabase.from('profiles').select('id').eq('nickname', nickname).single();

    if (error) {
      // PGRST116: 결과가 없음 (중복되지 않음)
      if (error.code === 'PGRST116') {
        return false;
      }
      throw new Error(`닉네임 중복 확인 실패: ${error.message}`);
    }

    // 데이터가 존재하면 중복됨
    return data !== null;
  } catch (error) {
    if (error.message.includes('닉네임 중복 확인 실패')) {
      throw error;
    }
    throw new Error(`닉네임 중복 확인 중 오류가 발생했습니다: ${error.message}`);
  }
};
