import { handleTokenRefresh } from '../apis/auth/controller/handleTokenRefresh.js';
import { handleUserCreate } from '../apis/auth/controller/handleUserCreate.js';
import { handleUserLogin } from '../apis/auth/controller/handlerUserLogin.js';
import { handleGetAllClips } from '../apis/clip/controller/handleGetAllClips.js';
import { handleGetClipById } from '../apis/clip/controller/handleGetClipById.js';

export const router = (app) => {
  app.get('/api/clips', handleGetAllClips);
  app.get('/api/clips/:clipId', handleGetClipById);
  app.post('/api/auth/login', handleUserLogin);
  app.post('/api/auth/signup', handleUserCreate);
  app.post('/api/auth/refresh', handleTokenRefresh);
};
