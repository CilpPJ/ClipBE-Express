import { beforeEach, describe, expect, jest, test } from '@jest/globals';

// 🔧 테스트 헬퍼 함수 import
import { createExpectedResponse } from '../../../helpers/clipTestHelpers.js';
// 🎯 Mock 데이터 import
import { MOCK_RAW_CLIPS, RECENT_CLIPS_RAW } from '../../../mock/clipMockData.js';

// 🎯 Repository 모킹을 먼저 설정 (import 전에!)
jest.unstable_mockModule('../../../../src/apis/clip/repository/findAllClips.js', () => ({
  findAllClips: jest.fn(),
}));

// 모킹 설정 후 import
const { findAllClips } = await import('../../../../src/apis/clip/repository/findAllClips.js');
const { getAllClips } = await import('../../../../src/apis/clip/service/getAllClips.js');

describe('getAllClips 서비스 테스트', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('✅ 성공 케이스', () => {
    test('클립 데이터를 올바른 형태로 변환해서 반환한다', async () => {
      // 🎯 Mock 데이터 사용
      findAllClips.mockResolvedValue(MOCK_RAW_CLIPS.basic);

      // 🚀 실제 함수 호출
      const result = await getAllClips();

      // 🔍 예상 응답과 비교 (헬퍼 함수 사용)
      const expectedResponse = createExpectedResponse(MOCK_RAW_CLIPS.basic);
      expect(result).toEqual(expectedResponse);

      // Repository 함수가 호출되었는지 확인
      expect(findAllClips).toHaveBeenCalledTimes(1);
    });

    test('빈 클립 목록도 올바르게 처리한다', async () => {
      // 🎯 빈 배열 반환 모킹
      findAllClips.mockResolvedValue(MOCK_RAW_CLIPS.empty);

      const result = await getAllClips();

      // 🔍 빈 데이터에 대한 응답 검증
      expect(result.status).toBe('SUCCESS');
      expect(result.data.content).toEqual([]);
      expect(result.data.numberOfElements).toBe(0);
      expect(result.data.empty).toBe(true); // 데이터가 없으므로 true
      expect(result.data.first).toBe(true);
      expect(result.data.last).toBe(true);

      expect(findAllClips).toHaveBeenCalledTimes(1);
    });

    test('단일 클립 데이터도 올바르게 처리한다', async () => {
      findAllClips.mockResolvedValue(MOCK_RAW_CLIPS.single);

      const result = await getAllClips();

      expect(result.data.content).toHaveLength(1);
      expect(result.data.numberOfElements).toBe(1);
      expect(result.data.empty).toBe(false);
      expect(result.data.content[0].title).toBe('유일한 클립');
    });

    test('실제 프로덕션 데이터와 같은 구조로 처리한다', async () => {
      // 🎯 제공해주신 RECENT_CLIPS_RAW 데이터 사용
      findAllClips.mockResolvedValue(RECENT_CLIPS_RAW);

      const result = await getAllClips();

      expect(result.status).toBe('SUCCESS');
      expect(result.data.content).toHaveLength(4);

      // 첫 번째 실제 데이터 검증
      expect(result.data.content[0]).toEqual({
        title: '효율적인 토큰 관리 방법',
        tagId: 1,
        url: 'https://velog.io/@dobby_min/token-management',
        thumbnail: 'https://velog.velcdn.com/images/dobby_min/post/8c9496d3-cf1a-4cff-8eb5-9fecb769a2d4/image.png',
        tagName: '개발',
        memo: '토큰 관리는 보안과 성능에 큰 영향을 미칩니다. 올바른 토큰 저장 방법과 효율적인 토큰 사용 전략을 알아보세요.',
        createdAt: '2025-01-15T14:30:00.000Z',
      });
    });
  });

  describe('🧪 데이터 변환 테스트', () => {
    test('특수한 데이터 타입들도 올바르게 변환된다', async () => {
      findAllClips.mockResolvedValue(MOCK_RAW_CLIPS.special);

      const result = await getAllClips();

      // 빈 값들이 그대로 유지되는지 확인
      expect(result.data.content[0].title).toBe('');
      expect(result.data.content[0].tagId).toBe(0);
      expect(result.data.content[0].thumbnail).toBe('');
      expect(result.data.content[0].tagName).toBe('');
      expect(result.data.content[0].memo).toBe('   ');

      // 특수 데이터들이 올바르게 처리되는지 확인
      expect(result.data.content[1].title).toContain('매우 긴 제목');
      expect(result.data.content[1].tagId).toBe(999999);
      expect(result.data.content[1].tagName).toBe('한글태그');
      expect(result.data.content[1].memo).toContain('특수문자');
    });

    test('tags 객체가 없는 경우 에러가 발생한다 (실제 코드 동작)', async () => {
      findAllClips.mockResolvedValue(MOCK_RAW_CLIPS.withoutTags);

      // 🔍 실제 코드에서는 tags.name에 접근할 때 에러가 발생함
      await expect(getAllClips()).rejects.toThrow(TypeError);
      await expect(getAllClips()).rejects.toThrow('Cannot read properties of null');
    });
  });

  describe('🔍 페이지네이션 로직 테스트', () => {
    test('다양한 개수의 데이터에 대해 올바른 페이지네이션 정보를 생성한다', async () => {
      // 다양한 개수로 테스트
      const testCases = [0, 1, 5, 20, 50];

      for (const count of testCases) {
        const mockClips = Array.from({ length: count }, (_, index) => ({
          title: `클립 ${index + 1}`,
          tag_id: (index % 3) + 1,
          url: `https://example.com/clip${index}`,
          thumbnail: null,
          tags: { name: `태그${(index % 3) + 1}` },
          memo: `메모 ${index + 1}`,
          created_at: new Date(Date.now() - index * 1000).toISOString(),
        }));

        findAllClips.mockResolvedValue(mockClips);

        const result = await getAllClips();

        expect(result.data.numberOfElements).toBe(count);
        expect(result.data.empty).toBe(count === 0);
        expect(result.data.content).toHaveLength(count);

        // 페이지네이션 정보는 항상 동일해야 함
        expect(result.data.size).toBe(20);
        expect(result.data.number).toBe(0);
        expect(result.data.first).toBe(true);
        expect(result.data.last).toBe(true);
      }
    });
  });

  describe('❌ 에러 처리 테스트', () => {
    test('Repository에서 에러가 발생하면 그대로 전파된다', async () => {
      const repositoryError = new Error('데이터베이스 연결 실패');
      findAllClips.mockRejectedValue(repositoryError);

      // 🔍 에러가 올바르게 전파되는지 확인
      await expect(getAllClips()).rejects.toThrow('데이터베이스 연결 실패');

      expect(findAllClips).toHaveBeenCalledTimes(1);
    });

    test('Repository에서 null을 반환하면 에러가 발생한다', async () => {
      findAllClips.mockResolvedValue(null);

      // null에 대해 map을 호출하면 TypeError가 발생해야 함
      await expect(getAllClips()).rejects.toThrow(TypeError);
    });
  });
});
