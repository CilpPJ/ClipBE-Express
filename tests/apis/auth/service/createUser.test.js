import { beforeEach, describe, expect, jest, test } from '@jest/globals';

// 🎯 새로운 구조화된 Mock 데이터 import
import { AUTH_SUCCESS_SCENARIOS } from '../../../mock/scenarios/successCases.js';

// 🎯 외부 의존성 모킹 설정 (import 전에!)
jest.unstable_mockModule('../../../../src/db/supabase-client.js', () => ({
  supabase: {
    auth: {
      signUp: jest.fn(),
    },
  },
}));

jest.unstable_mockModule('../../../../src/apis/auth/repository/findProfileByNickName.js', () => ({
  findProfileByNickname: jest.fn(),
}));

jest.unstable_mockModule('../../../../src/apis/auth/repository/createProfile.js', () => ({
  createProfile: jest.fn(),
}));

// 모킹 설정 후 import
const { supabase } = await import('../../../../src/db/supabase-client.js');
const { findProfileByNickname } = await import('../../../../src/apis/auth/repository/findProfileByNickName.js');
const { createProfile } = await import('../../../../src/apis/auth/repository/createProfile.js');
const { createUser } = await import('../../../../src/apis/auth/service/createUser.js');

describe('createUser 서비스 테스트', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('✅ 성공 케이스', () => {
    test('새로운 사용자를 성공적으로 생성한다', async () => {
      const scenario = AUTH_SUCCESS_SCENARIOS.basicSignUp;

      // 🎯 닉네임 중복 검사 - 중복 없음
      findProfileByNickname.mockResolvedValue(scenario.nicknameCheckResponse);

      // 🎯 Supabase 회원가입 성공 응답
      supabase.auth.signUp.mockResolvedValue(scenario.supabaseResponse);

      // 🎯 프로필 생성 성공 응답
      createProfile.mockResolvedValue(scenario.profileCreateResponse);

      // 🚀 실제 함수 호출
      const result = await createUser(scenario.input);

      // 🔍 반환 데이터 검증
      expect(result).toEqual(scenario.expectedOutput);

      // 🔍 호출 순서 및 파라미터 검증
      expect(findProfileByNickname).toHaveBeenCalledWith('테스트유저');
      expect(supabase.auth.signUp).toHaveBeenCalledWith({
        email: 'testuser123@clip.com', // userId + @clip.com 변환 확인
        password: 'testpassword123!',
      });
      expect(createProfile).toHaveBeenCalledWith({
        id: 'supabase-user-id-123',
        nickname: '테스트유저',
      });

      // 🔍 함수 호출 횟수 검증
      expect(findProfileByNickname).toHaveBeenCalledTimes(1);
      expect(supabase.auth.signUp).toHaveBeenCalledTimes(1);
      expect(createProfile).toHaveBeenCalledTimes(1);
    });

    test('특수문자가 포함된 userId도 올바르게 처리한다', async () => {
      const mockUserData = {
        userId: 'user.test_123', // 특수문자 포함
        password: 'StrongPass123!@#',
        nickname: '특수문자유저',
      };

      findProfileByNickname.mockResolvedValue(null);
      supabase.auth.signUp.mockResolvedValue({
        data: { user: { id: 'user-id-456' } },
        error: null,
      });
      createProfile.mockResolvedValue({
        id: 'user-id-456',
        nickname: '특수문자유저',
      });

      const result = await createUser(mockUserData);

      // userId가 그대로 유지되는지 확인
      expect(result.userId).toBe('user.test_123');

      // 이메일 변환이 올바른지 확인
      expect(supabase.auth.signUp).toHaveBeenCalledWith({
        email: 'user.test_123@clip.com',
        password: 'StrongPass123!@#',
      });
    });
  });

  describe('❌ 에러 처리 테스트', () => {
    test('중복된 닉네임이 있으면 409 에러를 발생시킨다', async () => {
      const mockUserData = {
        userId: 'newuser',
        password: 'password123',
        nickname: '중복닉네임',
      };

      // 🎯 닉네임 중복 검사 - 중복 있음
      findProfileByNickname.mockResolvedValue({
        id: 'existing-user-id',
        nickname: '중복닉네임',
      });

      // 🔍 CustomError가 올바르게 발생하는지 확인
      await expect(createUser(mockUserData)).rejects.toThrow('이미 사용 중인 닉네임입니다.');

      // 🔍 에러 발생 시 다른 함수들이 호출되지 않는지 확인
      expect(findProfileByNickname).toHaveBeenCalledTimes(1);
      expect(supabase.auth.signUp).not.toHaveBeenCalled();
      expect(createProfile).not.toHaveBeenCalled();
    });

    test('Supabase 회원가입 실패 시 409 에러를 발생시킨다', async () => {
      const mockUserData = {
        userId: 'testuser',
        password: 'weakpass', // 약한 비밀번호로 실패 시뮬레이션
        nickname: '새유저',
      };

      findProfileByNickname.mockResolvedValue(null);

      // 🎯 Supabase 회원가입 실패 응답
      supabase.auth.signUp.mockResolvedValue({
        data: null,
        error: {
          message: 'Password should be at least 6 characters',
          status: 422,
        },
      });

      // 🔍 Supabase 에러가 CustomError로 변환되는지 확인
      await expect(createUser(mockUserData)).rejects.toThrow('Password should be at least 6 characters');

      // 🔍 프로필 생성은 호출되지 않아야 함
      expect(createProfile).not.toHaveBeenCalled();
    });

    test('프로필 생성 실패 시 에러가 전파된다', async () => {
      const mockUserData = {
        userId: 'testuser',
        password: 'validpassword123',
        nickname: '새유저',
      };

      findProfileByNickname.mockResolvedValue(null);
      supabase.auth.signUp.mockResolvedValue({
        data: { user: { id: 'new-user-id' } },
        error: null,
      });

      // 🎯 프로필 생성 실패
      const profileError = new Error('데이터베이스 프로필 생성 실패');
      createProfile.mockRejectedValue(profileError);

      // 🔍 프로필 생성 에러가 그대로 전파되는지 확인
      await expect(createUser(mockUserData)).rejects.toThrow('데이터베이스 프로필 생성 실패');

      // 🔍 모든 함수가 호출되었는지 확인
      expect(findProfileByNickname).toHaveBeenCalledTimes(1);
      expect(supabase.auth.signUp).toHaveBeenCalledTimes(1);
      expect(createProfile).toHaveBeenCalledTimes(1);
    });
  });

  describe('🧪 경계값 테스트', () => {
    test('빈 문자열 닉네임도 처리한다', async () => {
      const mockUserData = {
        userId: 'emptynicknameuser',
        password: 'password123',
        nickname: '', // 빈 닉네임
      };

      findProfileByNickname.mockResolvedValue(null); // 빈 닉네임도 중복 아님
      supabase.auth.signUp.mockResolvedValue({
        data: { user: { id: 'empty-nick-user-id' } },
        error: null,
      });
      createProfile.mockResolvedValue({
        id: 'empty-nick-user-id',
        nickname: '',
      });

      const result = await createUser(mockUserData);

      expect(result.nickname).toBe('');
      expect(findProfileByNickname).toHaveBeenCalledWith('');
    });

    test('매우 긴 userId와 nickname도 처리한다', async () => {
      const longUserId = 'a'.repeat(100); // 100자 userId
      const longNickname = '가'.repeat(50); // 50자 한글 닉네임

      const mockUserData = {
        userId: longUserId,
        password: 'password123',
        nickname: longNickname,
      };

      findProfileByNickname.mockResolvedValue(null);
      supabase.auth.signUp.mockResolvedValue({
        data: { user: { id: 'long-string-user-id' } },
        error: null,
      });
      createProfile.mockResolvedValue({
        id: 'long-string-user-id',
        nickname: longNickname,
      });

      const result = await createUser(mockUserData);

      expect(result.userId).toBe(longUserId);
      expect(result.nickname).toBe(longNickname);

      // 긴 userId가 올바르게 이메일로 변환되는지 확인
      expect(supabase.auth.signUp).toHaveBeenCalledWith({
        email: `${longUserId}@clip.com`,
        password: 'password123',
      });
    });

    test('null/undefined 값들도 문자열로 처리된다', async () => {
      // 실제로는 이런 값들이 컨트롤러에서 검증되어야 하지만
      // 서비스 레벨에서는 문자열로 변환되어 처리됨
      const mockUserData = {
        userId: null,
        password: 'password123',
        nickname: 'nulltest',
      };

      findProfileByNickname.mockResolvedValue(null);
      supabase.auth.signUp.mockResolvedValue({
        data: { user: { id: 'null-test-id' } },
        error: null,
      });
      createProfile.mockResolvedValue({
        id: 'null-test-id',
        nickname: 'nulltest',
      });

      const result = await createUser(mockUserData);

      // null이 문자열로 변환되어 처리되는지 확인
      expect(result.userId).toBe(null);
      expect(result.nickname).toBe('nulltest');

      // 이메일도 "null@clip.com"으로 변환되는지 확인
      expect(supabase.auth.signUp).toHaveBeenCalledWith({
        email: 'null@clip.com',
        password: 'password123',
      });
    });
  });

  describe('🔄 실행 순서 검증', () => {
    test('함수들이 올바른 순서로 호출된다', async () => {
      const mockUserData = {
        userId: 'ordertest',
        password: 'password123',
        nickname: '순서테스트',
      };

      const callOrder = [];

      // 각 모킹 함수에 순서 추적 기능 추가
      findProfileByNickname.mockImplementation(async () => {
        callOrder.push('findProfileByNickname');
        return null;
      });

      supabase.auth.signUp.mockImplementation(async () => {
        callOrder.push('supabase.auth.signUp');
        return {
          data: { user: { id: 'order-test-id' } },
          error: null,
        };
      });

      createProfile.mockImplementation(async () => {
        callOrder.push('createProfile');
        return { id: 'order-test-id', nickname: '순서테스트' };
      });

      await createUser(mockUserData);

      // 🔍 올바른 순서로 호출되었는지 확인
      expect(callOrder).toEqual([
        'findProfileByNickname', // 1. 닉네임 중복 검사
        'supabase.auth.signUp', // 2. Supabase 회원가입
        'createProfile', // 3. 프로필 생성
      ]);
    });
  });
});
