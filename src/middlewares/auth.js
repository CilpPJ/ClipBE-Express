import { supabase } from '../db/supabase-client.js';
import { createErrorResponse } from '../utils/responseFormatter.js';

/**
 * JWT 토큰을 검증하는 인증 미들웨어
 * Authorization 헤더에서 Bearer 토큰을 추출하고 Supabase로 검증합니다.
 * @param {Object} req - Express 요청 객체
 * @param {Object} res - Express 응답 객체
 * @param {Function} next - 다음 미들웨어 함수
 */
export const authenticateToken = async (req, res, next) => {
  try {
    // Authorization 헤더에서 토큰 추출
    const token = extractBearerToken(req);

    if (!token) {
      const errorResponse = createErrorResponse('UNAUTHORIZED', '토큰이 제공되지 않았습니다.');
      return res.status(401).json(errorResponse);
    }

    // Supabase로 토큰 검증
    const {
      data: { user },
      error,
    } = await supabase.auth.getUser(token);

    if (error || !user) {
      const errorResponse = createErrorResponse('UNAUTHORIZED', '유효하지 않거나 만료된 토큰입니다.');
      return res.status(401).json(errorResponse);
    }

    // 사용자 정보를 req 객체에 추가
    req.user = user;

    next();
  } catch {
    // 인증 처리 중 예상치 못한 오류 발생
    const errorResponse = createErrorResponse('INTERNAL_ERROR', '인증 처리 중 오류가 발생했습니다.');
    return res.status(500).json(errorResponse);
  }
};

/**
 * 공통 Bearer 토큰 추출 헬퍼 함수
 * @param {Object} req - Express 요청 객체
 * @returns {string|null} 추출된 토큰 또는 null
 */
const extractBearerToken = (req) => {
  const authHeader = req.headers.authorization;
  const match = authHeader?.match(/^Bearer\s+(.+)$/i);
  return match ? match[1].trim() : null;
};

/**
 * 선택적 인증 미들웨어
 * 토큰이 있으면 인증을 수행하고, 없어도 계속 진행합니다.
 * 토큰이 유효하지 않은 경우에만 에러를 반환합니다.
 * @param {Object} req - Express 요청 객체
 * @param {Object} res - Express 응답 객체
 * @param {Function} next - 다음 미들웨어 함수
 */
export const optionalAuth = async (req, res, next) => {
  try {
    // Authorization 헤더에서 토큰 추출
    const token = extractBearerToken(req);

    // 토큰이 없으면 인증 없이 계속 진행
    if (!token) {
      req.user = null; // 사용자 정보를 null로 설정
      return next();
    }

    // Supabase로 토큰 검증
    const {
      data: { user },
      error,
    } = await supabase.auth.getUser(token);

    if (error || !user) {
      // 토큰이 유효하지 않은 경우에만 에러 반환
      const errorResponse = createErrorResponse('UNAUTHORIZED', '유효하지 않거나 만료된 토큰입니다.');
      return res.status(401).json(errorResponse);
    }

    // 사용자 정보를 req 객체에 추가
    req.user = user;
    next();
  } catch {
    // 인증 처리 중 예상치 못한 오류 발생
    const errorResponse = createErrorResponse('INTERNAL_ERROR', '인증 처리 중 오류가 발생했습니다.');
    return res.status(500).json(errorResponse);
  }
};

/**
 * 특정 경로들을 인증에서 제외하는 미들웨어
 * auth 관련 API는 인증 없이 접근 가능하도록 합니다.
 * @param {Array<string>} excludePaths - 인증에서 제외할 경로 배열
 * @returns {Function} Express 미들웨어 함수
 */
export const conditionalAuth = (excludePaths = []) => {
  return (req, res, next) => {
    // 현재 요청 경로가 제외 목록에 있는지 확인
    const isExcluded = excludePaths.some((path) => {
      if (typeof path === 'string') {
        return req.path.startsWith(path);
      }
      if (path instanceof RegExp) {
        return path.test(req.path);
      }
      return false;
    });

    if (isExcluded) {
      // 인증 제외 경로는 바로 다음 미들웨어로
      return next();
    }

    // 인증이 필요한 경로는 authenticateToken 미들웨어 실행
    return authenticateToken(req, res, next);
  };
};
