import { handleUserCreate } from '../apis/auth/controller/handleUserCreate.js';
import { handleUserLogin } from '../apis/auth/controller/handlerUserLogin.js';
import { handleGetAllClips } from '../apis/clip/controller/handleGetAllClips.js';

export const router = (app) => {
  app.get('/api/clips', handleGetAllClips);
  app.post('/api/auth/login', handleUserLogin);
  app.post('/api/auth/signup', handleUserCreate);
};
