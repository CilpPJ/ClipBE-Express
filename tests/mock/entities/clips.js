// 📎 클립 엔티티 Mock 데이터
// 데이터베이스의 clips 테이블 형태 (snake_case, tags 조인 포함)

export const CLIP_ENTITIES = {
  // 기본 클립 데이터
  basic: [
    {
      id: 'clip-id-001',
      title: '효율적인 토큰 관리 방법',
      tag_id: 6,
      url: 'https://velog.io/token-management',
      thumbnail: 'https://example.com/thumbnail1.jpg',
      memo: '토큰 관리는 보안과 성능에 큰 영향을 미칩니다.',
      user_id: 'user-123-uuid',
      created_at: '2025-09-19T14:30:00.000Z',
      updated_at: '2025-09-19T14:30:00.000Z',
      tags: {
        id: 6,
        name: '개발',
        color: '#3B82F6',
        user_id: 'user-123-uuid',
      },
    },
    {
      id: 'clip-id-002',
      title: 'React Hook 최적화 팁',
      tag_id: 3,
      url: 'https://blog.example.com/react-hooks',
      thumbnail: null,
      memo: null,
      user_id: 'user-123-uuid',
      created_at: '2025-09-18T10:15:00.000Z',
      updated_at: '2025-09-18T10:15:00.000Z',
      tags: {
        id: 3,
        name: '프론트엔드',
        color: '#10B981',
        user_id: 'user-123-uuid',
      },
    },
  ],

  // 단일 클립
  single: [
    {
      id: 'clip-id-single',
      title: '유일한 클립',
      tag_id: 1,
      url: 'https://single.clip.com',
      thumbnail: 'https://single-thumbnail.jpg',
      memo: '단일 클립 테스트',
      user_id: 'user-123-uuid',
      created_at: '2025-09-20T12:00:00.000Z',
      updated_at: '2025-09-20T12:00:00.000Z',
      tags: {
        id: 1,
        name: '테스트',
        color: '#8B5CF6',
        user_id: 'user-123-uuid',
      },
    },
  ],

  // 특수 데이터 타입
  special: [
    {
      id: 'clip-id-empty',
      title: '', // 빈 문자열
      tag_id: 0, // 0 값
      url: 'https://empty-title.com',
      thumbnail: '', // 빈 문자열
      memo: '   ', // 공백만 있는 메모
      user_id: 'user-123-uuid',
      created_at: '2025-01-01T00:00:00.000Z',
      updated_at: '2025-01-01T00:00:00.000Z',
      tags: {
        id: 0,
        name: '', // 빈 태그명
        color: '#6B7280',
        user_id: 'user-123-uuid',
      },
    },
    {
      id: 'clip-id-long',
      title:
        '매우 긴 제목이 포함된 클립입니다. 매우 긴 제목이 포함된 클립입니다. 매우 긴 제목이 포함된 클립입니다. 매우 긴 제목이 포함된 클립입니다. ',
      tag_id: 999999, // 큰 숫자
      url: 'https://very-long-url.com/with/many/paths',
      thumbnail: 'data:image/base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJ...',
      memo: '특수문자!@#$%^&*()_+{}[]|\\:";\'<>?,./',
      user_id: 'user-123-uuid',
      created_at: '2025-12-31T23:59:59.999Z',
      updated_at: '2025-12-31T23:59:59.999Z',
      tags: {
        id: 999999,
        name: '한글태그',
        color: '#EF4444',
        user_id: 'user-123-uuid',
      },
    },
  ],

  // tags가 null인 경우 (에지 케이스)
  withoutTags: [
    {
      id: 'clip-id-no-tags',
      title: '태그 없는 클립',
      tag_id: 5,
      url: 'https://no-tags.com',
      thumbnail: null,
      memo: '태그 정보가 없는 클립',
      user_id: 'user-123-uuid',
      created_at: '2025-09-22T16:30:00.000Z',
      updated_at: '2025-09-22T16:30:00.000Z',
      tags: null, // tags가 null인 경우
    },
  ],

  // 빈 배열
  empty: [],
};

// 🎯 실제 프로덕션 클립 데이터
export const PRODUCTION_CLIPS = [
  {
    id: 'prod-clip-001',
    title: '효율적인 토큰 관리 방법',
    tag_id: 1,
    url: 'https://velog.io/@dobby_min/token-management',
    thumbnail: 'https://velog.velcdn.com/images/dobby_min/post/8c9496d3-cf1a-4cff-8eb5-9fecb769a2d4/image.png',
    memo: '토큰 관리는 보안과 성능에 큰 영향을 미칩니다. 올바른 토큰 저장 방법과 효율적인 토큰 사용 전략을 알아보세요.',
    user_id: 'prod-user-001',
    created_at: '2025-01-15T14:30:00.000Z',
    updated_at: '2025-01-15T14:30:00.000Z',
    tags: {
      id: 1,
      name: '개발',
      color: '#3B82F6',
      user_id: 'prod-user-001',
    },
  },
  {
    id: 'prod-clip-002',
    title: 'Javascript 비동기 처리',
    tag_id: 2,
    url: 'https://velog.io/@dobby_min/javascript-async',
    thumbnail: 'https://velog.velcdn.com/images/dobby_min/post/05a9fc54-9369-4916-8c14-847f53eddbc7/image.png',
    memo: 'Javascript 비동기 처리는 프로그램의 성능과 사용자 경험에 큰 영향을 미칩니다.',
    user_id: 'prod-user-001',
    created_at: '2025-01-14T22:15:10.000Z',
    updated_at: '2025-01-14T22:15:10.000Z',
    tags: {
      id: 2,
      name: '개발',
      color: '#3B82F6',
      user_id: 'prod-user-001',
    },
  },
  {
    id: 'prod-clip-003',
    title: 'React Hook - useRef',
    tag_id: 3,
    url: 'https://velog.io/@dobby_min/React-Hook-useRef',
    thumbnail: 'https://velog.velcdn.com/images/dobby_min/post/143e29e1-0fe9-4ff5-9e86-f0c245f1ab3d/image.png',
    memo: 'React Hook - useRef는 렌더링 주기에 관계없이 값을 유지하고 싶을 때 사용합니다.',
    user_id: 'prod-user-001',
    created_at: '2025-01-13T18:05:00.000Z',
    updated_at: '2025-01-13T18:05:00.000Z',
    tags: {
      id: 3,
      name: '개발',
      color: '#3B82F6',
      user_id: 'prod-user-001',
    },
  },
  {
    id: 'prod-clip-004',
    title: '[클린코드 조각모음] 추상화를 정렬하기',
    tag_id: 4,
    url: 'https://junilhwang.github.io/TIL/clean-code/abstraction-sorting',
    thumbnail: 'https://raw.githubusercontent.com/JunilHwang/TIL/refs/heads/master/clean-code/thumbnail.webp',
    memo: '함수와 훅을 이용하여 추상화 수준을 정렬하는 방법',
    user_id: 'prod-user-001',
    created_at: '2025-01-12T11:20:00.000Z',
    updated_at: '2025-01-12T11:20:00.000Z',
    tags: {
      id: 4,
      name: '개발',
      color: '#3B82F6',
      user_id: 'prod-user-001',
    },
  },
];
