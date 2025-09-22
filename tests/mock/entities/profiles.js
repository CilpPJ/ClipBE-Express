// 👤 사용자 프로필 엔티티 Mock 데이터
// 데이터베이스의 profiles 테이블 형태 (snake_case)

export const PROFILE_ENTITIES = {
  // 기본 프로필
  basic: {
    id: 'profile-id-456',
    nickname: '클립테스터',
    user_id: 'user-123-uuid',
    created_at: '2025-09-01T00:00:00.000Z',
    updated_at: '2025-09-01T00:00:00.000Z',
  },

  // 새로 생성된 프로필
  newUser: {
    id: 'profile-id-789',
    nickname: '테스트유저',
    user_id: 'supabase-user-id-123',
    created_at: '2025-09-23T10:00:00.000Z',
    updated_at: '2025-09-23T10:00:00.000Z',
  },

  // 특수 문자 닉네임
  specialNickname: {
    id: 'profile-id-special',
    nickname: '특수문자!@#$%',
    user_id: 'special-user-id',
    created_at: '2025-09-20T00:00:00.000Z',
    updated_at: '2025-09-20T00:00:00.000Z',
  },

  // 긴 닉네임
  longNickname: {
    id: 'profile-id-long',
    nickname: '매우긴닉네임'.repeat(5),
    user_id: 'long-nickname-user-id',
    created_at: '2025-09-15T00:00:00.000Z',
    updated_at: '2025-09-15T00:00:00.000Z',
  },

  // 빈 닉네임 (에지 케이스)
  emptyNickname: {
    id: 'profile-id-empty',
    nickname: '',
    user_id: 'empty-nickname-user-id',
    created_at: '2025-09-10T00:00:00.000Z',
    updated_at: '2025-09-10T00:00:00.000Z',
  },
};
