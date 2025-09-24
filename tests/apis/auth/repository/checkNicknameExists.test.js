import { beforeEach, describe, expect, jest, test } from '@jest/globals';

// Supabase 클라이언트 모킹
jest.unstable_mockModule('../../../../src/db/supabase-client.js', () => ({
  supabase: {
    from: jest.fn(() => ({
      select: jest.fn(() => ({
        eq: jest.fn(() => ({
          single: jest.fn(),
        })),
      })),
    })),
  },
}));

// 모킹 설정 후 import
const { supabase } = await import('../../../../src/db/supabase-client.js');
const { checkNicknameExists } = await import('../../../../src/apis/auth/repository/checkNicknameExists.js');

describe('checkNicknameExists 리포지토리 테스트', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('✅ 성공 케이스', () => {
    test('닉네임이 존재하지 않는 경우 false를 반환한다', async () => {
      // Given: 닉네임을 찾을 수 없는 경우 (PGRST116 에러)
      const mockError = { code: 'PGRST116', message: 'JSON object requested, not found' };
      supabase.from().select().eq().single.mockResolvedValue({
        data: null,
        error: mockError,
      });

      // When
      const result = await checkNicknameExists('사용가능닉네임');

      // Then
      expect(supabase.from).toHaveBeenCalledWith('profiles');
      expect(result).toBe(false);
    });

    test('닉네임이 존재하는 경우 true를 반환한다', async () => {
      // Given: 닉네임이 존재하는 경우
      const mockProfile = {
        id: 'user-123-uuid',
      };
      supabase.from().select().eq().single.mockResolvedValue({
        data: mockProfile,
        error: null,
      });

      // When
      const result = await checkNicknameExists('기존닉네임');

      // Then
      expect(supabase.from).toHaveBeenCalledWith('profiles');
      expect(result).toBe(true);
    });

    test('데이터가 null인 경우 false를 반환한다', async () => {
      // Given: data가 null인 경우
      supabase.from().select().eq().single.mockResolvedValue({
        data: null,
        error: { code: 'PGRST116' },
      });

      // When
      const result = await checkNicknameExists('테스트닉네임');

      // Then
      expect(result).toBe(false);
    });
  });

  describe('❌ 실패 케이스', () => {
    test('nickname이 없으면 에러를 던진다', async () => {
      // When & Then
      await expect(checkNicknameExists('')).rejects.toThrow('닉네임이 필요합니다.');
      await expect(checkNicknameExists(null)).rejects.toThrow('닉네임이 필요합니다.');
      await expect(checkNicknameExists(undefined)).rejects.toThrow('닉네임이 필요합니다.');
    });

    test('데이터베이스 에러 발생 시 에러를 던진다', async () => {
      // Given: 데이터베이스 연결 오류
      const mockError = { code: 'PGRST301', message: 'Database connection failed' };
      supabase.from().select().eq().single.mockResolvedValue({
        data: null,
        error: mockError,
      });

      // When & Then
      await expect(checkNicknameExists('테스트닉네임')).rejects.toThrow(
        '닉네임 중복 확인 실패: Database connection failed'
      );
      expect(supabase.from).toHaveBeenCalledWith('profiles');
    });

    test('권한 오류 발생 시 에러를 던진다', async () => {
      // Given: 권한 오류
      const mockError = { code: 'PGRST103', message: 'Insufficient permissions' };
      supabase.from().select().eq().single.mockResolvedValue({
        data: null,
        error: mockError,
      });

      // When & Then
      await expect(checkNicknameExists('테스트닉네임')).rejects.toThrow('닉네임 중복 확인 실패: Insufficient permissions');
    });
  });

  describe('🔄 데이터베이스 쿼리 검증', () => {
    test('올바른 테이블과 컬럼으로 쿼리한다', async () => {
      // Given
      const mockError = { code: 'PGRST116' };
      const mockSelect = jest.fn(() => ({
        eq: jest.fn(() => ({
          single: jest.fn(() => Promise.resolve({
            data: null,
            error: mockError,
          })),
        })),
      }));
      const mockFrom = jest.fn(() => ({ select: mockSelect }));
      supabase.from = mockFrom;

      // When
      await checkNicknameExists('테스트닉네임');

      // Then
      expect(mockFrom).toHaveBeenCalledWith('profiles');
      expect(mockSelect).toHaveBeenCalledWith('id');
    });
  });
});