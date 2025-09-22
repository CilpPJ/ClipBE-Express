// 🔌 Supabase Auth API 응답 Mock 데이터
// 외부 Supabase 서비스에서 반환되는 응답 형태들

// ✅ 성공 응답들
export const AUTH_SUCCESS_RESPONSES = {
  // 로그인 성공
  signIn: {
    user: {
      id: 'user-123-uuid',
      email: 'testuser@clip.com',
      created_at: '2025-09-01T00:00:00.000Z',
    },
    session: {
      access_token: 'mock-access-token-12345',
      refresh_token: 'mock-refresh-token-67890',
      expires_at: 1640995200,
      token_type: 'bearer',
    },
  },

  // 회원가입 성공
  signUp: {
    user: {
      id: 'supabase-user-id-123',
      email: 'testuser123@clip.com',
      created_at: '2025-09-23T10:00:00.000Z',
    },
    session: null, // 이메일 확인 전이라 세션 없음
  },

  // 토큰 리프레시 성공
  refreshSession: {
    session: {
      access_token: 'new-access-token-67890',
      refresh_token: 'new-refresh-token-67890',
      expires_at: 1640995200,
      token_type: 'bearer',
      user: {
        id: 'user-id-123',
        email: 'test@clip.com',
      },
    },
  },
};

// ❌ 에러 응답들
export const AUTH_ERROR_RESPONSES = {
  // 잘못된 로그인 정보
  invalidCredentials: {
    message: 'Invalid login credentials',
    status: 400,
    code: 'invalid_credentials',
  },

  // 사용자 없음
  userNotFound: {
    message: 'User not found',
    status: 404,
    code: 'user_not_found',
  },

  // 이메일 중복 (회원가입 실패)
  emailAlreadyExists: {
    message: 'User already registered',
    status: 422,
    code: 'email_exists',
  },

  // 잘못된 리프레시 토큰
  invalidRefreshToken: {
    message: 'Invalid refresh token',
    status: 401,
    code: 'invalid_token',
  },

  // 만료된 토큰
  expiredToken: {
    message: 'Token has expired',
    status: 401,
    code: 'token_expired',
  },

  // 약한 비밀번호
  weakPassword: {
    message: 'Password should be at least 6 characters',
    status: 422,
    code: 'weak_password',
  },
};
