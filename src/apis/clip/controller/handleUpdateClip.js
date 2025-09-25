import { createErrorResponse, createSuccessResponse } from '../../../utils/responseFormatter.js';
import { updateClip } from '../service/updateClip.js';

/**
 * 클립 수정 컨트롤러
 * @param {Object} req - Express request 객체
 * @param {Object} res - Express response 객체
 */
export const handleUpdateClip = async (req, res) => {
  try {
    const { clipId } = req.params;
    const userId = req.user?.id; // 인증 미들웨어에서 제공하는 사용자 정보

    // 사용자 인증 확인
    if (!userId) {
      const errorResponse = createErrorResponse('UNAUTHORIZED', '인증되지 않은 사용자입니다.');
      return res.status(401).json(errorResponse);
    }

    // 요청 본문에서 수정할 필드들 추출
    const { title, url, tagName, memo } = req.body;
    const updateFields = { title, url, tagName, memo };

    // 클립 수정 서비스 호출 (소유자 검증 포함)
    const result = await updateClip(clipId, userId, updateFields);

    // 성공 응답
    const successResponse = createSuccessResponse(result);
    res.status(200).json(successResponse);
  } catch (error) {
    // 에러 응답
    const errorResponse = createErrorResponse(error.name, error.message);
    const statusCode = error.statusCode || 500;
    res.status(statusCode).json(errorResponse);
  }
};
