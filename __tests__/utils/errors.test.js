import { describe, test, expect } from '@jest/globals';
import { CustomError } from '../../src/utils/errors.js';

describe('CustomError', () => {
  test('should create custom error with message and status code', () => {
    const message = 'Test error message';
    const statusCode = 404;
    
    const error = new CustomError(message, statusCode);

    expect(error).toBeInstanceOf(Error);
    expect(error).toBeInstanceOf(CustomError);
    expect(error.message).toBe(message);
    expect(error.statusCode).toBe(statusCode);
    expect(error.name).toBe('CustomError');
  });

  test('should handle different status codes', () => {
    const statusCodes = [400, 401, 403, 404, 500];
    
    statusCodes.forEach(code => {
      const error = new CustomError('Test message', code);
      expect(error.statusCode).toBe(code);
    });
  });

  test('should preserve error stack trace', () => {
    const error = new CustomError('Test error', 500);
    
    expect(error.stack).toBeDefined();
    expect(typeof error.stack).toBe('string');
    expect(error.stack).toContain('CustomError');
  });

  test('should be throwable and catchable', () => {
    const errorMessage = 'Test throwable error';
    const statusCode = 400;

    expect(() => {
      throw new CustomError(errorMessage, statusCode);
    }).toThrow(CustomError);

    expect(() => {
      throw new CustomError(errorMessage, statusCode);
    }).toThrow(errorMessage);

    try {
      throw new CustomError(errorMessage, statusCode);
    } catch (error) {
      expect(error.statusCode).toBe(statusCode);
    }
  });
});