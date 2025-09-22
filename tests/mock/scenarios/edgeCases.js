// 🔀 엣지 케이스 시나리오들
// 특수한 상황과 경계값을 테스트하기 위한 시나리오 데이터
import { CLIP_ENTITIES } from '../entities/clips.js';
import { PROFILE_ENTITIES } from '../entities/profiles.js';
import { EDGE_CASE_AUTH_INPUTS } from '../inputs/authInputs.js';
import { AUTH_SUCCESS_RESPONSES } from '../supabase/authResponses.js';

// 🔐 인증 엣지 케이스 시나리오들
export const AUTH_EDGE_CASE_SCENARIOS = {
  // 특수문자가 포함된 닉네임 로그인
  specialCharacterNickname: {
    input: EDGE_CASE_AUTH_INPUTS.specialCharLogin,
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

  // 매우 긴 닉네임으로 회원가입
  longNickname: {
    input: EDGE_CASE_AUTH_INPUTS.longNicknameSignUp,
    nicknameCheckResponse: null,
    supabaseResponse: {
      data: AUTH_SUCCESS_RESPONSES.signIn,
      error: null,
    },
    profileCreateResponse: PROFILE_ENTITIES.longNickname,
    expectedOutput: {
      accessToken: AUTH_SUCCESS_RESPONSES.signIn.session.access_token,
      refreshToken: AUTH_SUCCESS_RESPONSES.signIn.session.refresh_token,
      nickname: PROFILE_ENTITIES.longNickname.nickname,
    },
  },

  // 빈 닉네임 (Supabase에서 프로필 생성은 되지만 빈 값)
  emptyNickname: {
    input: EDGE_CASE_AUTH_INPUTS.emptyNicknameSignUp,
    nicknameCheckResponse: null,
    supabaseResponse: {
      data: AUTH_SUCCESS_RESPONSES.signIn,
      error: null,
    },
    profileCreateResponse: PROFILE_ENTITIES.emptyNickname,
    expectedOutput: {
      accessToken: AUTH_SUCCESS_RESPONSES.signIn.session.access_token,
      refreshToken: AUTH_SUCCESS_RESPONSES.signIn.session.refresh_token,
      nickname: '', // 빈 닉네임
    },
  },

  // 최대 길이 닉네임 (경계값)
  maxLengthNickname: {
    input: EDGE_CASE_AUTH_INPUTS.maxLengthNickname,
    nicknameCheckResponse: null,
    supabaseResponse: {
      data: AUTH_SUCCESS_RESPONSES.signIn,
      error: null,
    },
    profileCreateResponse: {
      ...PROFILE_ENTITIES.basic,
      nickname: 'A'.repeat(20), // 최대 20자 가정
    },
    expectedOutput: {
      accessToken: AUTH_SUCCESS_RESPONSES.signIn.session.access_token,
      refreshToken: AUTH_SUCCESS_RESPONSES.signIn.session.refresh_token,
      nickname: 'A'.repeat(20),
    },
  },

  // 최소 길이 닉네임 (경계값)
  minLengthNickname: {
    input: EDGE_CASE_AUTH_INPUTS.minLengthNickname,
    nicknameCheckResponse: null,
    supabaseResponse: {
      data: AUTH_SUCCESS_RESPONSES.signIn,
      error: null,
    },
    profileCreateResponse: {
      ...PROFILE_ENTITIES.basic,
      nickname: 'A', // 최소 1자 가정
    },
    expectedOutput: {
      accessToken: AUTH_SUCCESS_RESPONSES.signIn.session.access_token,
      refreshToken: AUTH_SUCCESS_RESPONSES.signIn.session.refresh_token,
      nickname: 'A',
    },
  },

  // Unicode 문자 닉네임 (이모지, 한자 등)
  unicodeNickname: {
    input: EDGE_CASE_AUTH_INPUTS.unicodeNickname,
    nicknameCheckResponse: null,
    supabaseResponse: {
      data: AUTH_SUCCESS_RESPONSES.signIn,
      error: null,
    },
    profileCreateResponse: {
      ...PROFILE_ENTITIES.basic,
      nickname: '테스트😀한자漢字',
    },
    expectedOutput: {
      accessToken: AUTH_SUCCESS_RESPONSES.signIn.session.access_token,
      refreshToken: AUTH_SUCCESS_RESPONSES.signIn.session.refresh_token,
      nickname: '테스트😀한자漢字',
    },
  },

  // 만료 직전 토큰 갱신
  tokenNearExpiry: {
    input: EDGE_CASE_AUTH_INPUTS.tokenNearExpiry,
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

// 📎 클립 엣지 케이스 시나리오들
export const CLIP_EDGE_CASE_SCENARIOS = {
  // 빈 배열 반환 (클립이 없는 경우)
  emptyClips: {
    repositoryResponse: [],
    expectedOutput: [],
    description: '사용자가 클립을 하나도 생성하지 않은 경우',
  },

  // 태그가 없는 클립만 있는 경우
  clipsWithoutTags: {
    repositoryResponse: CLIP_ENTITIES.withoutTags,
    expectedOutput: [
      {
        title: '태그 없는 클립',
        tagName: '',
        url: 'https://no-tags.com',
        thumbnail: null,
        memo: '태그 정보가 없는 클립',
        createdAt: '2025-09-22T16:30:00.000Z',
      },
    ],
    description: '태그가 연결되지 않은 클립들만 있는 경우',
  },

  // 매우 많은 클립 (성능 테스트용)
  manyClips: {
    repositoryResponse: Array.from({ length: 100 }, (_, index) => ({
      title: `클립 ${index + 1}`,
      tag_id: Math.floor(index / 10) + 1,
      url: `https://example${index}.com`,
      thumbnail: index % 2 === 0 ? `thumbnail${index}.jpg` : null,
      tags: {
        name: `태그${Math.floor(index / 10) + 1}`,
        color: `#${String(index).padStart(6, '0')}`,
      },
      memo: `클립 ${index + 1}의 메모`,
      created_at: new Date(Date.now() - index * 86400000).toISOString(),
    })),
    expectedOutputLength: 100,
    description: '대량의 클립 데이터 처리 테스트',
  },

  // 썸네일이 모두 null인 경우
  noThumbnails: {
    repositoryResponse: [
      {
        title: '썸네일 없는 클립1',
        tag_id: 1,
        url: 'https://no-thumb1.com',
        thumbnail: null,
        tags: { name: '기본', color: '#FF0000' },
        memo: '썸네일이 없는 클립1',
        created_at: '2025-01-01T00:00:00.000Z',
      },
      {
        title: '썸네일 없는 클립2',
        tag_id: 2,
        url: 'https://no-thumb2.com',
        thumbnail: null,
        tags: { name: '중요', color: '#00FF00' },
        memo: '썸네일이 없는 클립2',
        created_at: '2025-01-02T00:00:00.000Z',
      },
    ],
    expectedOutput: [
      {
        title: '썸네일 없는 클립1',
        tagName: '기본',
        url: 'https://no-thumb1.com',
        thumbnail: null,
        memo: '썸네일이 없는 클립1',
        createdAt: '2025-01-01T00:00:00.000Z',
      },
      {
        title: '썸네일 없는 클립2',
        tagName: '중요',
        url: 'https://no-thumb2.com',
        thumbnail: null,
        memo: '썸네일이 없는 클립2',
        createdAt: '2025-01-02T00:00:00.000Z',
      },
    ],
    description: '모든 클립에 썸네일이 없는 경우',
  },

  // 매우 긴 URL을 가진 클립
  longUrlClip: {
    repositoryResponse: [
      {
        title: '매우 긴 URL 클립',
        tag_id: 1,
        url:
          'https://example.com/very/long/path/that/continues/for/many/segments/and/includes/query/' +
          'parameters?param1=value1&param2=value2&param3=value3&param4=very-long-value-that-keeps-going',
        thumbnail: 'long-url-thumb.jpg',
        tags: { name: 'URL', color: '#0000FF' },
        memo: '매우 긴 URL을 가진 클립 테스트',
        created_at: '2025-01-01T00:00:00.000Z',
      },
    ],
    expectedOutput: [
      {
        title: '매우 긴 URL 클립',
        tagName: 'URL',
        url:
          'https://example.com/very/long/path/that/continues/for/many/segments/and/includes/query/' +
          'parameters?param1=value1&param2=value2&param3=value3&param4=very-long-value-that-keeps-going',
        thumbnail: 'long-url-thumb.jpg',
        memo: '매우 긴 URL을 가진 클립 테스트',
        createdAt: '2025-01-01T00:00:00.000Z',
      },
    ],
    description: '매우 긴 URL을 처리할 수 있는지 테스트',
  },

  // 특수문자가 포함된 메모
  specialCharacterMemo: {
    repositoryResponse: [
      {
        title: '특수문자 메모 클립',
        tag_id: 1,
        url: 'https://special-chars.com',
        thumbnail: 'special.jpg',
        tags: { name: '특수', color: '#FF00FF' },
        memo: '특수문자 테스트: !@#$%^&*()_+-=[]{}|;\':",./<>? 한글 English 123 😀🎉',
        created_at: '2025-01-01T00:00:00.000Z',
      },
    ],
    expectedOutput: [
      {
        title: '특수문자 메모 클립',
        tagName: '특수',
        url: 'https://special-chars.com',
        thumbnail: 'special.jpg',
        memo: '특수문자 테스트: !@#$%^&*()_+-=[]{}|;\':",./<>? 한글 English 123 😀🎉',
        createdAt: '2025-01-01T00:00:00.000Z',
      },
    ],
    description: '특수문자와 다양한 언어가 포함된 메모 처리 테스트',
  },
};
