import { describe, expect, test } from '@jest/globals';

import { CustomError } from '../../src/utils/errors.js';

describe('CustomError 클래스 테스트', () => {
  test('올바른 에러 객체를 생성한다', () => {
    const message = '사용자를 찾을 수 없습니다.';
    const statusCode = 404;

    const error = new CustomError(message, statusCode);

    // Error 클래스를 상속받았는지 확인
    expect(error).toBeInstanceOf(Error);
    expect(error).toBeInstanceOf(CustomError);

    // 프로퍼티 확인
    expect(error.message).toBe(message);
    expect(error.statusCode).toBe(statusCode);
    expect(error.name).toBe('CustomError');
  });

  test('기본 Error 클래스의 기능들이 정상 작동한다', () => {
    const error = new CustomError('테스트 에러', 500);

    // toString() 확인
    expect(error.toString()).toContain('CustomError');
    expect(error.toString()).toContain('테스트 에러');

    // stack trace 확인
    expect(error.stack).toBeDefined();
    expect(typeof error.stack).toBe('string');
  });

  test('다양한 HTTP 상태 코드로 에러 생성이 가능하다', () => {
    const testCases = [
      { message: '잘못된 요청', statusCode: 400 },
      { message: '인증 실패', statusCode: 401 },
      { message: '권한 없음', statusCode: 403 },
      { message: '리소스 없음', statusCode: 404 },
      { message: '서버 에러', statusCode: 500 },
    ];

    testCases.forEach(({ message, statusCode }) => {
      const error = new CustomError(message, statusCode);

      expect(error.message).toBe(message);
      expect(error.statusCode).toBe(statusCode);
      expect(error.name).toBe('CustomError');
    });
  });
});
