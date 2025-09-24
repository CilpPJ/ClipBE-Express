import { createErrorResponse, createSuccessResponse } from '../../../utils/responseFormatter.js';
import { checkUserIdDuplication } from '../service/checkUserIdDuplication.js';

/**
 * 아이디 중복 확인 요청을 처리합니다.
 * @param {Object} req - Express 요청 객체
 * @param {Object} res - Express 응답 객체
 */
export const handleUserIdDuplication = async (req, res) => {
  try {
    const { userId } = req.params;

    // URL 파라미터 검증
    if (!userId) {
      const errorResponse = createErrorResponse('VALIDATION_ERROR', '사용자 ID가 필요합니다.');
      return res.status(400).json(errorResponse);
    }

    // 서비스 호출
    const result = await checkUserIdDuplication(userId);
    const successResponse = createSuccessResponse(result);

    // 성공 응답
    res.status(200).json(successResponse);
  } catch (error) {
    // 에러 처리
    const errorCode = error.name === 'CustomError' ? 'VALIDATION_ERROR' : 'INTERNAL_ERROR';
    const statusCode = error.statusCode || 500;
    const errorResponse = createErrorResponse(errorCode, error.message);

    res.status(statusCode).json(errorResponse);
  }
};
