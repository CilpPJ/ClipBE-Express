import { beforeEach, describe, expect, jest, test } from '@jest/globals';

// Supabase 클라이언트 모킹
jest.unstable_mockModule('../../src/db/supabase-client.js', () => ({
  supabase: {
    auth: {
      getUser: jest.fn(),
    },
  },
}));

// 모킹 설정 후 import
const { supabase } = await import('../../src/db/supabase-client.js');
const { authenticateToken, conditionalAuth } = await import('../../src/middlewares/auth.js');

describe('인증 미들웨어 테스트', () => {
  let req, res, next;

  beforeEach(() => {
    jest.clearAllMocks();

    req = {
      headers: {},
      path: '/api/clips',
    };

    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    next = jest.fn();
  });

  describe('authenticateToken 미들웨어', () => {
    describe('✅ 성공 케이스', () => {
      test('유효한 토큰으로 인증에 성공한다', async () => {
        // 🎯 Mock 설정
        const mockUser = {
          id: 'user-123',
          email: 'test@example.com',
        };

        req.headers.authorization = 'Bearer valid-token';
        supabase.auth.getUser.mockResolvedValue({
          data: { user: mockUser },
          error: null,
        });

        // 🚀 실제 함수 호출
        await authenticateToken(req, res, next);

        // 🔍 검증
        expect(supabase.auth.getUser).toHaveBeenCalledWith('valid-token');
        expect(req.user).toEqual(mockUser);
        expect(next).toHaveBeenCalled();
        expect(res.status).not.toHaveBeenCalled();
        expect(res.json).not.toHaveBeenCalled();
      });
    });

    describe('❌ 실패 케이스', () => {
      test('Authorization 헤더가 없으면 401 에러를 반환한다', async () => {
        // 🚀 실제 함수 호출
        await authenticateToken(req, res, next);

        // 🔍 검증
        expect(res.status).toHaveBeenCalledWith(401);
        expect(res.json).toHaveBeenCalledWith({
          data: null,
          status: 'ERROR',
          serverDateTime: expect.any(String),
          errorCode: 'UNAUTHORIZED',
          errorMessage: '토큰이 제공되지 않았습니다.',
        });
        expect(next).not.toHaveBeenCalled();
      });

      test('Bearer 형식이 아닌 토큰이면 401 에러를 반환한다', async () => {
        req.headers.authorization = 'InvalidFormat token';

        // 🚀 실제 함수 호출
        await authenticateToken(req, res, next);

        // 🔍 검증
        expect(res.status).toHaveBeenCalledWith(401);
        expect(res.json).toHaveBeenCalledWith({
          data: null,
          status: 'ERROR',
          serverDateTime: expect.any(String),
          errorCode: 'UNAUTHORIZED',
          errorMessage: '토큰이 제공되지 않았습니다.',
        });
        expect(next).not.toHaveBeenCalled();
      });

      test('유효하지 않은 토큰이면 401 에러를 반환한다', async () => {
        req.headers.authorization = 'Bearer invalid-token';
        supabase.auth.getUser.mockResolvedValue({
          data: { user: null },
          error: { message: 'Invalid JWT' },
        });

        // 🚀 실제 함수 호출
        await authenticateToken(req, res, next);

        // 🔍 검증
        expect(res.status).toHaveBeenCalledWith(401);
        expect(res.json).toHaveBeenCalledWith({
          data: null,
          status: 'ERROR',
          serverDateTime: expect.any(String),
          errorCode: 'UNAUTHORIZED',
          errorMessage: '유효하지 않거나 만료된 토큰입니다.',
        });
        expect(next).not.toHaveBeenCalled();
      });

      test('만료된 토큰이면 401 에러를 반환한다', async () => {
        req.headers.authorization = 'Bearer expired-token';
        supabase.auth.getUser.mockResolvedValue({
          data: { user: null },
          error: null,
        });

        // 🚀 실제 함수 호출
        await authenticateToken(req, res, next);

        // 🔍 검증
        expect(res.status).toHaveBeenCalledWith(401);
        expect(res.json).toHaveBeenCalledWith({
          data: null,
          status: 'ERROR',
          serverDateTime: expect.any(String),
          errorCode: 'UNAUTHORIZED',
          errorMessage: '유효하지 않거나 만료된 토큰입니다.',
        });
        expect(next).not.toHaveBeenCalled();
      });

      test('Supabase 에러 발생 시 500 에러를 반환한다', async () => {
        req.headers.authorization = 'Bearer some-token';
        supabase.auth.getUser.mockRejectedValue(new Error('Supabase connection failed'));

        // 🚀 실제 함수 호출
        await authenticateToken(req, res, next);

        // 🔍 검증
        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({
          data: null,
          status: 'ERROR',
          serverDateTime: expect.any(String),
          errorCode: 'INTERNAL_ERROR',
          errorMessage: '인증 처리 중 오류가 발생했습니다.',
        });
        expect(next).not.toHaveBeenCalled();
      });
    });
  });

  describe('conditionalAuth 미들웨어', () => {
    describe('✅ 성공 케이스', () => {
      test('제외 경로는 인증 없이 통과한다', () => {
        const middleware = conditionalAuth(['/api/auth']);
        req.path = '/api/auth/login';

        // 🚀 실제 함수 호출
        middleware(req, res, next);

        // 🔍 검증
        expect(next).toHaveBeenCalled();
        expect(res.status).not.toHaveBeenCalled();
        expect(res.json).not.toHaveBeenCalled();
      });

      test('정규표현식 제외 경로도 정상 작동한다', () => {
        const middleware = conditionalAuth([/^\/api\/auth/]);
        req.path = '/api/auth/signup';

        // 🚀 실제 함수 호출
        middleware(req, res, next);

        // 🔍 검증
        expect(next).toHaveBeenCalled();
        expect(res.status).not.toHaveBeenCalled();
        expect(res.json).not.toHaveBeenCalled();
      });

      test('인증이 필요한 경로는 authenticateToken을 호출한다', async () => {
        const middleware = conditionalAuth(['/api/auth']);
        req.path = '/api/clips';
        req.headers.authorization = 'Bearer valid-token';

        const mockUser = { id: 'user-123' };
        supabase.auth.getUser.mockResolvedValue({
          data: { user: mockUser },
          error: null,
        });

        // 🚀 실제 함수 호출
        await middleware(req, res, next);

        // 🔍 검증
        expect(supabase.auth.getUser).toHaveBeenCalledWith('valid-token');
        expect(req.user).toEqual(mockUser);
        expect(next).toHaveBeenCalled();
      });
    });

    describe('❌ 실패 케이스', () => {
      test('인증이 필요한 경로에서 토큰이 없으면 401 에러를 반환한다', async () => {
        const middleware = conditionalAuth(['/api/auth']);
        req.path = '/api/clips';

        // 🚀 실제 함수 호출
        await middleware(req, res, next);

        // 🔍 검증
        expect(res.status).toHaveBeenCalledWith(401);
        expect(res.json).toHaveBeenCalledWith({
          data: null,
          status: 'ERROR',
          serverDateTime: expect.any(String),
          errorCode: 'UNAUTHORIZED',
          errorMessage: '토큰이 제공되지 않았습니다.',
        });
        expect(next).not.toHaveBeenCalled();
      });
    });
  });
});
