// 🧪 성능 최적화를 위한 상수 정의
const LONG_USER_ID = 'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa'; // 50자
const LONG_PASSWORD_SUFFIX = 'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa'; // 50자
const LONG_NICKNAME_KO = '가가가가가가가가가가가가가가가가가가가가'; // 20자
const VERY_LONG_NICKNAME = '매우긴닉네임매우긴닉네임매우긴닉네임매우긴닉네임매우긴닉네임'; // repeat(5)
// 500자 토큰 (ESLint 줄 길이 제한 대응)
const LONG_REFRESH_TOKEN_SUFFIX =
  'a'.repeat(100) + 'a'.repeat(100) + 'a'.repeat(100) + 'a'.repeat(100) + 'a'.repeat(100); // 500자
const TWENTY_A = 'AAAAAAAAAAAAAAAAAAAA'; // 20자

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
    refreshToken: `very-long-refresh-token-${LONG_REFRESH_TOKEN_SUFFIX}`,
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
    userId: LONG_USER_ID,
    password: `P@ssw0rd!${LONG_PASSWORD_SUFFIX}`,
    nickname: LONG_NICKNAME_KO,
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

  // 특수문자 포함 로그인 (edgeCases.js에서 사용)
  specialCharLogin: {
    userId: 'special!@#',
    password: 'pass!@#$%^&*()',
  },

  // 긴 닉네임 회원가입 (edgeCases.js에서 사용)
  longNicknameSignUp: {
    userId: 'longuser',
    password: 'password123!',
    nickname: VERY_LONG_NICKNAME,
  },

  // 빈 닉네임 회원가입 (edgeCases.js에서 사용)
  emptyNicknameSignUp: {
    userId: 'emptyuser',
    password: 'password123!',
    nickname: '',
  },

  // 최대 길이 닉네임 (edgeCases.js에서 사용)
  maxLengthNickname: {
    userId: 'maxuser',
    password: 'password123!',
    nickname: TWENTY_A,
  },

  // 최소 길이 닉네임 (edgeCases.js에서 사용)
  minLengthNickname: {
    userId: 'minuser',
    password: 'password123!',
    nickname: 'A',
  },

  // 유니코드 닉네임 (edgeCases.js에서 사용)
  unicodeNickname: {
    userId: 'unicodeuser',
    password: 'password123!',
    nickname: '테스트😀한자漢字',
  },

  // 만료 직전 토큰 (edgeCases.js에서 사용)
  tokenNearExpiry: {
    refreshToken: 'near-expiry-token-12345',
  },
};
