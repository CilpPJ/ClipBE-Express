import { jest } from '@jest/globals';

// Mock supabase before importing the module
const mockSupabase = {
  from: jest.fn().mockReturnThis(),
  select: jest.fn().mockReturnThis(),
  eq: jest.fn().mockReturnThis(),
  single: jest.fn(),
};

// Use dynamic import and module mocking
jest.mock(
  '../../../../src/db/supabase-client.js',
  () => ({
    supabase: mockSupabase,
  }),
  { virtual: true }
);

const { checkNicknameExists } = await import('../../../../src/apis/auth/repository/checkNicknameExists.js');

describe('checkNicknameExists 리포지토리 테스트', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('✅ 성공 케이스', () => {
    test('닉네임이 존재하지 않는 경우 false를 반환한다', async () => {
      // Given
      const nickname = '테스트닉네임';
      mockSupabase.single.mockResolvedValue({
        data: null,
        error: { code: 'PGRST116', message: 'No rows found' },
      });

      // When
      const result = await checkNicknameExists(nickname);

      // Then
      expect(result).toBe(false);
      expect(mockSupabase.from).toHaveBeenCalledWith('profiles');
      expect(mockSupabase.select).toHaveBeenCalledWith('id');
      expect(mockSupabase.eq).toHaveBeenCalledWith('nickname', nickname);
    });

    test('닉네임이 존재하는 경우 true를 반환한다', async () => {
      // Given
      const nickname = '존재하는닉네임';
      mockSupabase.single.mockResolvedValue({
        data: { id: 'profile-id-1' },
        error: null,
      });

      // When
      const result = await checkNicknameExists(nickname);

      // Then
      expect(result).toBe(true);
      expect(mockSupabase.from).toHaveBeenCalledWith('profiles');
      expect(mockSupabase.select).toHaveBeenCalledWith('id');
      expect(mockSupabase.eq).toHaveBeenCalledWith('nickname', nickname);
    });

    test('data가 null인 경우 false를 반환한다', async () => {
      // Given
      const nickname = '테스트닉네임';
      mockSupabase.single.mockResolvedValue({
        data: null,
        error: null,
      });

      // When
      const result = await checkNicknameExists(nickname);

      // Then
      expect(result).toBe(false);
    });
  });

  describe('❌ 실패 케이스', () => {
    test('nickname이 없으면 에러를 던진다', async () => {
      // Given & When & Then
      await expect(checkNicknameExists()).rejects.toThrow('닉네임은 필수입니다.');
      await expect(checkNicknameExists('')).rejects.toThrow('닉네임은 필수입니다.');
      await expect(checkNicknameExists(null)).rejects.toThrow('닉네임은 필수입니다.');
    });

    test('데이터베이스 에러 발생 시 에러를 던진다', async () => {
      // Given
      const nickname = '테스트닉네임';
      mockSupabase.single.mockResolvedValue({
        data: null,
        error: { code: 'OTHER_ERROR', message: 'Database connection failed' },
      });

      // When & Then
      await expect(checkNicknameExists(nickname)).rejects.toThrow('닉네임 중복 확인 실패');
    });

    test('예외 발생 시 적절한 에러를 던진다', async () => {
      // Given
      const nickname = '테스트닉네임';
      mockSupabase.single.mockRejectedValue(new Error('Network error'));

      // When & Then
      await expect(checkNicknameExists(nickname)).rejects.toThrow('닉네임 중복 확인 중 오류가 발생했습니다');
    });
  });
});
