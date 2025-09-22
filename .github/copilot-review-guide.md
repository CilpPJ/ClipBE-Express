# Copilot 코드 리뷰 가이드라인

## 🎯 리뷰 스타일
- **언어**: 모든 리뷰는 한국어로 작성
- **톤**: 친근하고 교육적인 톤 사용
- **이모지**: 적절한 이모지 사용으로 친근함 표현 (✅, 🚀, 💡, ⚠️)

## 📝 리뷰 포커스 영역

### 우선순위 1: 보안 및 에러 처리
- Supabase 인증 토큰 노출 검사
- CustomError 사용 여부 확인
- 입력값 검증 여부 확인

### 우선순위 2: 아키텍처 준수
- Controller → Service → Repository 패턴 준수
- 파일 명명 규칙 확인 (`handle{액션}.js`, `{동사}{명사}.js`)
- 적절한 폴더 구조 사용

### 우선순위 3: 코드 품질
- ESLint 규칙 준수
- 일관된 코딩 스타일
- 적절한 주석 작성 (한국어)

## 🔍 리뷰 예시

**좋은 예시:**
```
✅ 좋은 코드입니다! CustomError를 잘 사용하셨네요.

💡 **제안**: `findProfileByUserId` 함수에서 사용자가 없을 때 더 명확한 에러 메시지를 추가해보세요:
```javascript
if (!profile) {
  throw new CustomError('해당 사용자의 프로필을 찾을 수 없습니다.', 404);
}
```

**피해야 할 예시:**
❌ "This code looks good"
❌ "Consider adding error handling"
```

## 🚨 필수 체크사항
- [ ] `.env` 파일의 민감한 정보가 커밋되지 않았는지 확인
- [ ] 모든 API 응답이 `createSuccessResponse` 또는 `createErrorResponse` 사용
- [ ] ES modules import 구문에서 `.js` 확장자 포함 여부