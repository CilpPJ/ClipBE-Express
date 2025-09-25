import { createErrorResponse, createSuccessResponse } from '../../../utils/responseFormatter.js';
import { getClipById } from '../service/getClipById.js';

/**
 * 특정 클립 상세 조회 API 핸들러
 * @param {Object} req - Express 요청 객체
 * @param {Object} res - Express 응답 객체
 */
export const handleGetClipById = async (req, res) => {
  try {
    const { clipId } = req.params;
    const userId = req.user?.id; // 인증 미들웨어에서 주입된 사용자 ID
    const authHeader = req.headers.authorization;
    const userToken = authHeader?.match(/^Bearer\s+(.+)$/i)?.[1];

    // Service 계층 호출
    const clipData = await getClipById(clipId, userId, userToken);

    // 성공 응답 반환
    const successResponse = createSuccessResponse(clipData);
    res.status(200).json(successResponse);
  } catch (error) {
    // 에러 응답 반환
    const errorResponse = createErrorResponse(error.name || 'INTERNAL_ERROR', error.message);
    const statusCode = error.statusCode || 500;
    res.status(statusCode).json(errorResponse);
  }
};
