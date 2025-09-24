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
      const result = await checkNicknameDuplication('새닉네임');

      // Then
      expect(checkNicknameExists).toHaveBeenCalledWith('새닉네임');
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
      const result = await checkNicknameDuplication('  테스트  ');

      // Then
      expect(checkNicknameExists).toHaveBeenCalledWith('테스트');
      expect(result.isDuplicated).toBe(false);
    });

    test('영문과 숫자가 포함된 닉네임을 처리한다', async () => {
      // Given
      checkNicknameExists.mockResolvedValue(false);

      // When
      const result = await checkNicknameDuplication('User123');

      // Then
      expect(checkNicknameExists).toHaveBeenCalledWith('User123');
      expect(result.isDuplicated).toBe(false);
    });

    test('한글과 영문이 혼합된 닉네임을 처리한다', async () => {
      // Given
      checkNicknameExists.mockResolvedValue(false);

      // When
      const result = await checkNicknameDuplication('테스트User');

      // Then
      expect(checkNicknameExists).toHaveBeenCalledWith('테스트User');
      expect(result.isDuplicated).toBe(false);
    });
  });

  describe('❌ 실패 케이스 - 입력값 검증', () => {
    test('닉네임이 없으면 에러를 던진다', async () => {
      const errorCases = ['', null, undefined];

      for (const nickname of errorCases) {
        await expect(checkNicknameDuplication(nickname)).rejects.toThrow('닉네임은 필수입니다.');
      }
    });

    test('닉네임이 문자열이 아니면 에러를 던진다', async () => {
      const invalidTypes = [123, [], {}, true];

      for (const nickname of invalidTypes) {
        await expect(checkNicknameDuplication(nickname)).rejects.toThrow('닉네임은 문자열이어야 합니다.');
      }
    });

    test('닉네임이 너무 짧으면 에러를 던진다', async () => {
      const shortNicknames = ['a', '가'];

      for (const nickname of shortNicknames) {
        await expect(checkNicknameDuplication(nickname)).rejects.toThrow('닉네임은 2자 이상이어야 합니다.');
      }
    });

    test('닉네임이 너무 길면 에러를 던진다', async () => {
      const longNickname = '가'.repeat(11); // 11자

      await expect(checkNicknameDuplication(longNickname)).rejects.toThrow('닉네임은 10자 이하여야 합니다.');
    });

    test('닉네임에 허용되지 않는 문자가 포함되면 에러를 던진다', async () => {
      const invalidNicknames = [
        'test@gmail', // 특수문자 @
        'user!123', // 특수문자 !
        'nick-name', // 하이픈
        'user_name', // 언더스코어
        'test 123', // 공백
        'nick#tag', // 해시
      ];

      for (const nickname of invalidNicknames) {
        await expect(checkNicknameDuplication(nickname)).rejects.toThrow(
          '닉네임은 한글, 영문자, 숫자만 사용할 수 있습니다.'
        );
      }
    });
  });

  describe('🎯 정규식 검증 테스트', () => {
    test('유효한 닉네임 패턴들이 통과한다', async () => {
      // Given
      checkNicknameExists.mockResolvedValue(false);

      const validNicknames = [
        '테스트', // 한글만
        'Test', // 영문만
        '123', // 숫자만
        '테스트123', // 한글 + 숫자
        'Test123', // 영문 + 숫자
        '테스트User', // 한글 + 영문
        '한글Test123', // 한글 + 영문 + 숫자
        '가나다라마바사아자', // 최대 길이 10자
        '가1', // 최소 길이 2자
      ];

      // When & Then
      for (const nickname of validNicknames) {
        const result = await checkNicknameDuplication(nickname);
        expect(result.isDuplicated).toBe(false);
        expect(checkNicknameExists).toHaveBeenCalledWith(nickname);
      }
    });
  });

  describe('🔄 Repository 에러 처리', () => {
    test('Repository 에러를 Service 에러로 변환한다', async () => {
      // Given: Repository에서 데이터베이스 에러 발생
      const repositoryError = new Error('닉네임 중복 확인 실패: Database connection failed');
      checkNicknameExists.mockRejectedValue(repositoryError);

      // When & Then
      await expect(checkNicknameDuplication('테스트닉네임')).rejects.toThrow('닉네임 중복 확인 중 오류가 발생했습니다.');
    });

    test('CustomError는 그대로 전달한다', async () => {
      // Given: CustomError 발생 (직접 throw하는 경우는 없지만, 가능성을 위해)
      class CustomError extends Error {
        constructor(message, statusCode) {
          super(message);
          this.name = 'CustomError';
          this.statusCode = statusCode;
        }
      }
      
      const customError = new CustomError('Custom error message', 500);
      checkNicknameExists.mockRejectedValue(customError);

      // When & Then
      await expect(checkNicknameDuplication('테스트닉네임')).rejects.toThrow('Custom error message');
    });
  });
});