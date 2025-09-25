import { beforeEach, describe, expect, jest, test } from '@jest/globals';

// Mock service
jest.unstable_mockModule('../../../src/apis/clip/service/deleteClip.js', () => ({
  deleteClip: jest.fn(),
}));

// Mock response formatter
jest.unstable_mockModule('../../../src/utils/responseFormatter.js', () => ({
  createSuccessResponse: jest.fn(),
  createErrorResponse: jest.fn(),
}));

const { deleteClip } = await import('../../../src/apis/clip/service/deleteClip.js');
const { createSuccessResponse, createErrorResponse } = await import('../../../src/utils/responseFormatter.js');
const { handleDeleteClip } = await import('../../../src/apis/clip/controller/handleDeleteClip.js');
const { CustomError } = await import('../../../src/utils/errors.js');

describe('handleDeleteClip Controller 테스트', () => {
  let mockReq, mockRes;

  beforeEach(() => {
    jest.clearAllMocks();

    mockReq = {
      params: { clipId: '1' },
    };

    mockRes = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
  });

  describe('✅ 성공 케이스', () => {
    test('클립 삭제를 성공적으로 처리한다', async () => {
      const mockServiceResult = {
        message: '클립이 성공적으로 삭제되었습니다.',
        deletedClipId: 1,
        deletedClipTitle: '테스트 클립',
      };
      const mockSuccessResponse = { status: 'SUCCESS', data: mockServiceResult };

      deleteClip.mockResolvedValue(mockServiceResult);
      createSuccessResponse.mockReturnValue(mockSuccessResponse);

      await handleDeleteClip(mockReq, mockRes);

      expect(deleteClip).toHaveBeenCalledWith('1');
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

      expect(deleteClip).toHaveBeenCalledWith('42');
    });
  });

  describe('❌ 에러 케이스', () => {
    test('클립을 찾을 수 없는 경우 404 에러를 반환한다', async () => {
      const mockError = new CustomError('CLIP_NOT_FOUND', '삭제할 클립을 찾을 수 없습니다.', 404);
      const mockErrorResponse = { status: 'ERROR', errorCode: 'CLIP_NOT_FOUND' };

      deleteClip.mockRejectedValue(mockError);
      createErrorResponse.mockReturnValue(mockErrorResponse);

      await handleDeleteClip(mockReq, mockRes);

      expect(createErrorResponse).toHaveBeenCalledWith('CLIP_NOT_FOUND', '삭제할 클립을 찾을 수 없습니다.');
      expect(mockRes.status).toHaveBeenCalledWith(404);
      expect(mockRes.json).toHaveBeenCalledWith(mockErrorResponse);
    });

    test('유효하지 않은 clipId의 경우 400 에러를 반환한다', async () => {
      const mockError = new CustomError('INVALID_CLIP_ID', '유효하지 않은 클립 ID입니다.', 400);
      const mockErrorResponse = { status: 'ERROR', errorCode: 'INVALID_CLIP_ID' };

      deleteClip.mockRejectedValue(mockError);
      createErrorResponse.mockReturnValue(mockErrorResponse);

      await handleDeleteClip(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockRes.json).toHaveBeenCalledWith(mockErrorResponse);
    });

    test('서버 에러가 발생하면 500 에러를 반환한다', async () => {
      const mockError = new Error('Database connection failed');
      const mockErrorResponse = { status: 'ERROR', errorCode: 'Error' };

      deleteClip.mockRejectedValue(mockError);
      createErrorResponse.mockReturnValue(mockErrorResponse);

      await handleDeleteClip(mockReq, mockRes);

      expect(createErrorResponse).toHaveBeenCalledWith('Error', 'Database connection failed');
      expect(mockRes.status).toHaveBeenCalledWith(500);
      expect(mockRes.json).toHaveBeenCalledWith(mockErrorResponse);
    });
  });

  describe('🧪 경계값 테스트', () => {
    test('params에서 clipId를 올바르게 추출한다', async () => {
      mockReq.params.clipId = '999';
      const mockServiceResult = { message: '삭제 완료', deletedClipId: 999, deletedClipTitle: 'test' };

      deleteClip.mockResolvedValue(mockServiceResult);
      createSuccessResponse.mockReturnValue({ status: 'SUCCESS', data: mockServiceResult });

      await handleDeleteClip(mockReq, mockRes);

      expect(deleteClip).toHaveBeenCalledWith('999');
    });

    test('statusCode가 없는 에러는 500으로 처리한다', async () => {
      const mockError = new Error('Unknown error');
      delete mockError.statusCode;
      const mockErrorResponse = { status: 'ERROR', errorCode: 'Error' };

      deleteClip.mockRejectedValue(mockError);
      createErrorResponse.mockReturnValue(mockErrorResponse);

      await handleDeleteClip(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(500);
    });
  });
});
