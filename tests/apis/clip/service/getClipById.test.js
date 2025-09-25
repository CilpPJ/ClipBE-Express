import { jest } from '@jest/globals';

// Repository 모듈 Mock
jest.unstable_mockModule('../../../../src/apis/clip/repository/findClipById.js', () => ({
  findClipById: jest.fn(),
}));

// Mock된 모듈 가져오기
const { findClipById: mockFindClipById } = await import('../../../../src/apis/clip/repository/findClipById.js');

// 테스트 대상 모듈 가져오기 (Mock 이후)
const { getClipById } = await import('../../../../src/apis/clip/service/getClipById.js');

describe('getClipById 서비스 테스트', () => {
  beforeEach(() => {
    // Mock 완전 초기화
    mockFindClipById.mockReset();
    mockFindClipById.mockClear();
    jest.clearAllMocks();
  });

  describe('✅ 성공 케이스', () => {
    test('유효한 clipId로 클립을 성공적으로 조회한다', async () => {
      // Given
      const clipId = 1;
      const userId = 'user-123';
      const userToken = 'token-456';
      const mockClipData = {
        id: 1,
        title: '테스트 클립',
        url: 'https://example.com',
        memo: '테스트 메모',
        thumbnail: 'https://example.com/thumb.jpg',
        is_public: true,
        created_at: '2023-01-01T00:00:00Z',
        updated_at: '2023-01-01T00:00:00Z',
        tags: { id: 1, name: 'JavaScript' },
      };

      mockFindClipById.mockResolvedValue(mockClipData);

      // When
      const result = await getClipById(clipId, userId, userToken);

      // Then
      expect(mockFindClipById).toHaveBeenCalledWith(1, userId, userToken);
      expect(result).toEqual({
        clipId: 1,
        title: '테스트 클립',
        url: 'https://example.com',
        memo: '테스트 메모',
        thumbnail: 'https://example.com/thumb.jpg',
        isPublic: true,
        createdAt: '2023-01-01T00:00:00Z',
        updatedAt: '2023-01-01T00:00:00Z',
        tags: [{ tagId: 1, tagName: 'JavaScript' }],
      });
    });

    test('문자열 clipId도 숫자로 변환하여 처리한다', async () => {
      // Given
      const clipId = '123';
      const userId = 'user-123';
      const userToken = 'token-456';
      const mockClipData = {
        id: 123,
        title: '문자열 ID 클립',
        url: 'https://example.com',
        memo: '내용',
        thumbnail: null,
        is_public: false,
        created_at: '2023-01-01T00:00:00Z',
        updated_at: '2023-01-01T00:00:00Z',
        tags: null,
      };

      mockFindClipById.mockResolvedValue(mockClipData);

      // When
      const result = await getClipById(clipId, userId, userToken);

      // Then
      expect(mockFindClipById).toHaveBeenCalledWith(123, userId, userToken);
      expect(result.clipId).toBe(123);
    });

    test('태그가 없는 클립도 정상적으로 조회한다', async () => {
      // Given
      const mockClipData = {
        id: 1,
        title: '태그 없는 클립',
        url: 'https://example.com',
        memo: '내용',
        thumbnail: null,
        is_public: true,
        created_at: '2023-01-01T00:00:00Z',
        updated_at: '2023-01-01T00:00:00Z',
        tags: null,
      };

      mockFindClipById.mockResolvedValue(mockClipData);

      // When
      const result = await getClipById(1, 'user-123', 'token');

      // Then
      expect(result.tags).toEqual([]);
    });

    test('snake_case를 camelCase로 올바르게 변환한다', async () => {
      // Given
      const mockClipData = {
        clip_id: 1,
        title: 'camelCase 테스트',
        content: '내용',
        is_public: true,
        created_at: '2023-01-01T00:00:00Z',
        updated_at: '2023-01-01T00:00:00Z',
        tags: [{ tag_id: 1, tag_name: 'Test' }],
      };

      mockFindClipById.mockResolvedValue(mockClipData);

      // When
      const result = await getClipById(1, 'user-123', 'token');

      // Then
      expect(result).toHaveProperty('clipId');
      expect(result).toHaveProperty('isPublic');
      expect(result).toHaveProperty('createdAt');
      expect(result).toHaveProperty('updatedAt');
      expect(result.tags[0]).toHaveProperty('tagId');
      expect(result.tags[0]).toHaveProperty('tagName');
    });
  });

  describe('❌ 실패 케이스 - 유효성 검사', () => {
    test('clipId가 없으면 VALIDATION_ERROR를 던진다', async () => {
      // When & Then
      await expect(getClipById(null, 'user-123', 'token')).rejects.toThrow('클립 ID는 필수입니다.');
      await expect(getClipById(undefined, 'user-123', 'token')).rejects.toThrow('클립 ID는 필수입니다.');
      await expect(getClipById('', 'user-123', 'token')).rejects.toThrow('클립 ID는 필수입니다.');
    });

    test('clipId가 올바른 숫자 형식이 아니면 VALIDATION_ERROR를 던진다', async () => {
      // Given - 유효하지 않은 clipId들
      const invalidClipIds = ['abc', 'NaN', '0', '-1', '1.5', 'null', 'undefined'];

      // When & Then
      for (const clipId of invalidClipIds) {
        await expect(getClipById(clipId, 'user-123', 'token')).rejects.toThrow('올바른 클립 ID 형식이 아닙니다.');

        // Repository가 절대 호출되지 않아야 함
        expect(mockFindClipById).not.toHaveBeenCalled();

        // Mock 초기화
        mockFindClipById.mockReset();
      }
    });
  });

  describe('❌ 실패 케이스 - 데이터베이스', () => {
    test('클립이 존재하지 않으면 NOT_FOUND_ERROR를 던진다', async () => {
      // Given
      mockFindClipById.mockResolvedValue(null);

      // When & Then
      await expect(getClipById(999, 'user-123', 'token')).rejects.toThrow('클립을 찾을 수 없습니다.');
      expect(mockFindClipById).toHaveBeenCalledWith(999, 'user-123', 'token');
    });

    test('Repository에서 에러 발생 시 INTERNAL_ERROR를 던진다', async () => {
      // Given
      const repositoryError = new Error('데이터베이스 연결 오류');
      mockFindClipById.mockRejectedValue(repositoryError);

      // When & Then
      await expect(getClipById(1, 'user-123', 'token')).rejects.toThrow('서버 내부 오류가 발생했습니다.');
      expect(mockFindClipById).toHaveBeenCalledWith(1, 'user-123', 'token');
    });

    test('예상치 못한 에러 발생 시 INTERNAL_ERROR를 던진다', async () => {
      // Given
      const unexpectedError = new Error('예상치 못한 오류');
      mockFindClipById.mockImplementation(() => {
        throw unexpectedError;
      });

      // When & Then
      await expect(getClipById(1, 'user-123', 'token')).rejects.toThrow('서버 내부 오류가 발생했습니다.');
    });
  });
});
