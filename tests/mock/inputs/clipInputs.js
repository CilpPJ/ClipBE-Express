// 📎 클립 관련 사용자 입력 Mock 데이터
// 클라이언트에서 서버로 전송되는 클립 관련 입력 형태들

// ✅ 유효한 클립 입력들
export const VALID_CLIP_INPUTS = {
  // 기본 클립 생성
  create: {
    title: '새로운 클립',
    url: 'https://example.com',
    tagId: 1,
    memo: '클립 메모입니다.',
  },

  // 최소 필수 필드만 있는 클립
  minimal: {
    title: '최소 클립',
    url: 'https://minimal.com',
    tagId: 1,
  },

  // 긴 제목과 메모가 있는 클립
  detailed: {
    title:
      '매우 상세한 클립 제목 매우 상세한 클립 제목 매우 상세한 클립 제목 매우 상세한 클립 제목 매우 상세한 클립 제목 ',
    url: 'https://detailed-example.com/very/long/path/with/parameters?param=value',
    tagId: 2,
    memo: '이것은 매우 긴 메모입니다. 이것은 매우 긴 메모입니다. 이것은 매우 긴 메모입니다. 이것은 매우 긴 메모입니다. ',
    thumbnail: 'https://example.com/thumbnail.jpg',
  },

  // 특수문자가 포함된 클립
  withSpecialChars: {
    title: '특수문자 !@#$%^&*() 포함 제목',
    url: 'https://special-chars.com/path?param=!@#$%',
    tagId: 3,
    memo: '특수문자 메모: !@#$%^&*()_+{}[]|\\:";\'<>?,./',
  },
};

// ❌ 유효하지 않은 클립 입력들
export const INVALID_CLIP_INPUTS = {
  // 빈 제목
  emptyTitle: {
    title: '',
    url: 'https://example.com',
    tagId: 1,
  },

  // 잘못된 URL 형식
  invalidUrl: {
    title: '유효한 제목',
    url: 'not-a-valid-url',
    tagId: 1,
  },

  // 존재하지 않는 태그 ID
  invalidTagId: {
    title: '유효한 제목',
    url: 'https://example.com',
    tagId: 99999,
  },

  // null 값들
  nullValues: {
    title: null,
    url: null,
    tagId: null,
    memo: null,
  },

  // undefined 값들
  undefinedValues: {
    title: undefined,
    url: undefined,
    tagId: undefined,
    memo: undefined,
  },
};

// 🔍 클립 검색/조회 입력들
export const CLIP_QUERY_INPUTS = {
  // 기본 조회 (전체)
  getAll: {},

  // 페이지네이션 조회
  withPagination: {
    page: 0,
    size: 20,
    sort: 'createdAt,desc',
  },

  // 태그별 조회
  byTag: {
    tagId: 1,
  },

  // 검색어로 조회
  withSearch: {
    keyword: '검색어',
  },

  // 복합 조건 조회
  complex: {
    tagId: 1,
    keyword: '토큰',
    page: 1,
    size: 10,
  },
};

// 📝 클립 수정 입력들
export const CLIP_UPDATE_INPUTS = {
  // 제목만 수정
  titleOnly: {
    id: 'clip-id-001',
    title: '수정된 제목',
  },

  // 전체 필드 수정
  fullUpdate: {
    id: 'clip-id-001',
    title: '완전히 수정된 제목',
    url: 'https://updated-example.com',
    tagId: 2,
    memo: '수정된 메모',
    thumbnail: 'https://updated-thumbnail.jpg',
  },

  // 일부 필드만 수정
  partialUpdate: {
    id: 'clip-id-001',
    memo: '메모만 수정',
    tagId: 3,
  },
};

// 🗑️ 클립 삭제 입력들
export const CLIP_DELETE_INPUTS = {
  // 단일 삭제
  single: {
    id: 'clip-id-001',
  },

  // 존재하지 않는 클립 삭제
  nonExistent: {
    id: 'non-existent-clip-id',
  },

  // 잘못된 ID 형식
  invalidId: {
    id: null,
  },
};
