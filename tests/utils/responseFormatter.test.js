import { describe, expect, test } from '@jest/globals';

import { createErrorResponse, createSuccessResponse } from '../../src/utils/responseFormatter.js';

describe('responseFormatter 유틸리티 함수 테스트', () => {
  describe('createSuccessResponse', () => {
    test('올바른 형태의 성공 응답을 생성한다', () => {
      // 테스트 데이터 준비 (프론트엔드 테스트와 비슷!)
      const testData = {
        userId: '123',
        nickname: '클립테스터',
      };

      // 함수 실행
      const result = createSuccessResponse(testData);

      // 결과 검증
      expect(result).toMatchObject({
        data: testData,
        status: 'SUCCESS',
        errorCode: null,
        errorMessage: null,
      });

      // serverDateTime이 존재하고 ISO 형태인지 확인
      expect(result.serverDateTime).toBeDefined();
      expect(new Date(result.serverDateTime)).toBeInstanceOf(Date);
    });

    test('null 데이터도 올바르게 처리한다', () => {
      const result = createSuccessResponse(null);

      expect(result.data).toBeNull();
      expect(result.status).toBe('SUCCESS');
    });

    test('빈 객체도 올바르게 처리한다', () => {
      const result = createSuccessResponse({});

      expect(result.data).toEqual({});
      expect(result.status).toBe('SUCCESS');
    });
  });

  describe('createErrorResponse', () => {
    test('올바른 형태의 에러 응답을 생성한다', () => {
      const errorCode = 'USER_NOT_FOUND';
      const errorMessage = '사용자를 찾을 수 없습니다.';

      const result = createErrorResponse(errorCode, errorMessage);

      expect(result).toMatchObject({
        data: null,
        status: 'ERROR',
        errorCode: errorCode,
        errorMessage: errorMessage,
      });

      // serverDateTime 확인
      expect(result.serverDateTime).toBeDefined();
      expect(new Date(result.serverDateTime)).toBeInstanceOf(Date);
    });

    test('빈 문자열 에러코드와 메시지도 처리한다', () => {
      const result = createErrorResponse('', '');

      expect(result.errorCode).toBe('');
      expect(result.errorMessage).toBe('');
      expect(result.status).toBe('ERROR');
    });
  });
});
