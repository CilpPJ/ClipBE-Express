import { CustomError } from '../../../utils/errors.js';
import { checkNicknameExists } from '../repository/checkNicknameExists.js';

/**
 * 닉네임 중복 확인 서비스
 * @param {string} nickname - 확인할 닉네임
 * @returns {Promise<Object>} 중복 확인 결과
 * @throws {CustomError} 비즈니스 로직 에러 발생 시
 */
export const checkNicknameDuplication = async (nickname) => {
  // 입력값 검증
  if (!nickname) {
    throw new CustomError('닉네임은 필수입니다.', 400);
  }

  if (typeof nickname !== 'string') {
    throw new CustomError('닉네임은 문자열이어야 합니다.', 400);
  }

  // 닉네임 길이 검증
  const trimmedNickname = nickname.trim();
  if (trimmedNickname.length < 2) {
    throw new CustomError('닉네임은 2자 이상이어야 합니다.', 400);
  }

  if (trimmedNickname.length > 10) {
    throw new CustomError('닉네임은 10자 이하여야 합니다.', 400);
  }

  // 닉네임 형식 검증 (한글, 영문자, 숫자만 허용)
  const nicknameRegex = /^[가-힣a-zA-Z0-9]+$/;
  if (!nicknameRegex.test(trimmedNickname)) {
    throw new CustomError('닉네임은 한글, 영문자, 숫자만 사용할 수 있습니다.', 400);
  }

  try {
    // 중복 확인 실행
    const isDuplicated = await checkNicknameExists(trimmedNickname);

    const message = isDuplicated ? '이미 사용 중인 닉네임입니다.' : '사용할 수 있는 닉네임입니다.';

    return {
      isDuplicated,
      message,
    };
  } catch (error) {
    // Repository 에러를 Service 에러로 변환
    if (error.message.includes('닉네임 중복 확인 실패')) {
      throw new CustomError('닉네임 중복 확인 중 오류가 발생했습니다.', 500);
    }
    throw error; // CustomError는 그대로 전달
  }
};