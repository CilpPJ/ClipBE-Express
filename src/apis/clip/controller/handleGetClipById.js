import { CustomError } from '../../../utils/errors.js';
import { createErrorResponse } from '../../../utils/responseFormatter.js';
import { getClipById } from '../service/getClipById.js';

/**
 * 특정 클립 상세 조회 API 핸들러
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 */
export const handleGetClipById = async (req, res) => {
  try {
    const { clipId } = req.params;

    // clipId가 유효한 숫자인지 검증
    const parsedClipId = parseInt(clipId, 10);
    if (isNaN(parsedClipId) || parsedClipId <= 0) {
      const errorResponse = createErrorResponse('INVALID_CLIP_ID', '유효하지 않은 클립 ID입니다.');
      return res.status(400).json(errorResponse);
    }

    const successResponse = await getClipById(parsedClipId);
    res.status(200).json(successResponse);
  } catch (error) {
    if (error instanceof CustomError) {
      const errorResponse = createErrorResponse(error.name, error.message);
      res.status(error.statusCode).json(errorResponse);
    } else {
      console.error(error);
      const errorResponse = createErrorResponse('SERVER_ERROR', '서버에서 알 수 없는 오류가 발생했습니다.');
      res.status(500).json(errorResponse);
    }
  }
};
