import { CustomError } from '../../../utils/errors.js';
import { createErrorResponse, createSuccessResponse } from '../../../utils/responseFormatter.js';
import { refreshUserSession } from '../service/refreshUserSession.js';

export const handleTokenRefresh = async (req, res) => {
  try {
    const { refreshToken } = req.body;

    const newTokens = await refreshUserSession({ refreshToken });
    const successResponse = createSuccessResponse(newTokens);

    res.status(200).json(successResponse);
  } catch (error) {
    if (error instanceof CustomError) {
      const errorResponse = createErrorResponse(error.name, error.message);
      res.status(error.statusCode).json(errorResponse);
    } else {
      const errorResponse = createErrorResponse('SERVER_ERROR', '서버에서 알 수 없는 오류가 발생했습니다.');
      res.status(500).json(errorResponse);
    }
  }
};
