import { describe, test, expect, jest } from '@jest/globals';

// Mock the repository before importing the service
jest.unstable_mockModule('../../../../src/apis/clip/repository/findAllClips.js', () => ({
  findAllClips: jest.fn()
}));

// Import after mocking
const { getAllClips } = await import('../../../../src/apis/clip/service/getAllClips.js');
const { findAllClips } = await import('../../../../src/apis/clip/repository/findAllClips.js');

describe('getAllClips service', () => {
  test('should return formatted clips data with success response', async () => {
    // Mock data that would come from the repository
    const mockRawClips = [
      {
        title: 'Test Clip 1',
        tag_id: 1,
        url: 'https://example.com/clip1',
        thumbnail: 'https://example.com/thumb1.jpg',
        tags: { name: 'Technology' },
        memo: 'This is a test memo',
        created_at: '2023-01-01T00:00:00.000Z'
      },
      {
        title: 'Test Clip 2',
        tag_id: 2,
        url: 'https://example.com/clip2',
        thumbnail: null,
        tags: { name: 'Design' },
        memo: null,
        created_at: '2023-01-02T00:00:00.000Z'
      }
    ];

    // Mock the repository function
    findAllClips.mockResolvedValue(mockRawClips);

    // Call the service
    const result = await getAllClips();

    // Verify the repository was called
    expect(findAllClips).toHaveBeenCalledTimes(1);

    // Verify the response structure
    expect(result.status).toBe('SUCCESS');
    expect(result.data).toBeDefined();
    expect(result.errorCode).toBeNull();
    expect(result.errorMessage).toBeNull();

    // Verify the data structure
    const data = result.data;
    expect(data.size).toBe(20);
    expect(data.content).toHaveLength(2);
    expect(data.numberOfElements).toBe(2);
    expect(data.first).toBe(true);
    expect(data.last).toBe(true);
    expect(data.empty).toBe(false);

    // Verify the clip data transformation
    expect(data.content[0]).toEqual({
      title: 'Test Clip 1',
      tagId: 1,
      url: 'https://example.com/clip1',
      thumbnail: 'https://example.com/thumb1.jpg',
      tagName: 'Technology',
      memo: 'This is a test memo',
      createdAt: '2023-01-01T00:00:00.000Z'
    });

    expect(data.content[1]).toEqual({
      title: 'Test Clip 2',
      tagId: 2,
      url: 'https://example.com/clip2',
      thumbnail: null,
      tagName: 'Design',
      memo: null,
      createdAt: '2023-01-02T00:00:00.000Z'
    });
  });

  test('should return empty content when no clips exist', async () => {
    // Mock empty array from repository
    findAllClips.mockResolvedValue([]);

    const result = await getAllClips();

    expect(result.status).toBe('SUCCESS');
    expect(result.data.content).toHaveLength(0);
    expect(result.data.numberOfElements).toBe(0);
    expect(result.data.empty).toBe(true);
  });

  test('should include correct pagination metadata', async () => {
    findAllClips.mockResolvedValue([]);

    const result = await getAllClips();
    const data = result.data;

    // Verify pagination structure
    expect(data.pageable).toEqual({
      offset: 0,
      sort: [{
        direction: 'DESC',
        nullHandling: 'NATIVE',
        ascending: false,
        property: 'createdAt',
        ignoreCase: false,
      }],
      paged: true,
      pageNumber: 0,
      pageSize: 20,
      unpaged: false,
    });

    expect(data.sort).toEqual([{
      direction: 'DESC',
      nullHandling: 'NATIVE',
      ascending: false,
      property: 'createdAt',
      ignoreCase: false,
    }]);
  });
});