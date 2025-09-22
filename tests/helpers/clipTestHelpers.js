// 🔧 Clip 테스트 헬퍼 함수들
// 테스트에서 사용하는 응답 생성 및 검증 로직

/**
 * getAllClips 서비스의 예상 응답을 생성
 * @param {Array} rawClips - 데이터베이스에서 반환되는 raw 클립 데이터 (snake_case)
 * @param {Object} additionalOptions - 추가 옵션
 * @param {number} additionalOptions.numberOfElements - 요소 개수 (기본값: rawClips.length)
 * @param {boolean} additionalOptions.empty - 빈 배열 여부 (기본값: rawClips.length === 0)
 * @returns {Object} getAllClips 서비스 응답 형태
 */
export const createExpectedResponse = (rawClips, additionalOptions = {}) => {
  const { numberOfElements = rawClips.length, empty = rawClips.length === 0 } = additionalOptions;

  const sortInfo = [
    {
      direction: 'DESC',
      nullHandling: 'NATIVE',
      ascending: false,
      property: 'createdAt',
      ignoreCase: false,
    },
  ];

  return {
    data: {
      size: 20,
      content: rawClips.map((clip) => ({
        title: clip.title,
        tagId: clip.tag_id,
        url: clip.url,
        thumbnail: clip.thumbnail,
        tagName: clip.tags?.name,
        memo: clip.memo,
        createdAt: clip.created_at,
      })),
      number: 0,
      numberOfElements,
      pageable: {
        offset: 0,
        sort: sortInfo,
        paged: true,
        pageNumber: 0,
        pageSize: 20,
        unpaged: false,
      },
      first: true,
      last: true,
      empty,
      sort: sortInfo,
    },
    status: 'SUCCESS',
    serverDateTime: expect.any(String), // 동적으로 생성되므로 any String
    errorCode: null,
    errorMessage: null,
  };
};

/**
 * 클립 데이터 변환 검증 헬퍼
 * @param {Object} actual - 실제 결과
 * @param {Array} expectedClips - 예상 클립 데이터
 */
export const expectClipDataTransformation = (actual, expectedClips) => {
  expect(actual.data.content).toHaveLength(expectedClips.length);

  expectedClips.forEach((expectedClip, index) => {
    const actualClip = actual.data.content[index];
    expect(actualClip.title).toBe(expectedClip.title);
    expect(actualClip.tagId).toBe(expectedClip.tag_id);
    expect(actualClip.url).toBe(expectedClip.url);
    expect(actualClip.thumbnail).toBe(expectedClip.thumbnail);
    expect(actualClip.tagName).toBe(expectedClip.tags?.name);
    expect(actualClip.memo).toBe(expectedClip.memo);
    expect(actualClip.createdAt).toBe(expectedClip.created_at);
  });
};

/**
 * 페이지네이션 정보 검증 헬퍼
 * @param {Object} actual - 실제 결과
 * @param {Object} expectedPagination - 예상 페이지네이션 정보
 */
export const expectPaginationInfo = (actual, expectedPagination = {}) => {
  const {
    size = 20,
    number = 0,
    first = true,
    last = true,
    numberOfElements = actual.data.content.length,
    empty = actual.data.content.length === 0,
  } = expectedPagination;

  expect(actual.data.size).toBe(size);
  expect(actual.data.number).toBe(number);
  expect(actual.data.numberOfElements).toBe(numberOfElements);
  expect(actual.data.first).toBe(first);
  expect(actual.data.last).toBe(last);
  expect(actual.data.empty).toBe(empty);
};
