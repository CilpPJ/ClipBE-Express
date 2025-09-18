import { getAllClips } from '../service/getAllClips.js';

/**
 * 모든 클립 데이터를 조회하는 API 핸들러
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 */
export const handleGetAllClips = async (req, res) => {
  try {
    const clipsData = await getAllClips();

    res.status(200).json(clipsData);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
