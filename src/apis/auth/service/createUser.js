import { supabase } from '../../../db/supabase-client.js';
import { CustomError } from '../../../utils/errors.js';
import { createProfile } from '../repository/createProfile.js';
import { findProfileByNickname } from '../repository/findProfileByNickName.js';

export const createUser = async ({ userId, password, nickname }) => {
  const existingNickname = await findProfileByNickname(nickname);
  if (existingNickname) {
    throw new CustomError('이미 사용 중인 닉네임입니다.', 409);
  }

  const email = `${userId}@clip.com`;

  const { data: authData, error: authError } = await supabase.auth.signUp({
    email,
    password,
  });

  if (authError) {
    throw new CustomError(authError.message, 409);
  }

  const newProfile = await createProfile({
    id: authData.user.id,
    nickname,
  });

  return {
    userId: userId,
    nickname: newProfile.nickname,
  };
};
