import { CustomError } from '../../../utils/errors.js';
import { createErrorResponse, createSuccessResponse } from '../../../utils/responseFormatter.js';
import { createUser } from '../service/createUser.js';

export const handleUserCreate = async (req, res) => {
  try {
    const { userId, password, nickname } = req.body;

    const newUser = await createUser({ userId, password, nickname });
    const successResponse = createSuccessResponse(newUser);

    res.status(201).json(successResponse);
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
