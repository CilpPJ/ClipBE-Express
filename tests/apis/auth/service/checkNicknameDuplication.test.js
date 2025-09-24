import { beforeEach, describe, expect, jest, test } from '@jest/globals';

// 🔧 Repository 모킹을 먼저 설정 (import 전에!)
jest.unstable_mockModule('../../../../src/apis/auth/repository/checkNicknameExists.js', () => ({
  checkNicknameExists: jest.fn(),
}));

// 모킹 설정 후 import
const { checkNicknameExists } = await import('../../../../src/apis/auth/repository/checkNicknameExists.js');
const { checkNicknameDuplication } = await import('../../../../src/apis/auth/service/checkNicknameDuplication.js');

describe('checkNicknameDuplication 서비스 테스트', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('✅ 성공 케이스', () => {
    test('사용 가능한 닉네임인 경우 적절한 응답을 반환한다', async () => {
      // Given: 닉네임이 중복되지 않는 경우
      checkNicknameExists.mockResolvedValue(false);

      // When
      const result = await checkNicknameDuplication('새로운닉네임');

      // Then
      expect(checkNicknameExists).toHaveBeenCalledWith('새로운닉네임');
      expect(result).toEqual({
        isDuplicated: false,
        message: '사용할 수 있는 닉네임입니다.',
      });
    });

    test('중복된 닉네임인 경우 적절한 응답을 반환한다', async () => {
      // Given: 닉네임이 중복되는 경우
      checkNicknameExists.mockResolvedValue(true);

      // When
      const result = await checkNicknameDuplication('기존닉네임');

      // Then
      expect(checkNicknameExists).toHaveBeenCalledWith('기존닉네임');
      expect(result).toEqual({
        isDuplicated: true,
        message: '이미 사용 중인 닉네임입니다.',
      });
    });

    test('공백이 포함된 닉네임을 정제하여 처리한다', async () => {
      // Given
      checkNicknameExists.mockResolvedValue(false);

      // When
      const result = await checkNicknameDuplication('  테스트닉네임  ');

      // Then
      expect(checkNicknameExists).toHaveBeenCalledWith('테스트닉네임');
      expect(result.isDuplicated).toBe(false);
    });

    test('한글 닉네임을 올바르게 처리한다', async () => {
      // Given
      checkNicknameExists.mockResolvedValue(false);

      // When
      const result = await checkNicknameDuplication('한글닉네임');

      // Then
      expect(checkNicknameExists).toHaveBeenCalledWith('한글닉네임');
      expect(result.isDuplicated).toBe(false);
    });

    test('영문 닉네임을 올바르게 처리한다', async () => {
      // Given
      checkNicknameExists.mockResolvedValue(false);

      // When
      const result = await checkNicknameDuplication('English'); // 7자로 수정

      // Then
      expect(checkNicknameExists).toHaveBeenCalledWith('English');
      expect(result.isDuplicated).toBe(false);
    });

    test('숫자가 포함된 닉네임을 올바르게 처리한다', async () => {
      // Given
      checkNicknameExists.mockResolvedValue(false);

      // When
      const result = await checkNicknameDuplication('닉네임123');

      // Then
      expect(checkNicknameExists).toHaveBeenCalledWith('닉네임123');
      expect(result.isDuplicated).toBe(false);
    });
  });

  describe('❌ 유효성 검사 실패 케이스', () => {
    test('닉네임이 제공되지 않으면 에러를 던진다', async () => {
      // When & Then
      await expect(checkNicknameDuplication(null)).rejects.toThrow('닉네임은 필수입니다.');
      await expect(checkNicknameDuplication(undefined)).rejects.toThrow('닉네임은 필수입니다.');
      await expect(checkNicknameDuplication('')).rejects.toThrow('닉네임은 필수입니다.');
    });

    test('닉네임이 문자열이 아니면 에러를 던진다', async () => {
      // When & Then
      await expect(checkNicknameDuplication(123)).rejects.toThrow('닉네임은 문자열이어야 합니다.');
      await expect(checkNicknameDuplication({})).rejects.toThrow('닉네임은 문자열이어야 합니다.');
      await expect(checkNicknameDuplication([])).rejects.toThrow('닉네임은 문자열이어야 합니다.');
    });

    test('닉네임이 2자 미만이면 에러를 던진다', async () => {
      // When & Then
      await expect(checkNicknameDuplication('a')).rejects.toThrow('닉네임은 2자 이상이어야 합니다.');
      await expect(checkNicknameDuplication('가')).rejects.toThrow('닉네임은 2자 이상이어야 합니다.');
    });

    test('닉네임이 10자 초과이면 에러를 던진다', async () => {
      // When & Then
      const longNickname = '가'.repeat(11); // 11자
      await expect(checkNicknameDuplication(longNickname)).rejects.toThrow('닉네임은 10자 이하여야 합니다.');
    });

    test('잘못된 형식의 닉네임이면 에러를 던진다', async () => {
      // 특수문자가 포함된 경우
      await expect(checkNicknameDuplication('닉네임!')).rejects.toThrow(
        '닉네임은 한글, 영문자, 숫자만 사용할 수 있습니다.'
      );
      await expect(checkNicknameDuplication('nick@name')).rejects.toThrow(
        '닉네임은 한글, 영문자, 숫자만 사용할 수 있습니다.'
      );
      await expect(checkNicknameDuplication('닉네임_')).rejects.toThrow(
        '닉네임은 한글, 영문자, 숫자만 사용할 수 있습니다.'
      );
    });

    test('공백만 있는 닉네임이면 에러를 던진다', async () => {
      // When & Then
      await expect(checkNicknameDuplication('   ')).rejects.toThrow('닉네임은 필수입니다.');
    });
  });

  describe('❌ Repository 에러 처리', () => {
    test('Repository에서 데이터베이스 에러 발생 시 적절히 처리한다', async () => {
      // Given: Repository에서 DB 에러 발생
      checkNicknameExists.mockRejectedValue(new Error('닉네임 중복 확인 실패: Connection error'));

      // When & Then
      await expect(checkNicknameDuplication('테스트닉네임')).rejects.toThrow(
        '닉네임 중복 확인 중 오류가 발생했습니다.'
      );
    });

    test('Repository에서 일반 에러 발생 시 그대로 전달한다', async () => {
      // Given: Repository에서 일반 에러 발생
      const customError = new Error('Other error');
      customError.name = 'CustomError';
      checkNicknameExists.mockRejectedValue(customError);

      // When & Then
      await expect(checkNicknameDuplication('테스트닉네임')).rejects.toThrow('Other error');
    });
  });

  describe('🧪 경계값 테스트', () => {
    test('최소 길이 닉네임(2자)을 처리한다', async () => {
      // Given
      checkNicknameExists.mockResolvedValue(false);

      // When
      const result = await checkNicknameDuplication('AB');

      // Then
      expect(checkNicknameExists).toHaveBeenCalledWith('AB');
      expect(result.isDuplicated).toBe(false);
    });

    test('최대 길이 닉네임(10자)을 처리한다', async () => {
      // Given
      const maxLengthNickname = '가'.repeat(10); // 10자
      checkNicknameExists.mockResolvedValue(false);

      // When
      const result = await checkNicknameDuplication(maxLengthNickname);

      // Then
      expect(checkNicknameExists).toHaveBeenCalledWith(maxLengthNickname);
      expect(result.isDuplicated).toBe(false);
    });

    test('한글과 영문이 혼합된 닉네임을 처리한다', async () => {
      // Given
      checkNicknameExists.mockResolvedValue(false);

      // When
      const result = await checkNicknameDuplication('한글Eng'); // 6자로 수정

      // Then
      expect(checkNicknameExists).toHaveBeenCalledWith('한글Eng');
      expect(result.isDuplicated).toBe(false);
    });
  });
});