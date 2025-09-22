import { describe, test, expect } from '@jest/globals';
import { createSuccessResponse, createErrorResponse } from '../../src/utils/responseFormatter.js';

describe('responseFormatter', () => {
  describe('createSuccessResponse', () => {
    test('should create success response with data', () => {
      const testData = { message: 'Test data' };
      const response = createSuccessResponse(testData);

      expect(response.status).toBe('SUCCESS');
      expect(response.data).toEqual(testData);
      expect(response.errorCode).toBeNull();
      expect(response.errorMessage).toBeNull();
      expect(response.serverDateTime).toBeDefined();
      expect(typeof response.serverDateTime).toBe('string');
    });

    test('should create success response with null data', () => {
      const response = createSuccessResponse(null);

      expect(response.status).toBe('SUCCESS');
      expect(response.data).toBeNull();
      expect(response.errorCode).toBeNull();
      expect(response.errorMessage).toBeNull();
    });

    test('should create success response with complex data', () => {
      const complexData = {
        clips: [
          { id: 1, title: 'Test Clip 1' },
          { id: 2, title: 'Test Clip 2' }
        ],
        count: 2
      };
      
      const response = createSuccessResponse(complexData);

      expect(response.status).toBe('SUCCESS');
      expect(response.data).toEqual(complexData);
      expect(response.data.clips).toHaveLength(2);
    });

    test('should include valid ISO datetime', () => {
      const response = createSuccessResponse({});
      const date = new Date(response.serverDateTime);
      
      expect(date).toBeInstanceOf(Date);
      expect(date.toISOString()).toBe(response.serverDateTime);
    });
  });

  describe('createErrorResponse', () => {
    test('should create error response with code and message', () => {
      const errorCode = 'INVALID_INPUT';
      const errorMessage = 'The provided input is invalid';
      
      const response = createErrorResponse(errorCode, errorMessage);

      expect(response.status).toBe('ERROR');
      expect(response.data).toBeNull();
      expect(response.errorCode).toBe(errorCode);
      expect(response.errorMessage).toBe(errorMessage);
      expect(response.serverDateTime).toBeDefined();
    });

    test('should handle empty error code and message', () => {
      const response = createErrorResponse('', '');

      expect(response.status).toBe('ERROR');
      expect(response.data).toBeNull();
      expect(response.errorCode).toBe('');
      expect(response.errorMessage).toBe('');
    });

    test('should include valid ISO datetime', () => {
      const response = createErrorResponse('TEST_ERROR', 'Test error message');
      const date = new Date(response.serverDateTime);
      
      expect(date).toBeInstanceOf(Date);
      expect(date.toISOString()).toBe(response.serverDateTime);
    });
  });
});