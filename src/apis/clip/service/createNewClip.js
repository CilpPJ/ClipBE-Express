import { CustomError } from '../../../utils/errors.js';
import { createClip } from '../repository/createClip.js';
import { createTag } from '../repository/createTag.js';
import { findTagByName } from '../repository/findTagByName.js';

/**
 * 새로운 클립을 생성합니다.
 * @param {Object} clipData - 클립 생성 데이터
 * @param {string} clipData.title - 클립 제목
 * @param {string} clipData.url - 클립 URL
 * @param {string} clipData.tagName - 태그 이름
 * @param {string} clipData.userId - 사용자 ID
 * @param {string} [clipData.memo] - 클립 메모 (선택사항)
 * @param {string} [clipData.thumbnail] - 썸네일 URL (선택사항)
 * @returns {Promise<Object>} 생성된 클립 데이터
 * @throws {CustomError} 비즈니스 로직 에러 발생 시
 */
export const createNewClip = async (clipData) => {
  // 필수 필드 검증
  if (!clipData.title?.trim()) {
    throw new CustomError('클립 제목은 필수입니다.', 400);
  }

  if (!clipData.url?.trim()) {
    throw new CustomError('클립 URL은 필수입니다.', 400);
  }

  if (!clipData.tagName?.trim()) {
    throw new CustomError('태그는 필수입니다.', 400);
  }

  if (!clipData.userId?.trim()) {
    throw new CustomError('사용자 ID는 필수입니다.', 400);
  }

  // URL 형식 검증
  try {
    new URL(clipData.url);
  } catch {
    throw new CustomError('올바른 URL 형식이 아닙니다.', 400);
  }

  // 태그 이름으로 태그 ID 조회 또는 생성
  const trimmedTagName = clipData.tagName.trim();
  const trimmedUserId = clipData.userId.trim();
  const userToken = clipData.userToken;

  let tag = await findTagByName(trimmedTagName, trimmedUserId);
  if (!tag) {
    // 태그가 없으면 새로 생성
    try {
      tag = await createTag(trimmedTagName, trimmedUserId, userToken);
    } catch (createError) {
      // 에러의 실제 원인을 포함한 에러 메시지 생성
      const errorDetail = `원본 에러: ${createError.message}`;

      // 동시 생성으로 인한 중복 오류인 경우 다시 조회
      if (createError.message.includes('이미 존재하는 태그입니다')) {
        tag = await findTagByName(trimmedTagName, trimmedUserId);
        if (!tag) {
          throw new CustomError(`태그 처리 중 오류가 발생했습니다. ${errorDetail}`, 500);
        }
      } else {
        throw new CustomError(`태그 생성 중 오류가 발생했습니다. ${errorDetail}`, 500);
      }
    }
  }

  // 클립 데이터 정제 (camelCase로 Repository에 전달)
  const cleanedClipData = {
    title: clipData.title.trim(),
    url: clipData.url.trim(),
    tagId: tag.id,
    userId: trimmedUserId,
    memo: clipData.memo?.trim() || null,
    thumbnail: clipData.thumbnail?.trim() || null,
  };

  try {
    const newClip = await createClip(cleanedClipData);

    // 응답 데이터 간소화 및 camelCase 변환
    return {
      id: newClip.id,
      tagId: newClip.tag_id,
      message: '클립이 성공적으로 생성되었습니다.',
    };
  } catch (dbError) {
    if (dbError.message.includes('foreign key constraint')) {
      throw new CustomError('존재하지 않는 태그 또는 사용자입니다.', 400);
    }
    throw new CustomError('클립 생성 중 오류가 발생했습니다.', 500);
  }
};
