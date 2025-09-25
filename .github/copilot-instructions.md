# Copilot Instructions for ClipBE-Express

## � 언어 및 커뮤니케이션 설정

**모든 대화와 코드 리뷰는 한국어로 진행해주세요.**
- PR 리뷰 댓글: 한국어로 작성
- 에러 메시지 설명: 한국어로 설명  
- 코드 제안 사유: 한국어로 설명
- 변수명과 함수명: 영어 (코드 컨벤션 유지)
- 주석: 한국어 (개발팀 이해도 향상)

## �🎯 프론트엔드 개발자를 위한 Express 백엔드 가이드

ClipBE-Express는 Node.js/Express API 서버로, 프론트엔드와 비슷한 모듈 구조를 사용합니다:

- **Entry Point**: `app.js` - React의 App.js와 비슷하게 앱을 설정하고 시작점 역할
- **Database**: Supabase - Firebase와 유사한 BaaS(Backend as a Service)
- **Deployment**: Vercel - Next.js 배포하듯이 간단하게 배포 가능

## 프론트엔드와 백엔드 비교

| 프론트엔드 | 백엔드 (이 프로젝트) | 설명 |
|---|---|---|
| 컴포넌트 | 컨트롤러 | 사용자 요청을 받아서 처리하는 함수 |
| 훅/유틸 | 서비스 | 비즈니스 로직을 처리하는 함수 |
| API 호출 | 리포지토리 | 데이터베이스와 소통하는 함수 |
| props | req.body | 클라이언트에서 전달받는 데이터 |
| return JSX | res.json() | 클라이언트에게 응답을 보내는 방법 |

## 🏗️ 폴더 구조 (프론트엔드 관점)

프론트엔드의 컴포넌트 폴더 구조와 비슷하게, 각 기능별로 폴더를 나눠서 관리합니다:

```
src/apis/{기능명}/           # 예: auth(인증), clip(클립), friend(친구)
├── controller/              # React 컴포넌트와 비슷 - 요청받고 응답하는 역할
│   └── handleXxx.js        # 예: handleUserLogin.js
├── service/                # 커스텀 훅과 비슷 - 실제 로직 처리
│   └── xxxYyy.js          # 예: loginUser.js
├── repository/             # API 호출 함수와 비슷 - 데이터베이스 접근
│   └── findXxx.js         # 예: findProfileByUserId.js
├── entity/                 # TypeScript 타입 정의와 비슷
└── model/                  # 요청/응답 데이터 구조 정의
```

## 💡 간단한 API 동작 흐름

프론트엔드에서 버튼 클릭 → API 호출과 비슷하게:

1. **라우터** (`src/routes/router.js`): URL과 함수를 연결 (React Router와 비슷)
2. **컨트롤러**: 요청을 받아서 데이터 추출 (이벤트 핸들러와 비슷)
3. **서비스**: 실제 비즈니스 로직 처리 (커스텀 훅의 로직과 비슷)
4. **리포지토리**: 데이터베이스에서 데이터 가져오기 (fetch/axios와 비슷)

## 📝 코드 작성 패턴

### 컨트롤러 (Controller) - 이벤트 핸들러 같은 역할
프론트엔드의 onClick 핸들러와 비슷합니다:

```javascript
// 프론트엔드 onClick 핸들러와 비교
const handleButtonClick = async () => {
  try {
    const data = await fetchUserData();
    setUser(data);
  } catch (error) {
    setError(error.message);
  }
};

// 백엔드 컨트롤러 (handleUserLogin.js)
export const handleUserLogin = async (req, res) => {
  try {
    const { userId, password } = req.body;  // 프론트엔드에서 보낸 데이터
    const loginData = await loginUser({ userId, password });  // 로직 처리
    const successResponse = createSuccessResponse(loginData);  // 성공 응답 생성
    res.status(200).json(successResponse);  // 프론트엔드로 응답 보내기
  } catch (error) {
    // 에러 처리 (프론트엔드의 catch와 비슷)
    const errorResponse = createErrorResponse(error.name, error.message);
    res.status(error.statusCode).json(errorResponse);
  }
};
```

### 서비스 (Service) - 커스텀 훅의 로직 부분
실제 비즈니스 로직을 처리합니다:

```javascript
// loginUser.js - 로그인 로직 처리
export const loginUser = async ({ userId, password }) => {
  // 1. Supabase 인증 (Firebase Auth와 비슷)
  const email = `${userId}@clip.com`;  // 이 프로젝트만의 특별한 규칙
  const { data: authData, error } = await supabase.auth.signInWithPassword({
    email, password
  });
  
  if (error) {
    throw new CustomError('로그인 실패', 404);  // 프론트엔드로 에러 전달
  }
  
  // 2. 사용자 프로필 정보 가져오기
  const profile = await findProfileByUserId(authData.user.id);
  
  // 3. 프론트엔드에 필요한 데이터만 반환
  return {
    accessToken: authData.session.access_token,
    refreshToken: authData.session.refresh_token,
    nickname: profile.nickname,
  };
};
```

## Response Format Standard

ALL API responses must use the standardized format via `src/utils/responseFormatter.js`:

```javascript
// Success: createSuccessResponse(data)
{
  "data": {...},
  "status": "SUCCESS", 
  "serverDateTime": "2025-01-01T00:00:00.000Z",
  "errorCode": null,
  "errorMessage": null
}

// Error: createErrorResponse(errorCode, errorMessage)  
{
  "data": null,
  "status": "ERROR",
  "serverDateTime": "2025-01-01T00:00:00.000Z", 
  "errorCode": "USER_NOT_FOUND",
  "errorMessage": "사용자를 찾을 수 없습니다."
}
```

## Authentication System

Uses Supabase Auth with custom email format:
- User ID becomes `{userId}@clip.com` for Supabase
- Profile data stored separately in profiles table
- JWT tokens managed by Supabase (access + refresh pattern)

## 🔧 개발 환경 설정 (프론트엔드와 비슷)

### 개발 서버 시작
```bash
pnpm start  # React의 npm start와 비슷 - 자동 새로고침
```

### 코드 품질 관리
```bash
pnpm lint       # ESLint 검사 (React 프로젝트와 동일)
pnpm lint:fix   # 자동 수정
pnpm format:fix # Prettier 포맷팅
```

### 필수 환경변수 (.env 파일)
```
SUPABASE_URL=your_supabase_url           # Firebase config와 비슷
SUPABASE_SERVICE_KEY=your_service_key    # Firebase admin key와 비슷
```

## 🗂️ 파일 명명 규칙 (외우기 쉽게)

- **컨트롤러**: `handle{액션}.js` → `handleUserLogin.js`
- **서비스**: `{동사}{명사}.js` → `loginUser.js`, `createUser.js`
- **리포지토리**: `find{엔티티}.js` → `findProfileByUserId.js`
- **라우트**: `/api/{도메인}/{액션}` → `/api/auth/login`

## 🚀 배포 (Vercel)

프론트엔드 배포와 거의 동일:
- `vercel.json` 설정 파일로 배포 구성
- GitHub 연결하면 자동 배포
- Swagger UI용 CDN 라우팅 설정 포함

## PR 작성 규칙
- 모든 PR은 최대한 상세하게 작성합니다.
- 프로젝트 내 PR 템플릿을 바탕으로 작성합니다.
- 어떤 기술을 사용했다면, 그 기술을 왜 사용했는지 설명합니다.
- 코드 리뷰어가 이해하기 쉽게 작성합니다.
- PR 제목은 간결하고 명확하게 작성합니다.
- 변경된 파일이 많다면, 주요 변경 사항을 요약합니다.
- 테스트 코드가 포함된 경우, 테스트 방법과 커버리지를 설명합니다.
- 사용자가 PR 작성을 요청했을 때는 PR.md 파일을 생성하고, 그 파일을 바탕으로 PR을 생성합니다.
- Github CLI를 사용하여 PR을 생성합니다.
- PR이 작성된 후에는 PR.md 파일을 삭제합니다.