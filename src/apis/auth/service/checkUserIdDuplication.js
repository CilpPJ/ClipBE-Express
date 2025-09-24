import { CustomError } from '../../../utils/errors.js';
import { checkUserIdExists } from '../repository/checkUserIdExists.js';

/**
 * 아이디 중복 확인 서비스
 * @param {string} userId - 확인할 사용자 ID
 * @returns {Promise<Object>} 중복 확인 결과
 * @throws {CustomError} 비즈니스 로직 에러 발생 시
 */
export const checkUserIdDuplication = async (userId) => {
  // 입력값 검증
  if (!userId) {
    throw new CustomError('사용자 ID는 필수입니다.', 400);
  }

  if (typeof userId !== 'string') {
    throw new CustomError('사용자 ID는 문자열이어야 합니다.', 400);
  }

  // 아이디 길이 검증
  const trimmedUserId = userId.trim();
  if (trimmedUserId.length < 4) {
    throw new CustomError('사용자 ID는 4자 이상이어야 합니다.', 400);
  }

  if (trimmedUserId.length > 20) {
    throw new CustomError('사용자 ID는 20자 이하여야 합니다.', 400);
  }

  // 아이디 형식 검증 (영문자, 숫자, 언더스코어만 허용)
  const userIdRegex = /^[a-zA-Z0-9_]+$/;
  if (!userIdRegex.test(trimmedUserId)) {
    throw new CustomError('사용자 ID는 영문자, 숫자, 언더스코어만 사용할 수 있습니다.', 400);
  }

  try {
    // 중복 확인 실행
    const isDuplicated = await checkUserIdExists(trimmedUserId);

    const message = isDuplicated ? '이미 사용 중인 아이디입니다.' : '사용할 수 있는 아이디입니다.';

    return {
      isDuplicated,
      message,
    };
  } catch (error) {
    // Repository 에러를 Service 에러로 변환
    if (error.message.includes('사용자 ID 중복 확인 실패')) {
      throw new CustomError('아이디 중복 확인 중 오류가 발생했습니다.', 500);
    }
    throw error; // CustomError는 그대로 전달
  }
};
