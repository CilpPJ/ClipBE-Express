import { CustomError } from '../../../utils/errors.js';
import { createTag } from '../repository/createTag.js';
import { findTagByName } from '../repository/findTagByName.js';
import { updateClipById } from '../repository/updateClipById.js';

/**
 * 클립을 수정합니다.
 * @param {number} clipId - 수정할 클립의 고유 ID
 * @param {string} userId - 클립 소유자의 사용자 ID
 * @param {Object} updateFields - 수정할 필드들
 * @param {string} [updateFields.title] - 클립 제목
 * @param {string} [updateFields.url] - 클립 URL
 * @param {string} [updateFields.tagName] - 태그 이름
 * @param {string} [updateFields.memo] - 클립 메모
 * @returns {Promise<Object>} 수정 성공 메시지
 * @throws {CustomError} 클립을 찾을 수 없거나 수정에 실패한 경우
 */
export const updateClip = async (clipId, userId, updateFields) => {
  // 클립 ID 유효성 검사
  if (!clipId || isNaN(clipId) || clipId <= 0) {
    throw new CustomError('INVALID_CLIP_ID', '유효하지 않은 클립 ID입니다.', 400);
  }

  // 사용자 ID 유효성 검사
  if (!userId) {
    throw new CustomError('INVALID_USER_ID', '유효하지 않은 사용자 ID입니다.', 400);
  }

  // 수정할 데이터가 없는 경우
  if (!updateFields || Object.keys(updateFields).length === 0) {
    throw new CustomError('NO_UPDATE_DATA', '수정할 데이터가 제공되지 않았습니다.', 400);
  }

  // 유효한 필드만 필터링
  const validFields = ['title', 'url', 'tagName', 'memo'];
  const filteredFields = {};

  for (const [key, value] of Object.entries(updateFields)) {
    if (validFields.includes(key) && value !== undefined && value !== null) {
      filteredFields[key] = typeof value === 'string' ? value.trim() : value;
    }
  }

  if (Object.keys(filteredFields).length === 0) {
    throw new CustomError('NO_VALID_UPDATE_DATA', '유효한 수정 데이터가 없습니다.', 400);
  }

  // 태그 처리
  let tagId = null;
  if (filteredFields.tagName) {
    // 기존 태그 찾기
    const existingTag = await findTagByName(filteredFields.tagName, userId);

    if (existingTag) {
      tagId = existingTag.id;
    } else {
      // 새로운 태그 생성
      const newTag = await createTag(filteredFields.tagName, userId);
      tagId = newTag.id;
    }
  }

  // 수정할 데이터 준비 (DB 컬럼명으로 변환)
  const updateData = {};
  if (filteredFields.title) updateData.title = filteredFields.title;
  if (filteredFields.url) updateData.url = filteredFields.url;
  if (filteredFields.memo) updateData.memo = filteredFields.memo;
  if (tagId) updateData.tag_id = tagId;

  // 클립 수정 실행 (소유자 검증 포함)
  const updatedClip = await updateClipById(Number(clipId), userId, updateData);

  return {
    message: '클립이 성공적으로 수정되었습니다.',
    updatedClipId: updatedClip.id,
    updatedFields: Object.keys(filteredFields),
  };
};
