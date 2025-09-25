import { CustomError } from '../../../utils/errors.js';
import { findClipById } from '../repository/findClipById.js';

/**
 * 특정 클립의 상세 정보를 조회합니다.
 * @param {number} clipId - 조회할 클립 ID
 * @param {string|null} userId - 클립을 조회하는 사용자 ID (선택사항)
 * @param {string|null} userToken - 사용자 JWT 토큰 (선택사항)
 * @returns {Promise<Object>} 클립 상세 정보
 * @throws {CustomError} 비즈니스 로직 에러 발생 시
 */
export const getClipById = async (clipId, userId, userToken) => {
  // 매개변수 유효성 검사
  if (!clipId) {
    throw new CustomError('클립 ID는 필수입니다.', 400);
  }

  // userId는 선택사항으로 변경 - 인증 없이도 공개 클립 조회 가능

  // clipId가 숫자인지 확인
  const numericClipId = parseInt(clipId, 10);
  // 문자열이 정수 형태가 아니거나, 변환된 숫자가 0 이하인 경우
  if (isNaN(numericClipId) || numericClipId <= 0 || String(clipId) !== numericClipId.toString()) {
    throw new CustomError('올바른 클립 ID 형식이 아닙니다.', 400);
  }

  try {
    // Repository에서 클립 조회
    const clipData = await findClipById(numericClipId, userId, userToken);

    if (!clipData) {
      throw new CustomError('클립을 찾을 수 없습니다.', 404);
    }

    // 응답 데이터 변환 (snake_case → camelCase)
    return {
      clipId: clipData.id,
      title: clipData.title,
      url: clipData.url,
      memo: clipData.memo,
      thumbnail: clipData.thumbnail,
      isPublic: clipData.is_public,
      createdAt: clipData.created_at,
      updatedAt: clipData.updated_at,
      tags: (() => {
        const tagsArray = Array.isArray(clipData.tags) ? clipData.tags : clipData.tags ? [clipData.tags] : [];
        return tagsArray.map((tag) => ({
          tagId: tag.tag_id ?? tag.id,
          tagName: tag.tag_name ?? tag.name,
        }));
      })(),
    };
  } catch (error) {
    // Repository에서 발생한 에러를 Service 에러로 변환
    if (error instanceof CustomError) {
      throw error;
    }

    // 예상치 못한 에러 처리
    throw new CustomError('서버 내부 오류가 발생했습니다.', 500);
  }
};
