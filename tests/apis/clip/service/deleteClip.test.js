import { beforeEach, describe, expect, jest, test } from '@jest/globals';

// Mock repository
jest.unstable_mockModule('../../../../src/apis/clip/repository/deleteClipById.js', () => ({
  deleteClipById: jest.fn(),
}));

const { deleteClipById } = await import('../../../../src/apis/clip/repository/deleteClipById.js');
const { deleteClip } = await import('../../../../src/apis/clip/service/deleteClip.js');
const { CustomError } = await import('../../../../src/utils/errors.js');

describe('deleteClip Service 테스트', () => {
  const mockUserId = 'test-user-123';

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('✅ 성공 케이스', () => {
    test('유효한 clipId와 userId로 클립을 성공적으로 삭제한다', async () => {
      const mockDeletedClip = { id: 1, title: '테스트 클립' };
      deleteClipById.mockResolvedValue(mockDeletedClip);

      const result = await deleteClip('1', mockUserId);

      expect(deleteClipById).toHaveBeenCalledWith(1, mockUserId);
      expect(result).toEqual({
        message: '클립이 성공적으로 삭제되었습니다.',
        deletedClipId: 1,
        deletedClipTitle: '테스트 클립',
      });
    });

    test('숫자 형태의 clipId를 올바르게 처리한다', async () => {
      const mockDeletedClip = { id: 42, title: '또 다른 클립' };
      deleteClipById.mockResolvedValue(mockDeletedClip);

      const result = await deleteClip(42, mockUserId);

      expect(deleteClipById).toHaveBeenCalledWith(42, mockUserId);
      expect(result.deletedClipId).toBe(42);
    });
  });

  describe('❌ 에러 케이스', () => {
    test('clipId가 없으면 400 에러를 발생시킨다', async () => {
      await expect(deleteClip(null, mockUserId)).rejects.toThrow(
        new CustomError('INVALID_CLIP_ID', '유효하지 않은 클립 ID입니다.', 400)
      );
      await expect(deleteClip(undefined, mockUserId)).rejects.toThrow(
        new CustomError('INVALID_CLIP_ID', '유효하지 않은 클립 ID입니다.', 400)
      );
      await expect(deleteClip('', mockUserId)).rejects.toThrow(
        new CustomError('INVALID_CLIP_ID', '유효하지 않은 클립 ID입니다.', 400)
      );
    });

    test('userId가 없으면 400 에러를 발생시킨다', async () => {
      await expect(deleteClip('1', null)).rejects.toThrow(
        new CustomError('INVALID_USER_ID', '유효하지 않은 사용자 ID입니다.', 400)
      );
      await expect(deleteClip('1', undefined)).rejects.toThrow(
        new CustomError('INVALID_USER_ID', '유효하지 않은 사용자 ID입니다.', 400)
      );
      await expect(deleteClip('1', '')).rejects.toThrow(
        new CustomError('INVALID_USER_ID', '유효하지 않은 사용자 ID입니다.', 400)
      );
    });

    test('유효하지 않은 clipId 형식이면 400 에러를 발생시킨다', async () => {
      await expect(deleteClip('abc', mockUserId)).rejects.toThrow(
        new CustomError('INVALID_CLIP_ID', '유효하지 않은 클립 ID입니다.', 400)
      );
      await expect(deleteClip('0', mockUserId)).rejects.toThrow(
        new CustomError('INVALID_CLIP_ID', '유효하지 않은 클립 ID입니다.', 400)
      );
      await expect(deleteClip('-1', mockUserId)).rejects.toThrow(
        new CustomError('INVALID_CLIP_ID', '유효하지 않은 클립 ID입니다.', 400)
      );
    });

    test('Repository에서 에러가 발생하면 에러를 전파한다', async () => {
      const mockError = new CustomError('CLIP_NOT_FOUND', '클립을 찾을 수 없습니다.', 404);
      deleteClipById.mockRejectedValue(mockError);

      await expect(deleteClip('1', mockUserId)).rejects.toThrow(mockError);
    });
  });

  describe('🧪 경계값 테스트', () => {
    test('매우 큰 숫자도 올바르게 처리한다', async () => {
      const largeId = 999999999;
      const mockDeletedClip = { id: largeId, title: '큰 ID 클립' };
      deleteClipById.mockResolvedValue(mockDeletedClip);

      const result = await deleteClip(largeId.toString(), mockUserId);

      expect(deleteClipById).toHaveBeenCalledWith(largeId, mockUserId);
      expect(result.deletedClipId).toBe(largeId);
    });

    test('문자열 숫자를 정수로 변환하여 처리한다', async () => {
      const mockDeletedClip = { id: 123, title: '문자열 ID 클립' };
      deleteClipById.mockResolvedValue(mockDeletedClip);

      await deleteClip('123', mockUserId);

      expect(deleteClipById).toHaveBeenCalledWith(123, mockUserId);
    });
  });
});
