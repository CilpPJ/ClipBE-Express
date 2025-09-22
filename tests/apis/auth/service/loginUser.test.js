import { beforeEach, describe, expect, jest, test } from '@jest/globals';

import { AUTH_ERROR_SCENARIOS } from '../../../mock/scenarios/errorCases.js';
// 🎯 새로운 구조화된 Mock 데이터 import
import { AUTH_SUCCESS_SCENARIOS } from '../../../mock/scenarios/successCases.js';

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
      const scenario = AUTH_SUCCESS_SCENARIOS.basicLogin;

      // 🎯 Supabase 인증 성공 응답 모킹
      supabase.auth.signInWithPassword.mockResolvedValue(scenario.supabaseResponse);

      // 🎯 프로필 조회 성공 응답 모킹
      findProfileByUserId.mockResolvedValue(scenario.profileResponse);

      // 🚀 실제 함수 호출
      const result = await loginUser(scenario.input);

      // 🔍 결과 검증
      expect(result).toEqual(scenario.expectedOutput);

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
      const scenario = AUTH_ERROR_SCENARIOS.invalidPassword;

      supabase.auth.signInWithPassword.mockResolvedValue(scenario.supabaseResponse);

      await expect(loginUser(scenario.input)).rejects.toThrow(CustomError);
      await expect(loginUser(scenario.input)).rejects.toThrow(scenario.expectedError.message);

      expect(findProfileByUserId).not.toHaveBeenCalled();
    });

    test('존재하지 않는 사용자 ID로 로그인 시 적절한 에러를 던진다', async () => {
      const scenario = AUTH_ERROR_SCENARIOS.userNotFound;

      supabase.auth.signInWithPassword.mockResolvedValue(scenario.supabaseResponse);

      await expect(loginUser(scenario.input)).rejects.toThrow(CustomError);
      await expect(loginUser(scenario.input)).rejects.toThrow(scenario.expectedError.message);

      expect(findProfileByUserId).not.toHaveBeenCalled();
    });

    test('인증은 성공했지만 프로필이 없는 경우 에러를 던진다', async () => {
      const scenario = AUTH_ERROR_SCENARIOS.authSuccessButNoProfile;

      supabase.auth.signInWithPassword.mockResolvedValue(scenario.supabaseResponse);
      findProfileByUserId.mockResolvedValue(scenario.profileResponse);

      await expect(loginUser(scenario.input)).rejects.toThrow(CustomError);
      await expect(loginUser(scenario.input)).rejects.toThrow(scenario.expectedError.message);

      expect(findProfileByUserId).toHaveBeenCalledWith('orphaned-user-uuid');
    });
  });
});
