import { supabase } from '../../../db/supabase-client.js';
import { CustomError } from '../../../utils/errors.js';
import { findProfileByUserId } from '../repository/findProfileByUserId.js';

/**
 * 사용자 로그인 비즈니스 로직을 처리합니다.
 */
export const loginUser = async ({ userId, password }) => {
  const email = `${userId}@clip.com`;

  const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (authError) {
    throw new CustomError('아이디 또는 비밀번호가 잘못되었습니다.', 404);
  }

  const profile = await findProfileByUserId(authData.user.id);
  if (!profile) {
    throw new CustomError('사용자 프로필을 찾을 수 없습니다.', 404);
  }

  return {
    accessToken: authData.session.access_token,
    refreshToken: authData.session.refresh_token,
    nickname: profile.nickname,
  };
};
