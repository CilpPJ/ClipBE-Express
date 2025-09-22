// 테스트 전역 설정 파일
import { jest } from '@jest/globals';
import dotenv from 'dotenv';

// 환경변수 로드 (테스트용)
dotenv.config();

// 글로벌 Jest 변수들을 전역으로 설정
global.jest = jest;
global.describe = describe;
global.test = test;
global.expect = expect;
global.beforeAll = beforeAll;
global.afterAll = afterAll;
global.beforeEach = beforeEach;
global.afterEach = afterEach;

// 테스트 환경에서 console.log 등의 로그를 숨기고 싶다면 주석 해제
// console.log = jest.fn();
// console.error = jest.fn();
// console.warn = jest.fn();

// 테스트 전역 타임아웃 설정 (기본 5초)
jest.setTimeout(10000);
