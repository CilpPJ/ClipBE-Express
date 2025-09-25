import { beforeEach, describe, expect, jest, test } from '@jest/globals';

// Mock 설정
const mockGetClipById = jest.fn();
const mockCreateSuccessResponse = jest.fn();
const mockCreateErrorResponse = jest.fn();

jest.unstable_mockModule('../../../../src/apis/clip/service/getClipById.js', () => ({
  getClipById: mockGetClipById,
}));

jest.unstable_mockModule('../../../../src/utils/responseFormatter.js', () => ({
  createSuccessResponse: mockCreateSuccessResponse,
  createErrorResponse: mockCreateErrorResponse,
}));

// 테스트 대상 import
const { handleGetClipById } = await import('../../../../src/apis/clip/controller/handleGetClipById.js');

describe('handleGetClipById 컨트롤러 테스트', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  // Mock 객체들
  const mockReq = {
    params: { clipId: '1' },
    user: { id: 'user-123' },
    headers: { authorization: 'Bearer test-token-123' },
  };

  const mockRes = {
    status: jest.fn().mockReturnThis(),
    json: jest.fn(),
  };

  const mockClipData = {
    id: 1,
    title: '테스트 클립',
    url: 'https://example.com',
    tagId: 10,
    tagName: '개발',
    memo: '테스트 메모',
    thumbnail: 'https://example.com/thumb.jpg',
    createdAt: '2025-09-25T10:00:00.000Z',
    updatedAt: '2025-09-25T10:00:00.000Z',
  };

  describe('✅ 성공 케이스', () => {
    test('클립 상세 조회를 성공적으로 처리한다', async () => {
      // Given
      mockGetClipById.mockResolvedValue(mockClipData);
      mockCreateSuccessResponse.mockReturnValue({
        data: mockClipData,
        status: 'SUCCESS',
        serverDateTime: '2025-09-25T10:00:00.000Z',
        errorCode: null,
        errorMessage: null,
      });

      // When
      await handleGetClipById(mockReq, mockRes);

      // Then
      expect(mockGetClipById).toHaveBeenCalledWith('1', 'user-123', 'test-token-123');
      expect(mockCreateSuccessResponse).toHaveBeenCalledWith(mockClipData);
      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith({
        data: mockClipData,
        status: 'SUCCESS',
        serverDateTime: '2025-09-25T10:00:00.000Z',
        errorCode: null,
        errorMessage: null,
      });
    });

    test('Authorization 헤더가 없어도 정상적으로 처리한다', async () => {
      // Given
      const reqWithoutAuth = {
        ...mockReq,
        headers: {},
      };

      mockGetClipById.mockResolvedValue(mockClipData);
      mockCreateSuccessResponse.mockReturnValue({
        data: mockClipData,
        status: 'SUCCESS',
        serverDateTime: '2025-09-25T10:00:00.000Z',
        errorCode: null,
        errorMessage: null,
      });

      // When
      await handleGetClipById(reqWithoutAuth, mockRes);

      // Then
      expect(mockGetClipById).toHaveBeenCalledWith('1', 'user-123', undefined);
      expect(mockRes.status).toHaveBeenCalledWith(200);
    });
  });

  describe('❌ 실패 케이스', () => {
    test('유효성 검사 실패 시 400 에러를 반환한다', async () => {
      // Given
      const validationError = {
        name: 'CustomError',
        message: '클립 ID는 필수입니다.',
        statusCode: 400,
      };

      mockGetClipById.mockRejectedValue(validationError);
      mockCreateErrorResponse.mockReturnValue({
        data: null,
        status: 'ERROR',
        serverDateTime: '2025-09-25T10:00:00.000Z',
        errorCode: 'CustomError',
        errorMessage: '클립 ID는 필수입니다.',
      });

      // When
      await handleGetClipById(mockReq, mockRes);

      // Then
      expect(mockCreateErrorResponse).toHaveBeenCalledWith('CustomError', '클립 ID는 필수입니다.');
      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockRes.json).toHaveBeenCalledWith({
        data: null,
        status: 'ERROR',
        serverDateTime: '2025-09-25T10:00:00.000Z',
        errorCode: 'CustomError',
        errorMessage: '클립 ID는 필수입니다.',
      });
    });

    test('클립을 찾을 수 없을 때 404 에러를 반환한다', async () => {
      // Given
      const notFoundError = {
        name: 'CustomError',
        message: '클립을 찾을 수 없습니다.',
        statusCode: 404,
      };

      mockGetClipById.mockRejectedValue(notFoundError);
      mockCreateErrorResponse.mockReturnValue({
        data: null,
        status: 'ERROR',
        serverDateTime: '2025-09-25T10:00:00.000Z',
        errorCode: 'CustomError',
        errorMessage: '클립을 찾을 수 없습니다.',
      });

      // When
      await handleGetClipById(mockReq, mockRes);

      // Then
      expect(mockCreateErrorResponse).toHaveBeenCalledWith('CustomError', '클립을 찾을 수 없습니다.');
      expect(mockRes.status).toHaveBeenCalledWith(404);
    });

    test('서버 내부 오류 시 500 에러를 반환한다', async () => {
      // Given
      const internalError = new Error('Database connection failed');

      mockGetClipById.mockRejectedValue(internalError);
      mockCreateErrorResponse.mockReturnValue({
        data: null,
        status: 'ERROR',
        serverDateTime: '2025-09-25T10:00:00.000Z',
        errorCode: 'INTERNAL_ERROR',
        errorMessage: 'Database connection failed',
      });

      // When
      await handleGetClipById(mockReq, mockRes);

      // Then
      expect(mockCreateErrorResponse).toHaveBeenCalledWith('Error', 'Database connection failed');
      expect(mockRes.status).toHaveBeenCalledWith(500);
    });

    test('에러 객체에 name이 없을 때 기본값을 사용한다', async () => {
      // Given
      const errorWithoutName = {
        message: '알 수 없는 오류',
        statusCode: 400,
      };

      mockGetClipById.mockRejectedValue(errorWithoutName);
      mockCreateErrorResponse.mockReturnValue({
        data: null,
        status: 'ERROR',
        serverDateTime: '2025-09-25T10:00:00.000Z',
        errorCode: 'INTERNAL_ERROR',
        errorMessage: '알 수 없는 오류',
      });

      // When
      await handleGetClipById(mockReq, mockRes);

      // Then
      expect(mockCreateErrorResponse).toHaveBeenCalledWith('INTERNAL_ERROR', '알 수 없는 오류');
      expect(mockRes.status).toHaveBeenCalledWith(400);
    });

    test('에러 객체에 statusCode가 없을 때 500을 사용한다', async () => {
      // Given
      const errorWithoutStatusCode = {
        name: 'CustomError',
        message: '상태 코드 없는 오류',
      };

      mockGetClipById.mockRejectedValue(errorWithoutStatusCode);
      mockCreateErrorResponse.mockReturnValue({
        data: null,
        status: 'ERROR',
        serverDateTime: '2025-09-25T10:00:00.000Z',
        errorCode: 'CustomError',
        errorMessage: '상태 코드 없는 오류',
      });

      // When
      await handleGetClipById(mockReq, mockRes);

      // Then
      expect(mockRes.status).toHaveBeenCalledWith(500);
    });
  });
});
