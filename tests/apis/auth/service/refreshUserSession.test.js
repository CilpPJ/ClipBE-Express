import { beforeEach, describe, expect, jest, test } from '@jest/globals';

// 🔧 테스트 헬퍼 함수 import
import { createRefreshResponse } from '../../../helpers/authTestHelpers.js';
// 🎯 Mock 데이터 import
import { MOCK_AUTH_DATA, MOCK_REFRESH_DATA } from '../../../mock/authMockData.js';

// 🎯 Supabase 클라이언트 모킹 (import 전에!)
jest.unstable_mockModule('../../../../src/db/supabase-client.js', () => ({
  supabase: {
    auth: {
      refreshSession: jest.fn(),
    },
  },
}));

// 모킹 설정 후 import
const { supabase } = await import('../../../../src/db/supabase-client.js');
const { refreshUserSession } = await import('../../../../src/apis/auth/service/refreshUserSession.js');

describe('refreshUserSession 서비스 테스트', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('✅ 성공 케이스', () => {
    test('유효한 리프레시 토큰으로 새로운 세션을 발급받는다', async () => {
      // 🎯 Supabase 세션 리프레시 성공 응답
      supabase.auth.refreshSession.mockResolvedValue({
        data: MOCK_AUTH_DATA.refreshSuccess,
        error: null,
      });

      // 🚀 실제 함수 호출
      const result = await refreshUserSession({
        refreshToken: MOCK_REFRESH_DATA.validRefreshToken,
      });

      // 🔍 반환 데이터 검증
      const expectedResponse = createRefreshResponse(MOCK_AUTH_DATA.refreshSuccess);
      expect(result).toEqual(expectedResponse);

      // 🔍 Supabase 호출 파라미터 검증
      expect(supabase.auth.refreshSession).toHaveBeenCalledWith({
        refresh_token: MOCK_REFRESH_DATA.validRefreshToken,
      });

      expect(supabase.auth.refreshSession).toHaveBeenCalledTimes(1);
    });

    test('긴 토큰 문자열도 올바르게 처리한다', async () => {
      const longRefreshToken = `very-long-refresh-token-${'a'.repeat(500)}`;
      const mockSessionData = {
        session: {
          access_token: `new-long-access-token-${'b'.repeat(300)}`,
          refresh_token: `new-long-refresh-token-${'c'.repeat(400)}`,
        },
      };

      supabase.auth.refreshSession.mockResolvedValue({
        data: mockSessionData,
        error: null,
      });

      const result = await refreshUserSession({ refreshToken: longRefreshToken });

      expect(result.accessToken).toContain('new-long-access-token-');
      expect(result.refreshToken).toContain('new-long-refresh-token-');
      expect(supabase.auth.refreshSession).toHaveBeenCalledWith({
        refresh_token: longRefreshToken,
      });
    });

    test('JWT 형식의 토큰도 처리한다', async () => {
      const jwtRefreshToken =
        'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwi' +
        'bmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c';
      const jwtAccessToken =
        'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwi' +
        'bmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.new_signature_here';

      supabase.auth.refreshSession.mockResolvedValue({
        data: {
          session: {
            access_token: jwtAccessToken,
            refresh_token: jwtRefreshToken,
          },
        },
        error: null,
      });

      const result = await refreshUserSession({ refreshToken: jwtRefreshToken });

      expect(result.accessToken).toBe(jwtAccessToken);
      expect(result.refreshToken).toBe(jwtRefreshToken);
    });
  });

  describe('❌ 에러 처리 테스트', () => {
    test('리프레시 토큰이 없으면 400 에러를 발생시킨다', async () => {
      // 🔍 실제 코드에서 !refreshToken으로 검사하므로 falsy 값들만 테스트
      const invalidTokens = [null, undefined, ''];

      for (const invalidToken of invalidTokens) {
        await expect(refreshUserSession({ refreshToken: invalidToken })).rejects.toThrow('리프레시 토큰이 필요합니다.');
      }

      // Supabase는 호출되지 않아야 함
      expect(supabase.auth.refreshSession).not.toHaveBeenCalled();
    });

    test('Supabase에서 에러를 반환하면 401 에러를 발생시킨다', async () => {
      const invalidRefreshToken = 'invalid-or-expired-token';

      // 🎯 Supabase 에러 응답
      supabase.auth.refreshSession.mockResolvedValue({
        data: null,
        error: {
          message: 'invalid_grant: Invalid refresh token',
          status: 400,
        },
      });

      // 🔍 CustomError 401 에러 발생 확인
      await expect(refreshUserSession({ refreshToken: invalidRefreshToken })).rejects.toThrow(
        '유효하지 않은 리프레시 토큰입니다.'
      );

      expect(supabase.auth.refreshSession).toHaveBeenCalledWith({
        refresh_token: invalidRefreshToken,
      });
    });

    test('Supabase에서 session이 없으면 401 에러를 발생시킨다', async () => {
      const refreshToken = 'token-without-session';

      // 🎯 에러는 없지만 세션이 없는 응답
      supabase.auth.refreshSession.mockResolvedValue({
        data: {
          session: null, // 세션이 null
        },
        error: null,
      });

      // 🔍 세션이 없어도 401 에러 발생 확인
      await expect(refreshUserSession({ refreshToken })).rejects.toThrow('유효하지 않은 리프레시 토큰입니다.');

      expect(supabase.auth.refreshSession).toHaveBeenCalledTimes(1);
    });

    test('Supabase 에러와 빈 세션이 동시에 있으면 401 에러를 발생시킨다', async () => {
      const refreshToken = 'problematic-token';

      supabase.auth.refreshSession.mockResolvedValue({
        data: { session: null },
        error: { message: 'Some error occurred' },
      });

      await expect(refreshUserSession({ refreshToken })).rejects.toThrow('유효하지 않은 리프레시 토큰입니다.');
    });
  });

  describe('🧪 경계값 테스트', () => {
    test('매우 짧은 토큰도 검증을 시도한다', async () => {
      const shortToken = 'a'; // 1자 토큰

      supabase.auth.refreshSession.mockResolvedValue({
        data: { session: null },
        error: { message: 'Invalid token format' },
      });

      // 짧은 토큰도 Supabase로 전달되어 검증받아야 함
      await expect(refreshUserSession({ refreshToken: shortToken })).rejects.toThrow(
        '유효하지 않은 리프레시 토큰입니다.'
      );

      expect(supabase.auth.refreshSession).toHaveBeenCalledWith({
        refresh_token: shortToken,
      });
    });

    test('특수문자가 포함된 토큰도 처리한다', async () => {
      const specialToken = 'token-with-special!@#$%^&*()_+characters';

      supabase.auth.refreshSession.mockResolvedValue({
        data: {
          session: {
            access_token: 'special-access-token',
            refresh_token: 'special-refresh-token',
          },
        },
        error: null,
      });

      const result = await refreshUserSession({ refreshToken: specialToken });

      expect(result.accessToken).toBe('special-access-token');
      expect(supabase.auth.refreshSession).toHaveBeenCalledWith({
        refresh_token: specialToken,
      });
    });

    test('공백이 포함된 토큰은 Supabase로 전달된다', async () => {
      const tokenWithSpaces = '   '; // 공백만 있는 토큰

      // 🔍 실제 코드에서는 '   '가 truthy이므로 Supabase로 전달됨
      supabase.auth.refreshSession.mockResolvedValue({
        data: { session: null },
        error: { message: 'Invalid token format' },
      });

      // 공백 토큰도 Supabase로 전달되어 401 에러 발생
      await expect(refreshUserSession({ refreshToken: tokenWithSpaces })).rejects.toThrow(
        '유효하지 않은 리프레시 토큰입니다.'
      );

      // Supabase가 호출되어야 함
      expect(supabase.auth.refreshSession).toHaveBeenCalledWith({
        refresh_token: tokenWithSpaces,
      });
    });
  });

  describe('🔍 응답 데이터 구조 검증', () => {
    test('반환되는 토큰들이 올바른 형태인지 확인한다', async () => {
      const refreshToken = 'test-refresh-token';
      const mockSessionData = {
        session: {
          access_token: 'mock-access-token',
          refresh_token: 'mock-new-refresh-token',
          // 추가 Supabase 세션 데이터는 반환하지 않음을 확인
          expires_at: 1640995200,
          user: { id: 'user-123' },
          token_type: 'bearer',
        },
      };

      supabase.auth.refreshSession.mockResolvedValue({
        data: mockSessionData,
        error: null,
      });

      const result = await refreshUserSession({ refreshToken });

      // 🔍 정확히 필요한 토큰 2개만 반환하는지 확인
      expect(Object.keys(result)).toEqual(['accessToken', 'refreshToken']);
      expect(result).not.toHaveProperty('expires_at');
      expect(result).not.toHaveProperty('user');
      expect(result).not.toHaveProperty('token_type');

      // 🔍 타입 검증
      expect(typeof result.accessToken).toBe('string');
      expect(typeof result.refreshToken).toBe('string');
    });

    test('토큰이 빈 문자열이어도 그대로 반환한다', async () => {
      const refreshToken = 'empty-token-test';
      const mockSessionData = {
        session: {
          access_token: '', // 빈 액세스 토큰
          refresh_token: '', // 빈 리프레시 토큰
        },
      };

      supabase.auth.refreshSession.mockResolvedValue({
        data: mockSessionData,
        error: null,
      });

      const result = await refreshUserSession({ refreshToken });

      expect(result.accessToken).toBe('');
      expect(result.refreshToken).toBe('');
    });
  });

  describe('🎯 Supabase 호출 검증', () => {
    test('Supabase API가 정확한 형식으로 호출되는지 확인한다', async () => {
      const testToken = 'api-call-test-token';

      supabase.auth.refreshSession.mockResolvedValue({
        data: {
          session: {
            access_token: 'new-token',
            refresh_token: 'renewed-token',
          },
        },
        error: null,
      });

      await refreshUserSession({ refreshToken: testToken });

      // 🔍 API 호출 파라미터가 Supabase 형식에 맞는지 확인
      expect(supabase.auth.refreshSession).toHaveBeenCalledWith({
        refresh_token: testToken, // refresh_token (snake_case) 형식 확인
      });

      // 다른 파라미터는 전달되지 않는지 확인
      const callArgs = supabase.auth.refreshSession.mock.calls[0][0];
      expect(Object.keys(callArgs)).toEqual(['refresh_token']);
    });
  });
});
