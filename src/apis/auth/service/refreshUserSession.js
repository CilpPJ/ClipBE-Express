import { supabase } from '../../../db/supabase-client.js';
import { CustomError } from '../../../utils/errors.js';

export const refreshUserSession = async ({ refreshToken }) => {
  if (!refreshToken) {
    throw new CustomError('리프레시 토큰이 필요합니다.', 400);
  }

  const { data, error } = await supabase.auth.refreshSession({
    refresh_token: refreshToken,
  });

  if (error || !data.session) {
    throw new CustomError('유효하지 않은 리프레시 토큰입니다.', 401);
  }

  return {
    accessToken: data.session.access_token,
    refreshToken: data.session.refresh_token,
  };
};
