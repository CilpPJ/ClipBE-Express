import { CustomError } from '../../../utils/errors.js';
import { createErrorResponse } from '../../../utils/responseFormatter.js';
import { getAllClips } from '../service/getAllClips.js';

/**
 * 모든 클립 데이터를 조회하는 API 핸들러
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 */
export const handleGetAllClips = async (req, res) => {
  try {
    const successResponse = await getAllClips();
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
