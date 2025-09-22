import { beforeEach, describe, expect, jest, test } from '@jest/globals';

// 🔧 테스트 헬퍼 함수 import
import { createExpectedResponse } from '../../../helpers/clipTestHelpers.js';
import { CLIP_ENTITIES, PRODUCTION_CLIPS } from '../../../mock/entities/clips.js';

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
      findAllClips.mockResolvedValue(CLIP_ENTITIES.basic);

      // 🚀 실제 함수 호출
      const result = await getAllClips();

      // 🔍 예상 응답과 비교 (헬퍼 함수 사용)
      const expectedResponse = createExpectedResponse(CLIP_ENTITIES.basic);
      expect(result).toEqual(expectedResponse);

      // Repository 함수가 호출되었는지 확인
      expect(findAllClips).toHaveBeenCalledTimes(1);
    });

    test('빈 클립 목록도 올바르게 처리한다', async () => {
      // 🎯 빈 배열 반환
      findAllClips.mockResolvedValue([]);

      // 🚀 실제 함수 호출
      const result = await getAllClips();

      // 🔍 빈 배열이 올바르게 반환되는지 확인
      const expectedResponse = createExpectedResponse([]);
      expect(result).toEqual(expectedResponse);

      expect(findAllClips).toHaveBeenCalledTimes(1);
    });

    test('단일 클립 데이터도 올바르게 처리한다', async () => {
      findAllClips.mockResolvedValue(CLIP_ENTITIES.single);

      const result = await getAllClips();

      // 🔍 단일 클립이 올바른 구조로 변환되는지 확인
      const expectedResponse = createExpectedResponse(CLIP_ENTITIES.single);
      expect(result).toEqual(expectedResponse);

      expect(findAllClips).toHaveBeenCalledTimes(1);
    });

    test('실제 프로덕션 데이터와 같은 구조로 처리한다', async () => {
      // 🎯 제공해주신 실제 프로덕션 데이터 사용
      findAllClips.mockResolvedValue(PRODUCTION_CLIPS);

      // 🚀 실제 함수 호출
      const result = await getAllClips();

      // 🔍 전체 길이 검증
      expect(result.data.content.length).toBe(PRODUCTION_CLIPS.length);

      // 🔍 첫 번째와 마지막 요소 구조 검증
      if (result.data.content.length > 0) {
        expect(result.data.content[0]).toHaveProperty('title');
        expect(result.data.content[0]).toHaveProperty('tagName');
        expect(result.data.content[0]).toHaveProperty('url');
        expect(result.data.content[0]).toHaveProperty('thumbnail');
        expect(result.data.content[0]).toHaveProperty('memo');
        expect(result.data.content[0]).toHaveProperty('createdAt');

        const lastIndex = result.data.content.length - 1;
        expect(result.data.content[lastIndex]).toHaveProperty('title');
        expect(result.data.content[lastIndex]).toHaveProperty('tagName');
      }

      expect(findAllClips).toHaveBeenCalledTimes(1);
    });
  });

  describe('🧪 데이터 변환 테스트', () => {
    test('특수한 데이터 타입들도 올바르게 변환된다', async () => {
      findAllClips.mockResolvedValue(CLIP_ENTITIES.special);

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

    test('tags 객체가 없는 경우 tagName이 undefined로 처리된다', async () => {
      findAllClips.mockResolvedValue(CLIP_ENTITIES.withoutTags);

      // � 실제 함수 호출
      const result = await getAllClips();

      // 🔍 에러가 발생하지 않고 tagName이 undefined로 처리되는지 확인
      expect(result.data.content).toHaveLength(1);
      expect(result.data.content[0].title).toBe('태그 없는 클립');
      expect(result.data.content[0].tagId).toBe(5);
      expect(result.data.content[0].tagName).toBeUndefined();
      expect(result.data.content[0].url).toBe('https://no-tags.com');
      expect(result.data.content[0].memo).toBe('태그 정보가 없는 클립');
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
