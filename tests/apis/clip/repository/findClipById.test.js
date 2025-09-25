import { beforeEach, describe, expect, jest, test } from '@jest/globals';

// Mock 설정
const mockSupabaseClient = {
  from: jest.fn().mockReturnThis(),
  select: jest.fn().mockReturnThis(),
  eq: jest.fn().mockReturnThis(),
  single: jest.fn(),
};

const mockCreateClient = jest.fn();

jest.unstable_mockModule('@supabase/supabase-js', () => ({
  createClient: mockCreateClient,
}));

jest.unstable_mockModule('../../../../src/db/supabase-client.js', () => ({
  supabase: mockSupabaseClient,
}));

// 테스트 대상 import
const { findClipById } = await import('../../../../src/apis/clip/repository/findClipById.js');

describe('findClipById 리포지토리 테스트', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  const mockClipData = {
    id: 1,
    title: '테스트 클립',
    url: 'https://example.com',
    memo: '테스트 메모',
    thumbnail: 'https://example.com/thumb.jpg',
    created_at: '2025-09-25T10:00:00.000Z',
    updated_at: '2025-09-25T10:00:00.000Z',
    tag_id: 10,
    user_id: 'user-123',
    tags: {
      id: 10,
      name: '개발',
    },
  };

  describe('✅ 성공 케이스', () => {
    test('clipId로 클립을 성공적으로 조회한다', async () => {
      // Given
      const clipId = 1;
      const userId = 'user-123';
      const userToken = null; // 기본 supabase 클라이언트 사용

      mockSupabaseClient.single.mockResolvedValue({
        data: mockClipData,
        error: null,
      });

      // When
      const result = await findClipById(clipId, userId, userToken);

      // Then
      expect(result).toEqual(mockClipData);
      expect(mockSupabaseClient.from).toHaveBeenCalledWith('clips');
      expect(mockSupabaseClient.select).toHaveBeenCalledWith('*');
      expect(mockSupabaseClient.eq).toHaveBeenCalledWith('id', clipId);
      expect(mockSupabaseClient.single).toHaveBeenCalled();
    });

    test('userToken이 있을 때 사용자 컨텍스트로 클라이언트를 생성한다', async () => {
      // Given
      const clipId = 1;
      const userId = 'user-123';
      const userToken = 'test-token';

      const mockUserClient = {
        from: jest.fn().mockReturnThis(),
        select: jest.fn().mockReturnThis(),
        eq: jest.fn().mockReturnThis(),
        single: jest.fn().mockResolvedValue({
          data: mockClipData,
          error: null,
        }),
      };

      mockCreateClient.mockReturnValue(mockUserClient);

      // When
      await findClipById(clipId, userId, userToken);

      // Then
      expect(mockCreateClient).toHaveBeenCalledWith(process.env.SUPABASE_URL, process.env.SUPABASE_ANON_KEY, {
        global: { headers: { Authorization: `Bearer ${userToken}` } },
      });
      expect(mockUserClient.from).toHaveBeenCalledWith('clips');
    });

    test('userToken이 없을 때 기본 supabase 클라이언트를 사용한다', async () => {
      // Given
      const clipId = 1;
      const userId = 'user-123';
      const userToken = null;

      mockSupabaseClient.single.mockResolvedValue({
        data: mockClipData,
        error: null,
      });

      // When
      await findClipById(clipId, userId, userToken);

      // Then
      expect(mockCreateClient).not.toHaveBeenCalled();
      expect(mockSupabaseClient.from).toHaveBeenCalledWith('clips');
    });
  });

  describe('❌ 실패 케이스', () => {
    test('클립이 존재하지 않으면 에러를 던진다', async () => {
      // Given
      const clipId = 999;
      const userId = 'user-123';
      const userToken = null;

      mockSupabaseClient.single.mockResolvedValue({
        data: null,
        error: { code: 'PGRST116', message: 'No rows found' },
      });

      // When & Then
      await expect(findClipById(clipId, userId, userToken)).rejects.toThrow('클립 조회 실패');
    });

    test('데이터베이스 에러 발생 시 에러를 던진다', async () => {
      // Given
      const clipId = 1;
      const userId = 'user-123';
      const userToken = null;

      mockSupabaseClient.single.mockResolvedValue({
        data: null,
        error: { message: 'Database connection failed' },
      });

      // When & Then
      await expect(findClipById(clipId, userId, userToken)).rejects.toThrow('클립 조회 실패');
    });

    test('예외 발생 시 적절한 에러를 던진다', async () => {
      // Given
      const clipId = 1;
      const userId = 'user-123';
      const userToken = null;

      mockSupabaseClient.single.mockRejectedValue(new Error('Network error'));

      // When & Then
      await expect(findClipById(clipId, userId, userToken)).rejects.toThrow('클립 조회 중 오류가 발생했습니다');
    });
  });
});
