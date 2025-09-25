import { beforeEach, describe, expect, jest, test } from '@jest/globals';

// Mock Supabase client
jest.unstable_mockModule('../../../../src/db/supabase-client.js', () => ({
  supabase: {
    from: jest.fn(),
  },
}));

const { supabase } = await import('../../../../src/db/supabase-client.js');
const { updateClipById } = await import('../../../../src/apis/clip/repository/updateClipById.js');
const { CustomError } = await import('../../../../src/utils/errors.js');

describe('updateClipById Repository 테스트', () => {
  let mockFrom, mockUpdate, mockEq, mockSelect, mockSingle;
  const mockUserId = 'test-user-123';
  const mockUpdateData = { title: '수정된 제목', url: 'https://updated.com', memo: '수정된 메모' };

  beforeEach(() => {
    jest.clearAllMocks();

    // Supabase 체인 메서드 모킹
    mockSingle = jest.fn();
    mockSelect = jest.fn(() => ({ single: mockSingle }));
    mockEq = jest.fn(() => ({ eq: mockEq, select: mockSelect }));
    mockUpdate = jest.fn(() => ({ eq: mockEq }));
    mockFrom = jest.fn(() => ({ update: mockUpdate }));

    supabase.from = mockFrom;
  });

  test('클립을 성공적으로 수정한다 (소유자 검증 포함)', async () => {
    const mockUpdatedClip = {
      id: 1,
      title: '수정된 제목',
      url: 'https://updated.com',
      memo: '수정된 메모',
      tag_id: 2,
    };
    mockSingle.mockResolvedValue({ data: mockUpdatedClip, error: null });

    const result = await updateClipById(1, mockUserId, mockUpdateData);

    expect(mockFrom).toHaveBeenCalledWith('clips');
    expect(mockUpdate).toHaveBeenCalledWith(mockUpdateData);
    expect(mockEq).toHaveBeenCalledWith('id', 1);
    expect(mockEq).toHaveBeenCalledWith('user_id', mockUserId);
    expect(mockSelect).toHaveBeenCalledWith('id, title, url, memo, tag_id');
    expect(mockSingle).toHaveBeenCalled();
    expect(result).toEqual(mockUpdatedClip);
  });

  test('존재하지 않는 클립 또는 타인 소유 클립 수정 시 404 에러를 발생시킨다', async () => {
    const mockError = { code: 'PGRST116', message: 'No rows found' };
    mockSingle.mockResolvedValue({ data: null, error: mockError });

    await expect(updateClipById(999, mockUserId, mockUpdateData)).rejects.toThrow(
      new CustomError('CLIP_NOT_FOUND', '수정할 클립을 찾을 수 없습니다.', 404)
    );
  });

  test('데이터베이스 에러 발생 시 500 에러를 발생시킨다', async () => {
    const mockError = { code: 'OTHER_ERROR', message: 'Database connection failed' };
    mockSingle.mockResolvedValue({ data: null, error: mockError });

    await expect(updateClipById(1, mockUserId, mockUpdateData)).rejects.toThrow(
      new CustomError('CLIP_UPDATE_ERROR', '클립 수정 중 오류가 발생했습니다.', 500)
    );
  });

  test('정상적인 clipId, userId, updateData로 올바른 쿼리가 실행된다', async () => {
    const mockUpdatedClip = { id: 42, title: '테스트 제목', url: 'https://test.com', memo: 'test', tag_id: 1 };
    mockSingle.mockResolvedValue({ data: mockUpdatedClip, error: null });

    await updateClipById(42, mockUserId, { title: '테스트 제목' });

    expect(mockUpdate).toHaveBeenCalledWith({ title: '테스트 제목' });
    expect(mockEq).toHaveBeenCalledWith('id', 42);
    expect(mockEq).toHaveBeenCalledWith('user_id', mockUserId);
  });

  test('부분 데이터 수정도 정상적으로 처리한다', async () => {
    const partialUpdate = { title: '새 제목' };
    const mockUpdatedClip = { id: 1, title: '새 제목', url: 'https://old.com', memo: 'old memo', tag_id: 1 };
    mockSingle.mockResolvedValue({ data: mockUpdatedClip, error: null });

    const result = await updateClipById(1, mockUserId, partialUpdate);

    expect(mockUpdate).toHaveBeenCalledWith(partialUpdate);
    expect(result).toEqual(mockUpdatedClip);
  });
});
