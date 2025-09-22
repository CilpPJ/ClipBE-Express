// 🏷️ 태그 엔티티 Mock 데이터
// 데이터베이스의 tags 테이블 형태 (snake_case)

export const TAG_ENTITIES = {
  // 기본 태그들
  basic: [
    {
      id: 1,
      name: '개발',
      color: '#3B82F6',
      user_id: 'user-123-uuid',
      created_at: '2025-09-01T00:00:00.000Z',
      updated_at: '2025-09-01T00:00:00.000Z',
    },
    {
      id: 2,
      name: '프론트엔드',
      color: '#10B981',
      user_id: 'user-123-uuid',
      created_at: '2025-09-01T00:00:00.000Z',
      updated_at: '2025-09-01T00:00:00.000Z',
    },
    {
      id: 3,
      name: '백엔드',
      color: '#F59E0B',
      user_id: 'user-123-uuid',
      created_at: '2025-09-01T00:00:00.000Z',
      updated_at: '2025-09-01T00:00:00.000Z',
    },
  ],

  // 특수 케이스 태그들
  special: [
    {
      id: 0,
      name: '', // 빈 태그명
      color: '#6B7280',
      user_id: 'user-123-uuid',
      created_at: '2025-09-01T00:00:00.000Z',
      updated_at: '2025-09-01T00:00:00.000Z',
    },
    {
      id: 999999,
      name: '한글태그',
      color: '#EF4444',
      user_id: 'user-123-uuid',
      created_at: '2025-09-01T00:00:00.000Z',
      updated_at: '2025-09-01T00:00:00.000Z',
    },
    {
      id: 100,
      name: '특수문자!@#$%',
      color: '#8B5CF6',
      user_id: 'user-123-uuid',
      created_at: '2025-09-01T00:00:00.000Z',
      updated_at: '2025-09-01T00:00:00.000Z',
    },
  ],

  // 단일 태그
  single: {
    id: 1,
    name: '테스트',
    color: '#8B5CF6',
    user_id: 'user-123-uuid',
    created_at: '2025-09-20T12:00:00.000Z',
    updated_at: '2025-09-20T12:00:00.000Z',
  },

  // 빈 배열
  empty: [],
};
