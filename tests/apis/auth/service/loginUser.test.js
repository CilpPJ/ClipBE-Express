import { beforeEach, describe, expect, jest, test } from '@jest/globals';

// 🔧 테스트 헬퍼 함수 import
import { createAuthResponse } from '../../../helpers/authTestHelpers.js';
// 🎯 Mock 데이터 import
import { MOCK_AUTH_DATA, MOCK_LOGIN_DATA, MOCK_PROFILE_DATA } from '../../../mock/authMockData.js';

// 🎯 Supabase 모킹 (Firebase 모킹과 비슷!)
jest.unstable_mockModule('../../../../src/db/supabase-client.js', () => ({
  supabase: {
    auth: {
      signInWithPassword: jest.fn(),
    },
  },
}));

// 🎯 Repository 모킹 (API 호출 모킹과 비슷!)
jest.unstable_mockModule('../../../../src/apis/auth/repository/findProfileByUserId.js', () => ({
  findProfileByUserId: jest.fn(),
}));

// 모킹된 모듈들을 import
const { supabase } = await import('../../../../src/db/supabase-client.js');
const { findProfileByUserId } = await import('../../../../src/apis/auth/repository/findProfileByUserId.js');
const { loginUser } = await import('../../../../src/apis/auth/service/loginUser.js');
const { CustomError } = await import('../../../../src/utils/errors.js');

describe('loginUser 서비스 테스트', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('✅ 성공 케이스', () => {
    test('올바른 사용자 정보로 로그인에 성공한다', async () => {
      // 🎯 Supabase 인증 성공 응답 모킹
      supabase.auth.signInWithPassword.mockResolvedValue({
        data: MOCK_AUTH_DATA.loginSuccess,
        error: null,
      });

      // 🎯 프로필 조회 성공 응답 모킹
      findProfileByUserId.mockResolvedValue(MOCK_PROFILE_DATA.basic);

      // 🚀 실제 함수 호출
      const result = await loginUser(MOCK_LOGIN_DATA.validCredentials);

      // 🔍 결과 검증
      const expectedResponse = createAuthResponse(MOCK_AUTH_DATA.loginSuccess, MOCK_PROFILE_DATA.basic);
      expect(result).toEqual(expectedResponse);

      // 🔍 함수 호출 검증
      expect(supabase.auth.signInWithPassword).toHaveBeenCalledWith({
        email: 'testuser@clip.com',
        password: 'password123!',
      });

      expect(findProfileByUserId).toHaveBeenCalledWith('user-123-uuid');
    });
  });

  describe('❌ 실패 케이스', () => {
    test('잘못된 비밀번호로 로그인 시 적절한 에러를 던진다', async () => {
      supabase.auth.signInWithPassword.mockResolvedValue({
        data: null,
        error: MOCK_AUTH_DATA.authError,
      });

      await expect(loginUser(MOCK_LOGIN_DATA.invalidPassword)).rejects.toThrow(CustomError);
      await expect(loginUser(MOCK_LOGIN_DATA.invalidPassword)).rejects.toThrow(
        '아이디 또는 비밀번호가 잘못되었습니다.'
      );

      expect(findProfileByUserId).not.toHaveBeenCalled();
    });

    test('존재하지 않는 사용자 ID로 로그인 시 적절한 에러를 던진다', async () => {
      supabase.auth.signInWithPassword.mockResolvedValue({
        data: null,
        error: MOCK_AUTH_DATA.authError,
      });

      await expect(loginUser(MOCK_LOGIN_DATA.nonExistentUser)).rejects.toThrow(CustomError);
    });
  });
});
