import { CustomError } from '../../../utils/errors.js';
import { deleteClipById } from '../repository/deleteClipById.js';

/**
 * 클립을 삭제합니다.
 * @param {number} clipId - 삭제할 클립의 고유 ID
 * @param {string} userId - 클립 소유자의 사용자 ID
 * @returns {Promise<Object>} 삭제 성공 메시지
 * @throws {CustomError} 클립을 찾을 수 없거나 삭제에 실패한 경우
 */
export const deleteClip = async (clipId, userId) => {
  // 클립 ID 유효성 검사
  if (!clipId || isNaN(clipId) || clipId <= 0) {
    throw new CustomError('INVALID_CLIP_ID', '유효하지 않은 클립 ID입니다.', 400);
  }

  // 사용자 ID 유효성 검사
  if (!userId) {
    throw new CustomError('INVALID_USER_ID', '유효하지 않은 사용자 ID입니다.', 400);
  }

  // 클립 삭제 실행 (소유자 검증 포함)
  const deletedClip = await deleteClipById(Number(clipId), userId);

  return {
    message: '클립이 성공적으로 삭제되었습니다.',
    deletedClipId: deletedClip.id,
    deletedClipTitle: deletedClip.title,
  };
};
