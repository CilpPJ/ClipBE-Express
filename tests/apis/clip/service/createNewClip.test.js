import { beforeEach, describe, expect, jest, test } from '@jest/globals';

// 🔧 Repository 모킹을 먼저 설정 (import 전에!)
jest.unstable_mockModule('../../../../src/apis/clip/repository/createClip.js', () => ({
  createClip: jest.fn(),
}));

jest.unstable_mockModule('../../../../src/apis/clip/repository/findTagByName.js', () => ({
  findTagByName: jest.fn(),
}));

jest.unstable_mockModule('../../../../src/apis/clip/repository/createTag.js', () => ({
  createTag: jest.fn(),
}));

// 모킹 설정 후 import
const { createClip } = await import('../../../../src/apis/clip/repository/createClip.js');
const { findTagByName } = await import('../../../../src/apis/clip/repository/findTagByName.js');
const { createTag } = await import('../../../../src/apis/clip/repository/createTag.js');
const { createNewClip } = await import('../../../../src/apis/clip/service/createNewClip.js');

describe('createNewClip 서비스 테스트', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  const validClipData = {
    title: '테스트 클립',
    url: 'https://example.com',
    tagName: '개발',
    userId: 'user-123',
    memo: '테스트 메모',
    thumbnail: 'https://example.com/thumb.jpg',
  };

  const testUserToken = 'test-token-123';

  const mockTag = {
    id: 1,
    name: '개발',
  };

  const expectedCreatedClip = {
    id: 1,
    title: '테스트 클립',
    url: 'https://example.com',
    tag_id: 1,
    user_id: 'user-123',
    memo: '테스트 메모',
    thumbnail: 'https://example.com/thumb.jpg',
    created_at: '2025-01-01T12:00:00.000Z',
    updated_at: '2025-01-01T12:00:00.000Z',
  };

  describe('✅ 성공 케이스', () => {
    test('유효한 클립 데이터로 클립을 생성한다', async () => {
      // 🎯 Mock 설정
      findTagByName.mockResolvedValue(mockTag);
      createClip.mockResolvedValue(expectedCreatedClip);

      // 🚀 실제 함수 호출
      const result = await createNewClip(validClipData, testUserToken);

      // 🔍 검증
      expect(findTagByName).toHaveBeenCalledWith('개발', 'user-123', testUserToken);
      expect(createClip).toHaveBeenCalledWith(
        {
          title: '테스트 클립',
          url: 'https://example.com',
          tagId: 1,
          userId: 'user-123',
          memo: '테스트 메모',
          thumbnail: 'https://example.com/thumb.jpg',
        },
        testUserToken
      );
      expect(result).toEqual({
        id: 1,
        tagId: 1,
        message: '클립이 성공적으로 생성되었습니다.',
      });
    });

    test('선택적 필드(memo, thumbnail)가 없어도 클립을 생성한다', async () => {
      // 🎯 필수 필드만 있는 데이터
      const minimalData = {
        title: '최소 클립',
        url: 'https://example.com',
        tagName: '개발',
        userId: 'user-123',
      };

      const expectedMinimalClip = {
        ...expectedCreatedClip,
        title: '최소 클립',
        memo: null,
        thumbnail: null,
      };

      findTagByName.mockResolvedValue(mockTag);
      createClip.mockResolvedValue(expectedMinimalClip);

      // 🚀 실제 함수 호출
      const result = await createNewClip(minimalData, testUserToken);

      // 🔍 검증
      expect(findTagByName).toHaveBeenCalledWith('개발', 'user-123', testUserToken);
      expect(createClip).toHaveBeenCalledWith(
        {
          title: '최소 클립',
          url: 'https://example.com',
          tagId: 1,
          userId: 'user-123',
          memo: null,
          thumbnail: null,
        },
        testUserToken
      );
      expect(result).toEqual({
        id: 1,
        tagId: 1,
        message: '클립이 성공적으로 생성되었습니다.',
      });
    });

    test('공백이 포함된 데이터를 정제하여 클립을 생성한다', async () => {
      // 🎯 공백이 포함된 데이터
      const dataWithSpaces = {
        title: '  공백 클립  ',
        url: '  https://example.com  ',
        tagName: '  개발  ',
        userId: '  user-123  ',
        memo: '  공백 메모  ',
        thumbnail: '  https://example.com/thumb.jpg  ',
      };

      findTagByName.mockResolvedValue(mockTag);
      createClip.mockResolvedValue(expectedCreatedClip);

      // 🚀 실제 함수 호출
      await createNewClip(dataWithSpaces, testUserToken);

      // 🔍 검증 - 공백이 제거된 데이터로 호출되었는지 확인
      expect(findTagByName).toHaveBeenCalledWith('개발', 'user-123', testUserToken);
      expect(createClip).toHaveBeenCalledWith(
        {
          title: '공백 클립',
          url: 'https://example.com',
          tagId: 1,
          userId: 'user-123',
          memo: '공백 메모',
          thumbnail: 'https://example.com/thumb.jpg',
        },
        testUserToken
      );
    });

    test('동시 생성으로 인한 태그 중복 시 기존 태그를 사용한다', async () => {
      const newTagName = '경합태그';
      const dataWithNewTag = { ...validClipData, tagName: newTagName };
      const existingTag = { id: 888, name: newTagName };

      // 🎯 Mock 설정: 태그 생성 시 중복 오류 발생 → 재조회로 해결
      findTagByName
        .mockResolvedValueOnce(null) // 첫 번째 조회에서 없음
        .mockResolvedValueOnce(existingTag); // 재조회에서 발견됨
      createTag.mockRejectedValue(new Error('이미 존재하는 태그입니다: 경합태그'));
      createClip.mockResolvedValue({ ...expectedCreatedClip, tag_id: 888 });

      // 🚀 실제 함수 호출
      const result = await createNewClip(dataWithNewTag, testUserToken);

      // 🔍 검증
      expect(findTagByName).toHaveBeenCalledTimes(2);
      expect(createTag).toHaveBeenCalledWith(newTagName, 'user-123', testUserToken);
      expect(createClip).toHaveBeenCalledWith(
        {
          title: '테스트 클립',
          url: 'https://example.com',
          tagId: 888,
          userId: 'user-123',
          memo: '테스트 메모',
          thumbnail: 'https://example.com/thumb.jpg',
        },
        testUserToken
      );
      expect(result).toEqual({
        id: 1,
        tagId: 888,
        message: '클립이 성공적으로 생성되었습니다.',
      });
    });
  });

  describe('❌ 실패 케이스 - 유효성 검사', () => {
    test('제목이 없으면 VALIDATION_ERROR를 던진다', async () => {
      const invalidData = { ...validClipData, title: '' };

      await expect(createNewClip(invalidData, testUserToken)).rejects.toThrow(
        expect.objectContaining({
          name: 'CustomError',
          message: '클립 제목은 필수입니다.',
          statusCode: 400,
        })
      );
    });

    test('URL이 없으면 VALIDATION_ERROR를 던진다', async () => {
      const invalidData = { ...validClipData, url: '' };

      await expect(createNewClip(invalidData, testUserToken)).rejects.toThrow(
        expect.objectContaining({
          name: 'CustomError',
          message: '클립 URL은 필수입니다.',
          statusCode: 400,
        })
      );
    });

    test('tagName이 없으면 VALIDATION_ERROR를 던진다', async () => {
      const invalidData = { ...validClipData, tagName: '' };

      await expect(createNewClip(invalidData, testUserToken)).rejects.toThrow(
        expect.objectContaining({
          name: 'CustomError',
          message: '태그는 필수입니다.',
          statusCode: 400,
        })
      );
    });

    test('존재하지 않는 태그는 자동으로 생성한다', async () => {
      const newTagName = '새로운태그';
      const dataWithNewTag = { ...validClipData, tagName: newTagName };
      const newTag = { id: 999, name: newTagName };

      // 🎯 Mock 설정: 태그가 없으면 생성
      findTagByName.mockResolvedValue(null); // 첫 번째 조회에서 없음
      createTag.mockResolvedValue(newTag); // 태그 생성 성공
      createClip.mockResolvedValue({ ...expectedCreatedClip, tag_id: 999 });

      // 🚀 실제 함수 호출
      const result = await createNewClip(dataWithNewTag, testUserToken);

      // 🔍 검증
      expect(findTagByName).toHaveBeenCalledWith(newTagName, 'user-123', testUserToken);
      expect(createTag).toHaveBeenCalledWith(newTagName, 'user-123', testUserToken);
      expect(createClip).toHaveBeenCalledWith(
        {
          title: '테스트 클립',
          url: 'https://example.com',
          tagId: 999,
          userId: 'user-123',
          memo: '테스트 메모',
          thumbnail: 'https://example.com/thumb.jpg',
        },
        testUserToken
      );
      expect(result).toEqual({
        id: 1,
        tagId: 999,
        message: '클립이 성공적으로 생성되었습니다.',
      });
    });

    test('userId가 없으면 VALIDATION_ERROR를 던진다', async () => {
      const invalidData = { ...validClipData, userId: '' };

      await expect(createNewClip(invalidData, testUserToken)).rejects.toThrow(
        expect.objectContaining({
          name: 'CustomError',
          message: '사용자 ID는 필수입니다.',
          statusCode: 400,
        })
      );
    });

    test('유효하지 않은 URL 형식이면 VALIDATION_ERROR를 던진다', async () => {
      const invalidData = { ...validClipData, url: 'invalid-url' };

      await expect(createNewClip(invalidData, testUserToken)).rejects.toThrow(
        expect.objectContaining({
          name: 'CustomError',
          message: '올바른 URL 형식이 아닙니다.',
          statusCode: 400,
        })
      );
    });
  });

  describe('❌ 실패 케이스 - 데이터베이스 오류', () => {
    test('외래키 제약조건 위반 시 VALIDATION_ERROR를 던진다', async () => {
      findTagByName.mockResolvedValue(mockTag);
      createClip.mockRejectedValue(new Error('foreign key constraint violated'));

      await expect(createNewClip(validClipData, testUserToken)).rejects.toThrow(
        expect.objectContaining({
          name: 'CustomError',
          message: '존재하지 않는 태그 또는 사용자입니다.',
          statusCode: 400,
        })
      );
    });

    test('기타 데이터베이스 오류 시 INTERNAL_ERROR를 던진다', async () => {
      findTagByName.mockResolvedValue(mockTag);
      createClip.mockRejectedValue(new Error('Database connection failed'));

      await expect(createNewClip(validClipData, testUserToken)).rejects.toThrow(
        expect.objectContaining({
          name: 'CustomError',
          message: '클립 생성 중 오류가 발생했습니다.',
          statusCode: 500,
        })
      );
    });
  });
});
