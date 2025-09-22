## 📝 요약 (Summary)

> (PR의 목적을 한두 문장으로 요약합니다.)

## ✅ 주요 변경 사항 (Key Changes)

- 
- 
- 

## 💻 상세 구현 내용 (Implementation Details)

> (필요하다면 기능별로 소제목을 나누어, 변경된 내용에 대해 기술적인 설명을 작성합니다. 코드 스니펫이나 이미지를 활용하면 좋습니다.)

## 🚀 트러블 슈팅 (Trouble Shooting)

> (이번 작업을 진행하면서 겪었던 문제와, 그것을 어떻게 해결했는지 과정을 기록합니다.)

## ⚠️ 알려진 이슈 및 참고 사항 (Known Issues & Notes)

> (이번 PR에서 해결하지 않았지만, 리뷰어가 알아야 할 관련 버그나 기술적 부채, 추후 개선 사항 등을 기록합니다.)

## 📸 스크린샷 (Screenshots)

> (구현한 페이지에 대한 스크린샷)

## #️⃣ 관련 이슈 (Related Issues)

-

## 🤖 Copilot 리뷰 가이드라인

**리뷰어 및 Copilot에게 요청사항:**
- [ ] 모든 리뷰는 **한국어**로 작성해주세요
- [ ] Controller → Service → Repository 패턴 준수 여부 확인
- [ ] CustomError 및 responseFormatter 사용 여부 체크
- [ ] 파일 명명 규칙 (`handle{액션}.js`, `{동사}{명사}.js`) 확인
- [ ] ES modules import에서 `.js` 확장자 포함 여부 확인

**특별히 검토해주세요:**
- [ ] 보안: Supabase 키나 민감한 정보 노출 여부
- [ ] 에러 처리: 적절한 에러 메시지와 상태 코드 사용
- [ ] 코드 일관성: 기존 프로젝트 패턴과의 일치성