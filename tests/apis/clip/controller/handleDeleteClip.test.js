import { beforeEach, describe, expect, jest, test } from '@jest/globals';

// Mock service
jest.unstable_mockModule('../../../../src/apis/clip/service/deleteClip.js', () => ({
  deleteClip: jest.fn(),
}));

// Mock response formatter
jest.unstable_mockModule('../../../../src/utils/responseFormatter.js', () => ({
  createSuccessResponse: jest.fn(),
  createErrorResponse: jest.fn(),
}));

const { deleteClip } = await import('../../../../src/apis/clip/service/deleteClip.js');
const { createSuccessResponse, createErrorResponse } = await import('../../../../src/utils/responseFormatter.js');
const { handleDeleteClip } = await import('../../../../src/apis/clip/controller/handleDeleteClip.js');
const { CustomError } = await import('../../../../src/utils/errors.js');

describe('handleDeleteClip Controller 테스트', () => {
  let mockReq, mockRes;
  const mockUserId = 'test-user-123';

  beforeEach(() => {
    jest.clearAllMocks();

    mockReq = {
      params: { clipId: '1' },
      user: { id: mockUserId }, // 인증 미들웨어에서 제공하는 사용자 정보
    };

    mockRes = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
  });

  describe('✅ 성공 케이스', () => {
    test('클립 삭제를 성공적으로 처리한다 (소유자 검증 포함)', async () => {
      const mockServiceResult = {
        message: '클립이 성공적으로 삭제되었습니다.',
        deletedClipId: 1,
        deletedClipTitle: '테스트 클립',
      };
      const mockSuccessResponse = { status: 'SUCCESS', data: mockServiceResult };

      deleteClip.mockResolvedValue(mockServiceResult);
      createSuccessResponse.mockReturnValue(mockSuccessResponse);

      await handleDeleteClip(mockReq, mockRes);

      expect(deleteClip).toHaveBeenCalledWith('1', mockUserId);
      expect(createSuccessResponse).toHaveBeenCalledWith(mockServiceResult);
      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith(mockSuccessResponse);
    });

    test('다양한 clipId 형태를 올바르게 전달한다', async () => {
      mockReq.params.clipId = '42';
      const mockServiceResult = { message: '삭제 완료', deletedClipId: 42, deletedClipTitle: 'test' };

      deleteClip.mockResolvedValue(mockServiceResult);
      createSuccessResponse.mockReturnValue({ status: 'SUCCESS', data: mockServiceResult });

      await handleDeleteClip(mockReq, mockRes);

      expect(deleteClip).toHaveBeenCalledWith('42', mockUserId);
    });
  });

  describe('❌ 에러 케이스', () => {
    test('사용자 인증 정보가 없으면 401 에러를 반환한다', async () => {
      mockReq.user = null; // 인증 정보 없음
      const mockErrorResponse = { status: 'ERROR', errorCode: 'UNAUTHORIZED' };
      createErrorResponse.mockReturnValue(mockErrorResponse);

      await handleDeleteClip(mockReq, mockRes);

      expect(createErrorResponse).toHaveBeenCalledWith('UNAUTHORIZED', '인증되지 않은 사용자입니다.');
      expect(mockRes.status).toHaveBeenCalledWith(401);
      expect(mockRes.json).toHaveBeenCalledWith(mockErrorResponse);
      expect(deleteClip).not.toHaveBeenCalled();
    });

    test('사용자 ID가 없으면 401 에러를 반환한다', async () => {
      mockReq.user = { id: undefined }; // ID 없음
      const mockErrorResponse = { status: 'ERROR', errorCode: 'UNAUTHORIZED' };
      createErrorResponse.mockReturnValue(mockErrorResponse);

      await handleDeleteClip(mockReq, mockRes);

      expect(createErrorResponse).toHaveBeenCalledWith('UNAUTHORIZED', '인증되지 않은 사용자입니다.');
      expect(mockRes.status).toHaveBeenCalledWith(401);
      expect(mockRes.json).toHaveBeenCalledWith(mockErrorResponse);
    });

    test('서비스에서 400 에러 발생 시 400 상태코드로 응답한다', async () => {
      const mockError = new CustomError('INVALID_CLIP_ID', '유효하지 않은 클립 ID입니다.', 400);
      const mockErrorResponse = { status: 'ERROR', errorCode: 'INVALID_CLIP_ID' };

      deleteClip.mockRejectedValue(mockError);
      createErrorResponse.mockReturnValue(mockErrorResponse);

      await handleDeleteClip(mockReq, mockRes);

      expect(createErrorResponse).toHaveBeenCalledWith('INVALID_CLIP_ID', '유효하지 않은 클립 ID입니다.');
      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockRes.json).toHaveBeenCalledWith(mockErrorResponse);
    });

    test('서비스에서 404 에러 발생 시 404 상태코드로 응답한다', async () => {
      const mockError = new CustomError('CLIP_NOT_FOUND', '삭제할 클립을 찾을 수 없습니다.', 404);
      const mockErrorResponse = { status: 'ERROR', errorCode: 'CLIP_NOT_FOUND' };

      deleteClip.mockRejectedValue(mockError);
      createErrorResponse.mockReturnValue(mockErrorResponse);

      await handleDeleteClip(mockReq, mockRes);

      expect(createErrorResponse).toHaveBeenCalledWith('CLIP_NOT_FOUND', '삭제할 클립을 찾을 수 없습니다.');
      expect(mockRes.status).toHaveBeenCalledWith(404);
      expect(mockRes.json).toHaveBeenCalledWith(mockErrorResponse);
    });

    test('예상치 못한 에러 발생 시 500 상태코드로 응답한다', async () => {
      const mockError = new Error('예상치 못한 에러');
      const mockErrorResponse = { status: 'ERROR', errorCode: 'Error' };

      deleteClip.mockRejectedValue(mockError);
      createErrorResponse.mockReturnValue(mockErrorResponse);

      await handleDeleteClip(mockReq, mockRes);

      expect(createErrorResponse).toHaveBeenCalledWith('Error', '예상치 못한 에러');
      expect(mockRes.status).toHaveBeenCalledWith(500);
      expect(mockRes.json).toHaveBeenCalledWith(mockErrorResponse);
    });
  });

  describe('🧪 HTTP 요청/응답 처리', () => {
    test('req.params에서 clipId를 올바르게 추출한다', async () => {
      mockReq.params.clipId = '999';
      const mockServiceResult = { message: '삭제됨', deletedClipId: 999 };

      deleteClip.mockResolvedValue(mockServiceResult);
      createSuccessResponse.mockReturnValue({ status: 'SUCCESS' });

      await handleDeleteClip(mockReq, mockRes);

      expect(deleteClip).toHaveBeenCalledWith('999', mockUserId);
    });

    test('req.user에서 사용자 ID를 올바르게 추출한다', async () => {
      const differentUserId = 'different-user-456';
      mockReq.user.id = differentUserId;

      const mockServiceResult = { message: '삭제됨' };
      deleteClip.mockResolvedValue(mockServiceResult);
      createSuccessResponse.mockReturnValue({ status: 'SUCCESS' });

      await handleDeleteClip(mockReq, mockRes);

      expect(deleteClip).toHaveBeenCalledWith('1', differentUserId);
    });
  });
});
