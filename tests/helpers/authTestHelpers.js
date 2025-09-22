// 🔧 Auth 테스트 헬퍼 함수들
// 테스트에서 사용하는 응답 생성 및 검증 로직

/**
 * 로그인 성공 응답 생성
 * @param {Object} authData - Supabase auth 응답 데이터
 * @param {Object} profileData - 사용자 프로필 데이터
 * @returns {Object} 로그인 서비스 응답 형태
 */
export const createAuthResponse = (authData, profileData) => ({
  accessToken: authData.session.access_token,
  refreshToken: authData.session.refresh_token,
  nickname: profileData.nickname,
});

/**
 * 회원가입 성공 응답 생성
 * @param {Object} profileData - 생성된 프로필 데이터
 * @param {string} originalUserId - 원본 사용자 ID
 * @returns {Object} 회원가입 서비스 응답 형태
 */
export const createSignUpResponse = (profileData, originalUserId) => ({
  userId: originalUserId,
  nickname: profileData.nickname,
});

/**
 * 토큰 리프레시 성공 응답 생성
 * @param {Object} sessionData - Supabase 세션 데이터
 * @returns {Object} 토큰 리프레시 서비스 응답 형태
 */
export const createRefreshResponse = (sessionData) => ({
  accessToken: sessionData.session.access_token,
  refreshToken: sessionData.session.refresh_token,
});

/**
 * 에러 응답 검증 헬퍼
 * @param {Error} error - 발생한 에러
 * @param {string} expectedMessage - 예상 에러 메시지
 * @param {number} expectedStatus - 예상 상태 코드
 */
export const expectCustomError = (error, expectedMessage, expectedStatus) => {
  expect(error.message).toBe(expectedMessage);
  expect(error.statusCode).toBe(expectedStatus);
};

/**
 * Mock 함수 호출 검증 헬퍼
 * @param {jest.MockedFunction} mockFn - 모킹된 함수
 * @param {Array} expectedArgs - 예상 인자들
 * @param {number} expectedCallCount - 예상 호출 횟수
 */
export const expectMockCalled = (mockFn, expectedArgs, expectedCallCount = 1) => {
  expect(mockFn).toHaveBeenCalledWith(...expectedArgs);
  expect(mockFn).toHaveBeenCalledTimes(expectedCallCount);
};
