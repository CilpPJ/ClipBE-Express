import { createErrorResponse, createSuccessResponse } from '../../../utils/responseFormatter.js';
import { createNewClip } from '../service/createNewClip.js';

/**
 * 새로운 클립 생성 요청을 처리합니다.
 * @param {Object} req - Express 요청 객체
 * @param {Object} res - Express 응답 객체
 */
export const handleCreateClip = async (req, res) => {
  try {
    const { title, url, tagName, memo, thumbnail } = req.body;
    const userId = req.user.id; // 인증 미들웨어에서 검증된 사용자 ID

    // Authorization 헤더에서 토큰 추출
    const authHeader = req.headers.authorization;
    const userToken = authHeader ? authHeader.split(' ')[1] : null;

    const clipData = {
      title,
      url,
      tagName,
      userId,
      userToken, // 사용자 토큰 추가
      memo,
      thumbnail,
    };

    const newClip = await createNewClip(clipData);
    const successResponse = createSuccessResponse(newClip);

    res.status(201).json(successResponse);
  } catch (error) {
    // CustomError인 경우 그대로 전달, 아닌 경우 INTERNAL_ERROR로 처리
    const errorCode = error.name === 'CustomError' ? 'VALIDATION_ERROR' : 'INTERNAL_ERROR';
    const errorResponse = createErrorResponse(errorCode, error.message);
    const statusCode = error.statusCode || 500;

    res.status(statusCode).json(errorResponse);
  }
};
