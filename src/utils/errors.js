export class CustomError extends Error {
  /**
   * @param {string} message 에러 메시지
   * @param {number} statusCode HTTP 상태 코드
   */
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
    this.name = this.constructor.name;
  }
}
