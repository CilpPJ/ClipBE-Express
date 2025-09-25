import { beforeEach, describe, expect, jest, test } from '@jest/globals';

// Mock repository
jest.unstable_mockModule('../../../../src/apis/clip/repository/updateClipById.js', () => ({
  updateClipById: jest.fn(),
}));

jest.unstable_mockModule('../../../../src/apis/clip/repository/findTagByName.js', () => ({
  findTagByName: jest.fn(),
}));

jest.unstable_mockModule('../../../../src/apis/clip/repository/createTag.js', () => ({
  createTag: jest.fn(),
}));

const { updateClipById } = await import('../../../../src/apis/clip/repository/updateClipById.js');
const { findTagByName } = await import('../../../../src/apis/clip/repository/findTagByName.js');
const { createTag } = await import('../../../../src/apis/clip/repository/createTag.js');
const { updateClip } = await import('../../../../src/apis/clip/service/updateClip.js');
const { CustomError } = await import('../../../../src/utils/errors.js');

describe('updateClip Service 테스트', () => {
  const mockUserId = 'test-user-123';

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('✅ 성공 케이스', () => {
    test('유효한 clipId와 userId, 기본 필드로 클립을 성공적으로 수정한다', async () => {
      const mockUpdatedClip = {
        id: 1,
        title: '수정된 제목',
        url: 'https://updated.com',
        memo: 'updated memo',
        tag_id: 1,
      };
      updateClipById.mockResolvedValue(mockUpdatedClip);

      const updateFields = { title: '수정된 제목', url: 'https://updated.com', memo: 'updated memo' };
      const result = await updateClip('1', mockUserId, updateFields);

      expect(updateClipById).toHaveBeenCalledWith(1, mockUserId, {
        title: '수정된 제목',
        url: 'https://updated.com',
        memo: 'updated memo',
      });
      expect(result).toEqual({
        message: '클립이 성공적으로 수정되었습니다.',
        updatedClipId: 1,
        updatedFields: ['title', 'url', 'memo'],
      });
    });

    test('기존 태그로 클립을 수정한다', async () => {
      const existingTag = { id: 5, name: '기존태그' };
      const mockUpdatedClip = { id: 1, title: '제목', url: 'https://test.com', memo: 'memo', tag_id: 5 };

      findTagByName.mockResolvedValue(existingTag);
      updateClipById.mockResolvedValue(mockUpdatedClip);

      const updateFields = { tagName: '기존태그' };
      const result = await updateClip('1', mockUserId, updateFields);

      expect(findTagByName).toHaveBeenCalledWith('기존태그', mockUserId);
      expect(createTag).not.toHaveBeenCalled();
      expect(updateClipById).toHaveBeenCalledWith(1, mockUserId, { tag_id: 5 });
      expect(result.updatedFields).toContain('tagName');
    });

    test('새로운 태그로 클립을 수정한다', async () => {
      const newTag = { id: 10, name: '새태그' };
      const mockUpdatedClip = { id: 1, title: '제목', url: 'https://test.com', memo: 'memo', tag_id: 10 };

      findTagByName.mockResolvedValue(null); // 태그가 존재하지 않음
      createTag.mockResolvedValue(newTag);
      updateClipById.mockResolvedValue(mockUpdatedClip);

      const updateFields = { tagName: '새태그' };
      await updateClip('1', mockUserId, updateFields);

      expect(findTagByName).toHaveBeenCalledWith('새태그', mockUserId);
      expect(createTag).toHaveBeenCalledWith('새태그', mockUserId);
      expect(updateClipById).toHaveBeenCalledWith(1, mockUserId, { tag_id: 10 });
    });

    test('부분 필드 수정도 정상적으로 처리한다', async () => {
      const mockUpdatedClip = { id: 42, title: '새 제목', url: 'old-url', memo: 'old-memo', tag_id: 1 };
      updateClipById.mockResolvedValue(mockUpdatedClip);

      const updateFields = { title: '새 제목' };
      const result = await updateClip(42, mockUserId, updateFields);

      expect(updateClipById).toHaveBeenCalledWith(42, mockUserId, { title: '새 제목' });
      expect(result.updatedFields).toEqual(['title']);
    });
  });

  describe('❌ 에러 케이스', () => {
    test('clipId가 없으면 400 에러를 발생시킨다', async () => {
      await expect(updateClip(null, mockUserId, { title: '제목' })).rejects.toThrow(
        new CustomError('INVALID_CLIP_ID', '유효하지 않은 클립 ID입니다.', 400)
      );
      await expect(updateClip(undefined, mockUserId, { title: '제목' })).rejects.toThrow(
        new CustomError('INVALID_CLIP_ID', '유효하지 않은 클립 ID입니다.', 400)
      );
    });

    test('userId가 없으면 400 에러를 발생시킨다', async () => {
      await expect(updateClip('1', null, { title: '제목' })).rejects.toThrow(
        new CustomError('INVALID_USER_ID', '유효하지 않은 사용자 ID입니다.', 400)
      );
      await expect(updateClip('1', '', { title: '제목' })).rejects.toThrow(
        new CustomError('INVALID_USER_ID', '유효하지 않은 사용자 ID입니다.', 400)
      );
    });

    test('수정할 데이터가 없으면 400 에러를 발생시킨다', async () => {
      await expect(updateClip('1', mockUserId, {})).rejects.toThrow(
        new CustomError('NO_UPDATE_DATA', '수정할 데이터가 제공되지 않았습니다.', 400)
      );
      await expect(updateClip('1', mockUserId, null)).rejects.toThrow(
        new CustomError('NO_UPDATE_DATA', '수정할 데이터가 제공되지 않았습니다.', 400)
      );
    });

    test('유효하지 않은 필드만 있으면 400 에러를 발생시킨다', async () => {
      await expect(updateClip('1', mockUserId, { invalidField: '값' })).rejects.toThrow(
        new CustomError('NO_VALID_UPDATE_DATA', '유효한 수정 데이터가 없습니다.', 400)
      );
    });

    test('유효하지 않은 clipId 형식이면 400 에러를 발생시킨다', async () => {
      await expect(updateClip('abc', mockUserId, { title: '제목' })).rejects.toThrow(
        new CustomError('INVALID_CLIP_ID', '유효하지 않은 클립 ID입니다.', 400)
      );
      await expect(updateClip('0', mockUserId, { title: '제목' })).rejects.toThrow(
        new CustomError('INVALID_CLIP_ID', '유효하지 않은 클립 ID입니다.', 400)
      );
    });

    test('Repository에서 에러가 발생하면 에러를 전파한다', async () => {
      const mockError = new CustomError('CLIP_NOT_FOUND', '클립을 찾을 수 없습니다.', 404);
      updateClipById.mockRejectedValue(mockError);

      await expect(updateClip('1', mockUserId, { title: '제목' })).rejects.toThrow(mockError);
    });
  });

  describe('🧪 데이터 처리 테스트', () => {
    test('문자열 공백을 제거한다', async () => {
      const mockUpdatedClip = { id: 1, title: '제목', url: 'https://test.com', memo: '메모', tag_id: 1 };
      updateClipById.mockResolvedValue(mockUpdatedClip);

      const updateFields = { title: '  제목  ', url: '  https://test.com  ', memo: '  메모  ' };
      await updateClip('1', mockUserId, updateFields);

      expect(updateClipById).toHaveBeenCalledWith(1, mockUserId, {
        title: '제목',
        url: 'https://test.com',
        memo: '메모',
      });
    });

    test('null과 undefined 값을 필터링한다', async () => {
      const mockUpdatedClip = { id: 1, title: '제목', url: 'old-url', memo: 'old-memo', tag_id: 1 };
      updateClipById.mockResolvedValue(mockUpdatedClip);

      const updateFields = { title: '제목', url: null, memo: undefined };
      await updateClip('1', mockUserId, updateFields);

      expect(updateClipById).toHaveBeenCalledWith(1, mockUserId, { title: '제목' });
    });
  });
});
