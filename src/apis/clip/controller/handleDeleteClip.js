import { createErrorResponse, createSuccessResponse } from '../../../utils/responseFormatter.js';
import { deleteClip } from '../service/deleteClip.js';

/**
 * 클립 삭제 컨트롤러
 * @param {Object} req - Express request 객체
 * @param {Object} res - Express response 객체
 */
export const handleDeleteClip = async (req, res) => {
  try {
    const { clipId } = req.params;

    // 클립 삭제 서비스 호출
    const result = await deleteClip(clipId);

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
