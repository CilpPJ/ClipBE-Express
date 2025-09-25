import { beforeEach, describe, expect, jest, test } from '@jest/globals';

// Mock Supabase client
jest.unstable_mockModule('../../../../src/db/supabase-client.js', () => ({
  supabase: {
    from: jest.fn(),
  },
}));

const { supabase } = await import('../../../../src/db/supabase-client.js');
const { deleteClipById } = await import('../../../../src/apis/clip/repository/deleteClipById.js');
const { CustomError } = await import('../../../../src/utils/errors.js');

describe('deleteClipById Repository 테스트', () => {
  let mockFrom, mockDelete, mockEq, mockSelect, mockSingle;
  const mockUserId = 'test-user-123';

  beforeEach(() => {
    jest.clearAllMocks();

    // Supabase 체인 메서드 모킹
    mockSingle = jest.fn();
    mockSelect = jest.fn(() => ({ single: mockSingle }));
    mockEq = jest.fn(() => ({ eq: mockEq, select: mockSelect }));
    mockDelete = jest.fn(() => ({ eq: mockEq }));
    mockFrom = jest.fn(() => ({ delete: mockDelete }));

    supabase.from = mockFrom;
  });

  test('클립을 성공적으로 삭제한다 (소유자 검증 포함)', async () => {
    const mockClipData = { id: 1, title: '테스트 클립' };
    mockSingle.mockResolvedValue({ data: mockClipData, error: null });

    const result = await deleteClipById(1, mockUserId);

    expect(mockFrom).toHaveBeenCalledWith('clips');
    expect(mockDelete).toHaveBeenCalled();
    expect(mockEq).toHaveBeenCalledWith('id', 1);
    expect(mockEq).toHaveBeenCalledWith('user_id', mockUserId);
    expect(mockSelect).toHaveBeenCalledWith('id, title');
    expect(mockSingle).toHaveBeenCalled();
    expect(result).toEqual(mockClipData);
  });

  test('존재하지 않는 클립 또는 타인 소유 클립 삭제 시 404 에러를 발생시킨다', async () => {
    const mockError = { code: 'PGRST116', message: 'No rows found' };
    mockSingle.mockResolvedValue({ data: null, error: mockError });

    await expect(deleteClipById(999, mockUserId)).rejects.toThrow(
      new CustomError('CLIP_NOT_FOUND', '삭제할 클립을 찾을 수 없습니다.', 404)
    );
  });

  test('데이터베이스 에러 발생 시 500 에러를 발생시킨다', async () => {
    const mockError = { code: 'OTHER_ERROR', message: 'Database connection failed' };
    mockSingle.mockResolvedValue({ data: null, error: mockError });

    await expect(deleteClipById(1, mockUserId)).rejects.toThrow(
      new CustomError('CLIP_DELETE_ERROR', '클립 삭제 중 오류가 발생했습니다.', 500)
    );
  });

  test('정상적인 clipId와 userId로 올바른 쿼리가 실행된다', async () => {
    const mockClipData = { id: 42, title: '삭제될 클립' };
    mockSingle.mockResolvedValue({ data: mockClipData, error: null });

    await deleteClipById(42, mockUserId);

    expect(mockEq).toHaveBeenCalledWith('id', 42);
    expect(mockEq).toHaveBeenCalledWith('user_id', mockUserId);
  });
});
