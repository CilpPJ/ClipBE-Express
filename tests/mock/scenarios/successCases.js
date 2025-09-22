// ✅ 성공 케이스 시나리오들
// 다양한 기능의 성공적인 흐름을 테스트하기 위한 시나리오 데이터
import { CLIP_ENTITIES, PRODUCTION_CLIPS } from '../entities/clips.js';
import { PROFILE_ENTITIES } from '../entities/profiles.js';
import { VALID_AUTH_INPUTS } from '../inputs/authInputs.js';
import { AUTH_SUCCESS_RESPONSES } from '../supabase/authResponses.js';

// 🔐 인증 성공 시나리오들
export const AUTH_SUCCESS_SCENARIOS = {
  // 기본 로그인 성공 플로우
  basicLogin: {
    input: VALID_AUTH_INPUTS.login,
    supabaseResponse: {
      data: AUTH_SUCCESS_RESPONSES.signIn,
      error: null,
    },
    profileResponse: PROFILE_ENTITIES.basic,
    expectedOutput: {
      accessToken: AUTH_SUCCESS_RESPONSES.signIn.session.access_token,
      refreshToken: AUTH_SUCCESS_RESPONSES.signIn.session.refresh_token,
      nickname: PROFILE_ENTITIES.basic.nickname,
    },
  },

  // 특수문자 포함 로그인 성공
  specialCharLogin: {
    input: VALID_AUTH_INPUTS.loginWithSpecialChars,
    supabaseResponse: {
      data: AUTH_SUCCESS_RESPONSES.signIn,
      error: null,
    },
    profileResponse: PROFILE_ENTITIES.specialNickname,
    expectedOutput: {
      accessToken: AUTH_SUCCESS_RESPONSES.signIn.session.access_token,
      refreshToken: AUTH_SUCCESS_RESPONSES.signIn.session.refresh_token,
      nickname: PROFILE_ENTITIES.specialNickname.nickname,
    },
  },

  // 회원가입 성공 플로우
  basicSignUp: {
    input: VALID_AUTH_INPUTS.signUp,
    nicknameCheckResponse: null, // 닉네임 중복 없음
    supabaseResponse: {
      data: AUTH_SUCCESS_RESPONSES.signUp,
      error: null,
    },
    profileCreateResponse: PROFILE_ENTITIES.newUser,
    expectedOutput: {
      userId: VALID_AUTH_INPUTS.signUp.userId,
      nickname: PROFILE_ENTITIES.newUser.nickname,
    },
  },

  // 토큰 리프레시 성공 플로우
  tokenRefresh: {
    input: VALID_AUTH_INPUTS.tokenRefresh,
    supabaseResponse: {
      data: AUTH_SUCCESS_RESPONSES.refreshSession,
      error: null,
    },
    expectedOutput: {
      accessToken: AUTH_SUCCESS_RESPONSES.refreshSession.session.access_token,
      refreshToken: AUTH_SUCCESS_RESPONSES.refreshSession.session.refresh_token,
    },
  },
};

// 📎 클립 성공 시나리오들
export const CLIP_SUCCESS_SCENARIOS = {
  // 기본 클립 조회 성공
  getAllClipsBasic: {
    repositoryResponse: CLIP_ENTITIES.basic,
    expectedDataTransform: CLIP_ENTITIES.basic.map((clip) => ({
      title: clip.title,
      tagId: clip.tag_id,
      url: clip.url,
      thumbnail: clip.thumbnail,
      tagName: clip.tags?.name,
      memo: clip.memo,
      createdAt: clip.created_at,
    })),
  },

  // 빈 클립 목록 조회 성공
  getAllClipsEmpty: {
    repositoryResponse: CLIP_ENTITIES.empty,
    expectedDataTransform: [],
  },

  // 단일 클립 조회 성공
  getAllClipsSingle: {
    repositoryResponse: CLIP_ENTITIES.single,
    expectedDataTransform: CLIP_ENTITIES.single.map((clip) => ({
      title: clip.title,
      tagId: clip.tag_id,
      url: clip.url,
      thumbnail: clip.thumbnail,
      tagName: clip.tags?.name,
      memo: clip.memo,
      createdAt: clip.created_at,
    })),
  },

  // 실제 프로덕션 데이터와 같은 대량 클립 처리
  getAllClipsProduction: {
    repositoryResponse: PRODUCTION_CLIPS,
    expectedDataTransform: PRODUCTION_CLIPS.map((clip) => ({
      title: clip.title,
      tagId: clip.tag_id,
      url: clip.url,
      thumbnail: clip.thumbnail,
      tagName: clip.tags?.name,
      memo: clip.memo,
      createdAt: clip.created_at,
    })),
  },
};
