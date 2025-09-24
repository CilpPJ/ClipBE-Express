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
  let mockSelect, mockEq, mockSingle;

  beforeEach(() => {
    jest.clearAllMocks();

    // 체인 메서드 모킹 설정
    mockSingle = jest.fn();
    mockEq = jest.fn(() => ({ single: mockSingle }));
    mockSelect = jest.fn(() => ({ eq: mockEq }));
    supabase.from.mockReturnValue({ select: mockSelect });
  });

  describe('✅ 성공 케이스', () => {
    test('닉네임이 존재하지 않는 경우 false를 반환한다', async () => {
      // Given: 닉네임을 찾을 수 없는 경우 (PGRST116 에러)
      const mockError = { code: 'PGRST116', message: 'No rows found' };
      mockSingle.mockResolvedValue({
        data: null,
        error: mockError,
      });

      // When
      const result = await checkNicknameExists('사용가능닉네임');

      // Then
      expect(supabase.from).toHaveBeenCalledWith('profiles');
      expect(mockSelect).toHaveBeenCalledWith('id');
      expect(mockEq).toHaveBeenCalledWith('nickname', '사용가능닉네임');
      expect(result).toBe(false);
    });

    test('닉네임이 존재하는 경우 true를 반환한다', async () => {
      // Given: 닉네임이 존재하는 경우
      const mockProfile = { id: 'profile-id-123' };
      mockSingle.mockResolvedValue({
        data: mockProfile,
        error: null,
      });

      // When
      const result = await checkNicknameExists('기존닉네임');

      // Then
      expect(supabase.from).toHaveBeenCalledWith('profiles');
      expect(mockSelect).toHaveBeenCalledWith('id');
      expect(mockEq).toHaveBeenCalledWith('nickname', '기존닉네임');
      expect(result).toBe(true);
    });

    test('빈 data가 반환되어도 false를 반환한다', async () => {
      // Given: data는 null이지만 error도 null인 경우
      mockSingle.mockResolvedValue({
        data: null,
        error: null,
      });

      // When
      const result = await checkNicknameExists('테스트닉네임');

      // Then
      expect(result).toBe(false);
    });
  });

  describe('❌ 에러 케이스', () => {
    test('닉네임이 제공되지 않으면 에러를 던진다', async () => {
      // When & Then
      await expect(checkNicknameExists(null)).rejects.toThrow('닉네임이 필요합니다.');
      await expect(checkNicknameExists(undefined)).rejects.toThrow('닉네임이 필요합니다.');
      await expect(checkNicknameExists('')).rejects.toThrow('닉네임이 필요합니다.');
    });

    test('데이터베이스 에러 발생 시 에러를 던진다', async () => {
      // Given: 데이터베이스 에러 발생
      const mockError = { code: '23505', message: 'Database connection error' };
      mockSingle.mockResolvedValue({
        data: null,
        error: mockError,
      });

      // When & Then
      await expect(checkNicknameExists('테스트닉네임')).rejects.toThrow(
        '닉네임 중복 확인 실패: Database connection error'
      );
    });

    test('알 수 없는 데이터베이스 에러 시에도 적절히 처리한다', async () => {
      // Given: 알 수 없는 에러 코드
      const mockError = { code: 'UNKNOWN_ERROR', message: 'Unexpected error' };
      mockSingle.mockResolvedValue({
        data: null,
        error: mockError,
      });

      // When & Then
      await expect(checkNicknameExists('테스트닉네임')).rejects.toThrow(
        '닉네임 중복 확인 실패: Unexpected error'
      );
    });
  });

  describe('🧪 경계값 테스트', () => {
    test('특수문자가 포함된 닉네임도 처리한다', async () => {
      // Given
      mockSingle.mockResolvedValue({
        data: { id: 'special-profile' },
        error: null,
      });

      // When
      const result = await checkNicknameExists('특수#닉네임');

      // Then
      expect(mockEq).toHaveBeenCalledWith('nickname', '특수#닉네임');
      expect(result).toBe(true);
    });

    test('매우 긴 닉네임도 처리한다', async () => {
      // Given
      const longNickname = 'a'.repeat(100);
      mockSingle.mockResolvedValue({
        data: null,
        error: { code: 'PGRST116', message: 'No rows found' },
      });

      // When
      const result = await checkNicknameExists(longNickname);

      // Then
      expect(mockEq).toHaveBeenCalledWith('nickname', longNickname);
      expect(result).toBe(false);
    });
  });
});