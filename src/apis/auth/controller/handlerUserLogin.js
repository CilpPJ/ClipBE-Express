import { CustomError } from '../../../utils/errors.js';
import { createErrorResponse, createSuccessResponse } from '../../../utils/responseFormatter.js';
import { loginUser } from '../service/loginUser.js';

/**
 * 로그인 요청을 처리하는 핸들러
 */
export const handleUserLogin = async (req, res) => {
  try {
    const { userId, password } = req.body;

    const loginData = await loginUser({ userId, password });

    const successResponse = createSuccessResponse(loginData);
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
