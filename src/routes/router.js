import { handleTokenRefresh } from '../apis/auth/controller/handleTokenRefresh.js';
import { handleUserCreate } from '../apis/auth/controller/handleUserCreate.js';
import { handleUserIdDuplication } from '../apis/auth/controller/handleUserIdDuplication.js';
import { handleNicknameDuplication } from '../apis/auth/controller/handleNicknameDuplication.js';
import { handleUserLogin } from '../apis/auth/controller/handlerUserLogin.js';
import { handleCreateClip } from '../apis/clip/controller/handleCreateClip.js';
import { handleGetAllClips } from '../apis/clip/controller/handleGetAllClips.js';
import { conditionalAuth } from '../middlewares/auth.js';

export const router = (app) => {
  // 인증 제외 경로 설정 (auth API만 제외)
  const authExcludePaths = ['/api/auth'];

  // 전역 인증 미들웨어 적용 (auth API 제외)
  app.use(conditionalAuth(authExcludePaths));

  // Auth API (인증 불필요)
  app.post('/api/auth/login', handleUserLogin);
  app.post('/api/auth/signup', handleUserCreate);
  app.post('/api/auth/refresh', handleTokenRefresh);
  app.post('/api/auth/check/duplicateId/:userId', handleUserIdDuplication);
  app.post('/api/auth/check/duplicateNickname/:nickname', handleNicknameDuplication);

  // Clip API (인증 필요)
  app.get('/api/clips', handleGetAllClips);
  app.post('/api/clips', handleCreateClip);
};
