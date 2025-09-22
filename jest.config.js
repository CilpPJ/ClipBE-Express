export default {
  // Node.js 환경에서 테스트 실행
  testEnvironment: 'node',
  
  // ES modules 지원
  preset: null,
  transform: {},
  
  // 테스트 파일 경로 패턴
  testMatch: [
    '**/tests/**/*.test.js',
    '**/tests/**/*.spec.js'
  ],
  
  // 테스트 제외할 파일들
  testPathIgnorePatterns: [
    '/node_modules/',
    '/dist/'
  ],
  
  // 커버리지 수집 대상 파일들
  collectCoverageFrom: [
    'src/**/*.js',
    '!src/**/*.test.js',
    '!src/**/*.spec.js'
  ],
  
  // 커버리지 출력 디렉토리
  coverageDirectory: 'coverage',
  
  // 커버리지 리포터
  coverageReporters: ['text', 'lcov', 'html'],
  
  // 설정 완료 후 실행할 스크립트
  setupFilesAfterEnv: ['<rootDir>/tests/setup.js']
};