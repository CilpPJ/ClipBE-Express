import { handleGetAllClips } from '../apis/clip/controller/handleGetAllClips.js';

export const router = (app) => {
  app.get('/api/clips', handleGetAllClips);
};
