import { supabase } from '../../../db/supabase-client.js';

/**
 * 모든 클립 데이터를 조회하는 API 핸들러
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 */
export const handleGetAllClips = async (req, res) => {
  try {
    const { data, error } = await supabase.from('clips').select('*');

    if (error) {
      throw error;
    }

    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
