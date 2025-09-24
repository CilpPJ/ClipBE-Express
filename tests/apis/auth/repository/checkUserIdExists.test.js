import { beforeEach, describe, expect, jest, test } from '@jest/globals';

// Supabase 클라이언트 모킹
jest.unstable_mockModule('../../../../src/db/supabase-client.js', () => ({
  supabase: {
    auth: {
      admin: {
        getUserByEmail: jest.fn(),
      },
    },
  },
}));

// 모킹 설정 후 import
const { supabase } = await import('../../../../src/db/supabase-client.js');
const { checkUserIdExists } = await import('../../../../src/apis/auth/repository/checkUserIdExists.js');

describe('checkUserIdExists 리포지토리 테스트', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('✅ 성공 케이스', () => {
    test('사용자가 존재하지 않는 경우 false를 반환한다', async () => {
      // Given: 사용자를 찾을 수 없는 경우
      const mockError = new Error('User not found');
      supabase.auth.admin.getUserByEmail.mockResolvedValue({
        data: null,
        error: mockError,
      });

      // When
      const result = await checkUserIdExists('nonexistentuser');

      // Then
      expect(supabase.auth.admin.getUserByEmail).toHaveBeenCalledWith('nonexistentuser@clip.com');
      expect(result).toBe(false);
    });

    test('사용자가 존재하는 경우 true를 반환한다', async () => {
      // Given: 사용자가 존재하는 경우
      const mockUser = {
        id: '12345',
        email: 'testuser@clip.com',
        created_at: '2025-01-01T00:00:00Z',
      };
      supabase.auth.admin.getUserByEmail.mockResolvedValue({
        data: { user: mockUser },
        error: null,
      });

      // When
      const result = await checkUserIdExists('testuser');

      // Then
      expect(supabase.auth.admin.getUserByEmail).toHaveBeenCalledWith('testuser@clip.com');
      expect(result).toBe(true);
    });

    test('사용자가 null인 경우 false를 반환한다', async () => {
      // Given: data는 있지만 user가 null인 경우
      supabase.auth.admin.getUserByEmail.mockResolvedValue({
        data: { user: null },
        error: null,
      });

      // When
      const result = await checkUserIdExists('testuser');

      // Then
      expect(result).toBe(false);
    });
  });

  describe('❌ 실패 케이스', () => {
    test('userId가 없으면 에러를 던진다', async () => {
      // When & Then
      await expect(checkUserIdExists('')).rejects.toThrow('사용자 ID가 필요합니다.');
      await expect(checkUserIdExists(null)).rejects.toThrow('사용자 ID가 필요합니다.');
      await expect(checkUserIdExists(undefined)).rejects.toThrow('사용자 ID가 필요합니다.');
    });

    test('데이터베이스 에러 발생 시 에러를 던진다', async () => {
      // Given: 데이터베이스 연결 오류
      const mockError = new Error('Database connection failed');
      supabase.auth.admin.getUserByEmail.mockResolvedValue({
        data: null,
        error: mockError,
      });

      // When & Then
      await expect(checkUserIdExists('testuser')).rejects.toThrow(
        '사용자 ID 중복 확인 실패: Database connection failed'
      );
      expect(supabase.auth.admin.getUserByEmail).toHaveBeenCalledWith('testuser@clip.com');
    });

    test('권한 오류 발생 시 에러를 던진다', async () => {
      // Given: 권한 오류
      const mockError = new Error('Insufficient permissions');
      supabase.auth.admin.getUserByEmail.mockResolvedValue({
        data: null,
        error: mockError,
      });

      // When & Then
      await expect(checkUserIdExists('testuser')).rejects.toThrow('사용자 ID 중복 확인 실패: Insufficient permissions');
    });
  });

  describe('🔄 이메일 형식 변환', () => {
    test('userId를 올바른 이메일 형식으로 변환한다', async () => {
      // Given
      const mockError = new Error('User not found');
      supabase.auth.admin.getUserByEmail.mockResolvedValue({
        data: null,
        error: mockError,
      });

      const testCases = [
        { input: 'user123', expected: 'user123@clip.com' },
        { input: 'test_user', expected: 'test_user@clip.com' },
        { input: 'UPPER_CASE', expected: 'UPPER_CASE@clip.com' },
      ];

      // When & Then
      for (const { input, expected } of testCases) {
        await checkUserIdExists(input);
        expect(supabase.auth.admin.getUserByEmail).toHaveBeenCalledWith(expected);
      }
    });
  });
});
