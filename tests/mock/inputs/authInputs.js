// 🔐 인증 관련 사용자 입력 Mock 데이터
// 클라이언트에서 서버로 전송되는 입력 형태들

// ✅ 유효한 입력들
export const VALID_AUTH_INPUTS = {
  // 로그인 입력
  login: {
    userId: 'testuser',
    password: 'password123!',
  },

  // 특수문자 포함 로그인
  loginWithSpecialChars: {
    userId: 'special!@#',
    password: 'pass!@#$%^&*()',
  },

  // 회원가입 입력
  signUp: {
    userId: 'testuser123',
    password: 'testpassword123!',
    nickname: '테스트유저',
  },

  // 특수문자 닉네임 회원가입
  signUpWithSpecialNickname: {
    userId: 'specialuser',
    password: 'password123!',
    nickname: '특수문자!@#',
  },

  // 토큰 리프레시 입력
  tokenRefresh: {
    refreshToken: 'valid-refresh-token-12345',
  },

  // 긴 토큰 리프레시 입력
  longTokenRefresh: {
    refreshToken: `very-long-refresh-token-${'a'.repeat(500)}`,
  },
};

// ❌ 유효하지 않은 입력들
export const INVALID_AUTH_INPUTS = {
  // 잘못된 로그인 입력
  invalidLogin: {
    userId: 'testuser',
    password: 'wrongpassword',
  },

  // 존재하지 않는 사용자
  nonExistentUser: {
    userId: 'nonexistent',
    password: 'password123!',
  },

  // 빈 필드 로그인
  emptyLogin: {
    userId: '',
    password: '',
  },

  // null 필드 로그인
  nullLogin: {
    userId: null,
    password: null,
  },

  // 중복 닉네임 회원가입
  duplicateNickname: {
    userId: 'newuser456',
    password: 'password123!',
    nickname: '중복닉네임',
  },

  // 중복 이메일 회원가입
  duplicateEmail: {
    userId: 'existinguser',
    password: 'password123!',
    nickname: '새로운닉네임',
  },

  // 약한 비밀번호 회원가입
  weakPassword: {
    userId: 'testuser789',
    password: '123', // 너무 짧음
    nickname: '유효한닉네임',
  },

  // 빈 닉네임 회원가입
  emptyNickname: {
    userId: 'validuser',
    password: 'password123!',
    nickname: '',
  },

  // 만료된 리프레시 토큰
  expiredToken: {
    refreshToken: 'expired-refresh-token-67890',
  },

  // 잘못된 형식 토큰
  malformedToken: {
    refreshToken: 'invalid-token-format',
  },

  // 빈 토큰
  emptyToken: {
    refreshToken: '',
  },

  // null 토큰
  nullToken: {
    refreshToken: null,
  },
};

// 🧪 경계값 테스트 입력들
export const EDGE_CASE_AUTH_INPUTS = {
  // 최대 길이 입력
  maxLength: {
    userId: 'a'.repeat(50),
    password: `P@ssw0rd!${'a'.repeat(50)}`,
    nickname: '가'.repeat(20),
  },

  // 최소 길이 입력
  minLength: {
    userId: 'a',
    password: 'P@ss1!',
    nickname: '가',
  },

  // 유니코드 문자 입력
  unicode: {
    userId: '사용자123',
    password: 'パスワード123!',
    nickname: '🎉테스트🎉',
  },

  // 공백 포함 입력
  withSpaces: {
    userId: ' user with spaces ',
    password: ' password with spaces ',
    nickname: ' nickname with spaces ',
  },
};
