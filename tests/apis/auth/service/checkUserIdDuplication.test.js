import { beforeEach, describe, expect, jest, test } from '@jest/globals';

// 🔧 Repository 모킹을 먼저 설정 (import 전에!)
jest.unstable_mockModule('../../../../src/apis/auth/repository/checkUserIdExists.js', () => ({
  checkUserIdExists: jest.fn(),
}));

// 모킹 설정 후 import
const { checkUserIdExists } = await import('../../../../src/apis/auth/repository/checkUserIdExists.js');
const { checkUserIdDuplication } = await import('../../../../src/apis/auth/service/checkUserIdDuplication.js');

describe('checkUserIdDuplication 서비스 테스트', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('✅ 성공 케이스', () => {
    test('사용 가능한 아이디인 경우 적절한 응답을 반환한다', async () => {
      // Given: 아이디가 중복되지 않는 경우
      checkUserIdExists.mockResolvedValue(false);

      // When
      const result = await checkUserIdDuplication('newuser123');

      // Then
      expect(checkUserIdExists).toHaveBeenCalledWith('newuser123');
      expect(result).toEqual({
        isDuplicated: false,
        message: '사용할 수 있는 아이디입니다.',
      });
    });

    test('중복된 아이디인 경우 적절한 응답을 반환한다', async () => {
      // Given: 아이디가 중복되는 경우
      checkUserIdExists.mockResolvedValue(true);

      // When
      const result = await checkUserIdDuplication('existinguser');

      // Then
      expect(checkUserIdExists).toHaveBeenCalledWith('existinguser');
      expect(result).toEqual({
        isDuplicated: true,
        message: '이미 사용 중인 아이디입니다.',
      });
    });

    test('공백이 포함된 아이디를 정제하여 처리한다', async () => {
      // Given
      checkUserIdExists.mockResolvedValue(false);

      // When
      const result = await checkUserIdDuplication('  testuser  ');

      // Then
      expect(checkUserIdExists).toHaveBeenCalledWith('testuser');
      expect(result.isDuplicated).toBe(false);
    });

    test('유효한 아이디 형식을 올바르게 검증한다', async () => {
      // Given
      checkUserIdExists.mockResolvedValue(false);

      // When & Then: 다양한 유효한 아이디들
      const validUserIds = ['user123', 'test_user', 'USER_123', 'a1b2c3d4'];

      for (const userId of validUserIds) {
        await expect(checkUserIdDuplication(userId)).resolves.toEqual({
          isDuplicated: false,
          message: '사용할 수 있는 아이디입니다.',
        });
      }
    });
  });

  describe('❌ 실패 케이스 - 유효성 검사', () => {
    test('아이디가 없으면 VALIDATION_ERROR를 던진다', async () => {
      await expect(checkUserIdDuplication('')).rejects.toThrow(
        expect.objectContaining({
          name: 'CustomError',
          message: '사용자 ID는 필수입니다.',
          statusCode: 400,
        })
      );
    });

    test('아이디가 문자열이 아니면 VALIDATION_ERROR를 던진다', async () => {
      await expect(checkUserIdDuplication(123)).rejects.toThrow(
        expect.objectContaining({
          name: 'CustomError',
          message: '사용자 ID는 문자열이어야 합니다.',
          statusCode: 400,
        })
      );
    });

    test('아이디가 4자 미만이면 VALIDATION_ERROR를 던진다', async () => {
      await expect(checkUserIdDuplication('abc')).rejects.toThrow(
        expect.objectContaining({
          name: 'CustomError',
          message: '사용자 ID는 4자 이상이어야 합니다.',
          statusCode: 400,
        })
      );
    });

    test('아이디가 20자 초과이면 VALIDATION_ERROR를 던진다', async () => {
      const longUserId = 'a'.repeat(21);
      await expect(checkUserIdDuplication(longUserId)).rejects.toThrow(
        expect.objectContaining({
          name: 'CustomError',
          message: '사용자 ID는 20자 이하여야 합니다.',
          statusCode: 400,
        })
      );
    });

    test('잘못된 문자가 포함된 아이디이면 VALIDATION_ERROR를 던진다', async () => {
      const invalidUserIds = ['user@name', 'user name', 'user-name', 'user.name', '한글아이디', 'user#123'];

      for (const userId of invalidUserIds) {
        await expect(checkUserIdDuplication(userId)).rejects.toThrow(
          expect.objectContaining({
            name: 'CustomError',
            message: '사용자 ID는 영문자, 숫자, 언더스코어만 사용할 수 있습니다.',
            statusCode: 400,
          })
        );
      }
    });
  });

  describe('❌ 실패 케이스 - 데이터베이스 오류', () => {
    test('데이터베이스 오류 시 INTERNAL_ERROR를 던진다', async () => {
      // Given: 데이터베이스 오류 발생
      checkUserIdExists.mockRejectedValue(new Error('사용자 ID 중복 확인 실패: Database connection failed'));

      // When & Then
      await expect(checkUserIdDuplication('testuser')).rejects.toThrow(
        expect.objectContaining({
          name: 'CustomError',
          message: '아이디 중복 확인 중 오류가 발생했습니다.',
          statusCode: 500,
        })
      );
    });

    test('기타 Repository 에러를 그대로 전달한다', async () => {
      // Given: CustomError 발생
      const customError = new Error('사용자 ID가 필요합니다.');
      customError.name = 'CustomError';
      customError.statusCode = 400;
      checkUserIdExists.mockRejectedValue(customError);

      // When & Then
      await expect(checkUserIdDuplication('testuser')).rejects.toThrow(customError);
    });
  });
});
