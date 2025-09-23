/**
 * 클립 생성 요청 모델
 * @typedef {Object} CreateClipRequest
 * @property {string} title - 클립 제목 (필수)
 * @property {string} url - 클립 URL (필수)
 * @property {string} tagName - 태그 이름 (필수)
 * @property {string} [memo] - 클립 메모 (선택사항)
 * @property {string} [thumbnail] - 썸네일 URL (선택사항)
 */

/**
 * 클립 생성 응답 모델
 * @typedef {Object} CreateClipResponse
 * @property {Object} data - 응답 데이터
 * @property {number} data.id - 생성된 클립 ID
 * @property {string} data.title - 클립 제목
 * @property {string} data.url - 클립 URL
 * @property {number} data.tag_id - 태그 ID
 * @property {string} data.user_id - 사용자 ID
 * @property {string|null} data.memo - 클립 메모
 * @property {string|null} data.thumbnail - 썸네일 URL
 * @property {string} data.created_at - 생성 날짜
 * @property {string} data.updated_at - 수정 날짜
 * @property {string} status - 응답 상태 ("SUCCESS")
 * @property {string} serverDateTime - 서버 시간
 * @property {null} errorCode - 에러 코드 (성공시 null)
 * @property {null} errorMessage - 에러 메시지 (성공시 null)
 */

export const CreateClipRequest = {};
export const CreateClipResponse = {};
