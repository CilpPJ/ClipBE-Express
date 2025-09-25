import { beforeEach, describe, expect, jest, test } from '@jest/globals';

// Mock service
jest.unstable_mockModule('../../../../src/apis/clip/service/updateClip.js', () => ({
  updateClip: jest.fn(),
}));

// Mock response formatter
jest.unstable_mockModule('../../../../src/utils/responseFormatter.js', () => ({
  createSuccessResponse: jest.fn(),
  createErrorResponse: jest.fn(),
}));

const { updateClip } = await import('../../../../src/apis/clip/service/updateClip.js');
const { createSuccessResponse, createErrorResponse } = await import('../../../../src/utils/responseFormatter.js');
const { handleUpdateClip } = await import('../../../../src/apis/clip/controller/handleUpdateClip.js');
const { CustomError } = await import('../../../../src/utils/errors.js');

describe('handleUpdateClip Controller 테스트', () => {
  let mockReq, mockRes;
  const mockUserId = 'test-user-123';

  beforeEach(() => {
    jest.clearAllMocks();

    mockReq = {
      params: { clipId: '1' },
      user: { id: mockUserId }, // 인증 미들웨어에서 제공하는 사용자 정보
      body: { title: '수정된 제목', url: 'https://updated.com', memo: '수정된 메모' },
    };

    mockRes = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
  });

  describe('✅ 성공 케이스', () => {
    test('클립 수정을 성공적으로 처리한다 (소유자 검증 포함)', async () => {
      const mockServiceResult = {
        message: '클립이 성공적으로 수정되었습니다.',
        updatedClipId: 1,
        updatedFields: ['title', 'url', 'memo'],
      };
      const mockSuccessResponse = { status: 'SUCCESS', data: mockServiceResult };

      updateClip.mockResolvedValue(mockServiceResult);
      createSuccessResponse.mockReturnValue(mockSuccessResponse);

      await handleUpdateClip(mockReq, mockRes);

      expect(updateClip).toHaveBeenCalledWith('1', mockUserId, {
        title: '수정된 제목',
        url: 'https://updated.com',
        tagName: undefined,
        memo: '수정된 메모',
      });
      expect(createSuccessResponse).toHaveBeenCalledWith(mockServiceResult);
      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith(mockSuccessResponse);
    });

    test('부분 필드 수정 요청을 올바르게 처리한다', async () => {
      mockReq.body = { title: '새 제목' };
      const mockServiceResult = {
        message: '클립이 성공적으로 수정되었습니다.',
        updatedClipId: 1,
        updatedFields: ['title'],
      };

      updateClip.mockResolvedValue(mockServiceResult);
      createSuccessResponse.mockReturnValue({ status: 'SUCCESS', data: mockServiceResult });

      await handleUpdateClip(mockReq, mockRes);

      expect(updateClip).toHaveBeenCalledWith('1', mockUserId, {
        title: '새 제목',
        url: undefined,
        tagName: undefined,
        memo: undefined,
      });
    });

    test('태그명 포함 수정 요청을 처리한다', async () => {
      mockReq.body = { title: '제목', tagName: '새태그' };
      const mockServiceResult = {
        message: '클립이 성공적으로 수정되었습니다.',
        updatedClipId: 1,
        updatedFields: ['title', 'tagName'],
      };

      updateClip.mockResolvedValue(mockServiceResult);
      createSuccessResponse.mockReturnValue({ status: 'SUCCESS', data: mockServiceResult });

      await handleUpdateClip(mockReq, mockRes);

      expect(updateClip).toHaveBeenCalledWith('1', mockUserId, {
        title: '제목',
        url: undefined,
        tagName: '새태그',
        memo: undefined,
      });
    });
  });

  describe('❌ 에러 케이스', () => {
    test('사용자 인증 정보가 없으면 401 에러를 반환한다', async () => {
      mockReq.user = null; // 인증 정보 없음
      const mockErrorResponse = { status: 'ERROR', errorCode: 'UNAUTHORIZED' };
      createErrorResponse.mockReturnValue(mockErrorResponse);

      await handleUpdateClip(mockReq, mockRes);

      expect(createErrorResponse).toHaveBeenCalledWith('UNAUTHORIZED', '인증되지 않은 사용자입니다.');
      expect(mockRes.status).toHaveBeenCalledWith(401);
      expect(mockRes.json).toHaveBeenCalledWith(mockErrorResponse);
      expect(updateClip).not.toHaveBeenCalled();
    });

    test('사용자 ID가 없으면 401 에러를 반환한다', async () => {
      mockReq.user = { id: undefined }; // ID 없음
      const mockErrorResponse = { status: 'ERROR', errorCode: 'UNAUTHORIZED' };
      createErrorResponse.mockReturnValue(mockErrorResponse);

      await handleUpdateClip(mockReq, mockRes);

      expect(createErrorResponse).toHaveBeenCalledWith('UNAUTHORIZED', '인증되지 않은 사용자입니다.');
      expect(mockRes.status).toHaveBeenCalledWith(401);
      expect(mockRes.json).toHaveBeenCalledWith(mockErrorResponse);
    });

    test('서비스에서 400 에러 발생 시 400 상태코드로 응답한다', async () => {
      const mockError = new CustomError('NO_UPDATE_DATA', '수정할 데이터가 제공되지 않았습니다.', 400);
      const mockErrorResponse = { status: 'ERROR', errorCode: 'NO_UPDATE_DATA' };

      updateClip.mockRejectedValue(mockError);
      createErrorResponse.mockReturnValue(mockErrorResponse);

      await handleUpdateClip(mockReq, mockRes);

      expect(createErrorResponse).toHaveBeenCalledWith('NO_UPDATE_DATA', '수정할 데이터가 제공되지 않았습니다.');
      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockRes.json).toHaveBeenCalledWith(mockErrorResponse);
    });

    test('서비스에서 404 에러 발생 시 404 상태코드로 응답한다', async () => {
      const mockError = new CustomError('CLIP_NOT_FOUND', '수정할 클립을 찾을 수 없습니다.', 404);
      const mockErrorResponse = { status: 'ERROR', errorCode: 'CLIP_NOT_FOUND' };

      updateClip.mockRejectedValue(mockError);
      createErrorResponse.mockReturnValue(mockErrorResponse);

      await handleUpdateClip(mockReq, mockRes);

      expect(createErrorResponse).toHaveBeenCalledWith('CLIP_NOT_FOUND', '수정할 클립을 찾을 수 없습니다.');
      expect(mockRes.status).toHaveBeenCalledWith(404);
      expect(mockRes.json).toHaveBeenCalledWith(mockErrorResponse);
    });

    test('예상치 못한 에러 발생 시 500 상태코드로 응답한다', async () => {
      const mockError = new Error('예상치 못한 에러');
      const mockErrorResponse = { status: 'ERROR', errorCode: 'Error' };

      updateClip.mockRejectedValue(mockError);
      createErrorResponse.mockReturnValue(mockErrorResponse);

      await handleUpdateClip(mockReq, mockRes);

      expect(createErrorResponse).toHaveBeenCalledWith('Error', '예상치 못한 에러');
      expect(mockRes.status).toHaveBeenCalledWith(500);
      expect(mockRes.json).toHaveBeenCalledWith(mockErrorResponse);
    });
  });

  describe('🧪 HTTP 요청/응답 처리', () => {
    test('req.params에서 clipId를 올바르게 추출한다', async () => {
      mockReq.params.clipId = '999';
      const mockServiceResult = { message: '수정됨', updatedClipId: 999, updatedFields: ['title'] };

      updateClip.mockResolvedValue(mockServiceResult);
      createSuccessResponse.mockReturnValue({ status: 'SUCCESS' });

      await handleUpdateClip(mockReq, mockRes);

      expect(updateClip).toHaveBeenCalledWith('999', mockUserId, expect.any(Object));
    });

    test('req.user에서 사용자 ID를 올바르게 추출한다', async () => {
      const differentUserId = 'different-user-456';
      mockReq.user.id = differentUserId;

      const mockServiceResult = { message: '수정됨', updatedClipId: 1, updatedFields: ['title'] };
      updateClip.mockResolvedValue(mockServiceResult);
      createSuccessResponse.mockReturnValue({ status: 'SUCCESS' });

      await handleUpdateClip(mockReq, mockRes);

      expect(updateClip).toHaveBeenCalledWith('1', differentUserId, expect.any(Object));
    });

    test('req.body에서 수정 필드들을 올바르게 추출한다', async () => {
      mockReq.body = {
        title: '새 제목',
        url: 'https://new.com',
        tagName: '새태그',
        memo: '새 메모',
        invalidField: '무시됨',
      };

      const mockServiceResult = { message: '수정됨', updatedClipId: 1, updatedFields: [] };
      updateClip.mockResolvedValue(mockServiceResult);
      createSuccessResponse.mockReturnValue({ status: 'SUCCESS' });

      await handleUpdateClip(mockReq, mockRes);

      expect(updateClip).toHaveBeenCalledWith('1', mockUserId, {
        title: '새 제목',
        url: 'https://new.com',
        tagName: '새태그',
        memo: '새 메모',
      });
    });
  });
});
