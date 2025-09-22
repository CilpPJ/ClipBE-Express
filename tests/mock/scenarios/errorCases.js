// ❌ 실패 케이스 시나리오들
// 다양한 에러 상황을 테스트하기 위한 시나리오 데이터
import { PROFILE_ENTITIES } from '../entities/profiles.js';
import { INVALID_AUTH_INPUTS } from '../inputs/authInputs.js';
import { AUTH_ERROR_RESPONSES } from '../supabase/authResponses.js';

// 🔐 인증 실패 시나리오들
export const AUTH_ERROR_SCENARIOS = {
  // 잘못된 비밀번호 로그인
  invalidPassword: {
    input: INVALID_AUTH_INPUTS.invalidLogin,
    supabaseResponse: {
      data: null,
      error: AUTH_ERROR_RESPONSES.invalidCredentials,
    },
    expectedError: {
      name: 'CustomError',
      message: '아이디 또는 비밀번호가 잘못되었습니다.',
      statusCode: 404,
    },
    shouldNotCallProfile: true,
  },

  // 존재하지 않는 사용자
  userNotFound: {
    input: INVALID_AUTH_INPUTS.nonExistentUser,
    supabaseResponse: {
      data: null,
      error: AUTH_ERROR_RESPONSES.userNotFound,
    },
    expectedError: {
      name: 'CustomError',
      message: '아이디 또는 비밀번호가 잘못되었습니다.',
      statusCode: 404,
    },
    shouldNotCallProfile: true,
  },

  // 인증 성공했지만 프로필 없음
  authSuccessButNoProfile: {
    input: INVALID_AUTH_INPUTS.invalidLogin,
    supabaseResponse: {
      data: {
        user: { id: 'orphaned-user-uuid' },
        session: {
          access_token: 'orphaned-token',
          refresh_token: 'orphaned-refresh',
        },
      },
      error: null,
    },
    profileResponse: null, // 프로필을 찾을 수 없음
    expectedError: {
      name: 'CustomError',
      message: '사용자 프로필을 찾을 수 없습니다.',
      statusCode: 404,
    },
  },

  // 닉네임 중복 회원가입
  duplicateNickname: {
    input: INVALID_AUTH_INPUTS.duplicateNickname,
    nicknameCheckResponse: PROFILE_ENTITIES.basic, // 이미 존재하는 닉네임
    expectedError: {
      name: 'CustomError',
      message: '이미 사용 중인 닉네임입니다.',
      statusCode: 409,
    },
    shouldNotCallSupabase: true,
  },

  // Supabase 회원가입 실패 (이메일 중복)
  supabaseSignUpFailure: {
    input: INVALID_AUTH_INPUTS.duplicateEmail,
    nicknameCheckResponse: null, // 닉네임은 사용 가능
    supabaseResponse: {
      data: null,
      error: AUTH_ERROR_RESPONSES.emailAlreadyExists,
    },
    expectedError: {
      name: 'CustomError',
      message: AUTH_ERROR_RESPONSES.emailAlreadyExists.message,
      statusCode: 409,
    },
    shouldNotCallProfileCreate: true,
  },

  // 약한 비밀번호 회원가입
  weakPassword: {
    input: INVALID_AUTH_INPUTS.weakPassword,
    nicknameCheckResponse: null,
    supabaseResponse: {
      data: null,
      error: AUTH_ERROR_RESPONSES.weakPassword,
    },
    expectedError: {
      name: 'CustomError',
      message: AUTH_ERROR_RESPONSES.weakPassword.message,
      statusCode: 409,
    },
  },

  // 잘못된 리프레시 토큰
  invalidRefreshToken: {
    input: INVALID_AUTH_INPUTS.expiredToken,
    supabaseResponse: {
      data: null,
      error: AUTH_ERROR_RESPONSES.invalidRefreshToken,
    },
    expectedError: {
      name: 'CustomError',
      message: '유효하지 않은 리프레시 토큰입니다.',
      statusCode: 401,
    },
  },

  // 빈 리프레시 토큰
  emptyRefreshToken: {
    input: INVALID_AUTH_INPUTS.emptyToken,
    expectedError: {
      name: 'CustomError',
      message: '리프레시 토큰이 필요합니다.',
      statusCode: 400,
    },
    shouldNotCallSupabase: true,
  },

  // null 리프레시 토큰
  nullRefreshToken: {
    input: INVALID_AUTH_INPUTS.nullToken,
    expectedError: {
      name: 'CustomError',
      message: '리프레시 토큰이 필요합니다.',
      statusCode: 400,
    },
    shouldNotCallSupabase: true,
  },
};

// 📎 클립 실패 시나리오들
export const CLIP_ERROR_SCENARIOS = {
  // Repository에서 에러 발생
  repositoryError: {
    repositoryError: new Error('Database connection failed'),
    expectedError: {
      name: 'Error',
      message: 'Database connection failed',
    },
  },

  // Repository에서 null 반환
  repositoryNull: {
    repositoryResponse: null,
    expectedError: {
      name: 'Error',
      message: 'Repository returned null',
    },
  },

  // tags 객체가 null인 경우 (실제 코드 동작)
  nullTags: {
    repositoryResponse: [
      {
        title: '태그 없는 클립',
        tag_id: 5,
        url: 'https://no-tags.com',
        thumbnail: null,
        tags: null, // 이것이 에러를 발생시킴
        memo: '태그 정보가 없는 클립',
        created_at: '2025-09-22T16:30:00.000Z',
      },
    ],
    expectedError: {
      name: 'TypeError',
      message: 'Cannot read properties of null (reading \'name\')',
    },
  },
};
