import { jest } from '@jest/globals';

import { checkNicknameDuplication } from '../../../../src/apis/auth/service/checkNicknameDuplication.js';

// Mocking
jest.unstable_mockModule('../../../../src/apis/auth/repository/checkNicknameExists.js', () => ({
  checkNicknameExists: jest.fn(),
}));

const { checkNicknameExists } = await import('../../../../src/apis/auth/repository/checkNicknameExists.js');

describe('checkNicknameDuplication 서비스 테스트', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('✅ 성공 케이스', () => {
    test('사용 가능한 닉네임인 경우 적절한 응답을 반환한다', async () => {
      // Given
      const nickname = '새닉네임';
      checkNicknameExists.mockResolvedValue(false);

      // When
      const result = await checkNicknameDuplication(nickname);

      // Then
      expect(result).toEqual({
        isDuplicated: false,
        message: '사용할 수 있는 닉네임입니다.',
      });
      expect(checkNicknameExists).toHaveBeenCalledWith('새닉네임');
    });

    test('중복된 닉네임인 경우 적절한 응답을 반환한다', async () => {
      // Given
      const nickname = '중복닉네임';
      checkNicknameExists.mockResolvedValue(true);

      // When
      const result = await checkNicknameDuplication(nickname);

      // Then
      expect(result).toEqual({
        isDuplicated: true,
        message: '이미 사용 중인 닉네임입니다.',
      });
      expect(checkNicknameExists).toHaveBeenCalledWith('중복닉네임');
    });

    test('공백이 포함된 닉네임을 정제하여 처리한다', async () => {
      // Given
      const nickname = '  테스트  ';
      checkNicknameExists.mockResolvedValue(false);

      // When
      const result = await checkNicknameDuplication(nickname);

      // Then
      expect(result.isDuplicated).toBe(false);
      expect(checkNicknameExists).toHaveBeenCalledWith('테스트');
    });

    test('유효한 닉네임 형식을 올바르게 검증한다', async () => {
      // Given
      const validNicknames = ['한글닉', 'English', '123', '한글123', 'Test닉네임'];
      checkNicknameExists.mockResolvedValue(false);

      // When & Then
      for (const nickname of validNicknames) {
        const result = await checkNicknameDuplication(nickname);
        expect(result.isDuplicated).toBe(false);
      }
    });
  });

  describe('❌ 실패 케이스 - 유효성 검사', () => {
    test('닉네임이 없으면 VALIDATION_ERROR를 던진다', async () => {
      // Given & When & Then
      await expect(checkNicknameDuplication()).rejects.toThrow('닉네임은 필수입니다.');
      await expect(checkNicknameDuplication('')).rejects.toThrow('닉네임은 필수입니다.');
      await expect(checkNicknameDuplication(null)).rejects.toThrow('닉네임은 필수입니다.');
    });

    test('닉네임이 문자열이 아니면 VALIDATION_ERROR를 던진다', async () => {
      // Given & When & Then
      await expect(checkNicknameDuplication(123)).rejects.toThrow('닉네임은 문자열이어야 합니다.');
      await expect(checkNicknameDuplication({})).rejects.toThrow('닉네임은 문자열이어야 합니다.');
      await expect(checkNicknameDuplication([])).rejects.toThrow('닉네임은 문자열이어야 합니다.');
    });

    test('닉네임이 2자 미만이면 VALIDATION_ERROR를 던진다', async () => {
      // Given & When & Then
      await expect(checkNicknameDuplication('a')).rejects.toThrow('닉네임은 최소 2자 이상이어야 합니다.');
      await expect(checkNicknameDuplication('한')).rejects.toThrow('닉네임은 최소 2자 이상이어야 합니다.');
      await expect(checkNicknameDuplication('  a  ')).rejects.toThrow('닉네임은 최소 2자 이상이어야 합니다.');
    });

    test('닉네임이 10자 초과이면 VALIDATION_ERROR를 던진다', async () => {
      // Given
      const longNickname = '한글닉네임이열자초과';

      // When & Then
      await expect(checkNicknameDuplication(longNickname)).rejects.toThrow('닉네임은 최대 10자 이하여야 합니다.');
    });

    test('잘못된 문자가 포함된 닉네임이면 VALIDATION_ERROR를 던진다', async () => {
      // Given
      const invalidNicknames = ['nick@name', 'nick name', 'nick-name', 'nick_name', '닉네임!', '닉네임?'];

      // When & Then
      for (const nickname of invalidNicknames) {
        await expect(checkNicknameDuplication(nickname)).rejects.toThrow(
          '닉네임은 한글, 영문, 숫자만 사용할 수 있습니다.'
        );
      }
    });
  });

  describe('❌ 실패 케이스 - 데이터베이스 오류', () => {
    test('데이터베이스 오류 시 INTERNAL_ERROR를 던진다', async () => {
      // Given
      const nickname = '테스트닉네임';
      checkNicknameExists.mockRejectedValue(new Error('닉네임 중복 확인 실패: Database error'));

      // When & Then
      await expect(checkNicknameDuplication(nickname)).rejects.toThrow('닉네임 중복 확인 중 오류가 발생했습니다.');
    });

    test('기타 Repository 에러를 그대로 전달한다', async () => {
      // Given
      const nickname = '테스트닉네임';
      const customError = new Error('Custom repository error');
      customError.name = 'CustomError';
      checkNicknameExists.mockRejectedValue(customError);

      // When & Then
      await expect(checkNicknameDuplication(nickname)).rejects.toThrow('Custom repository error');
    });
  });
});
