import JWTDecode from 'jwt-decode';

import { getAccessToken } from '../token';

export const getUserId = async () => {
  const token = await getAccessToken();
  if (token) {
    const id = await JWTDecode(token.id).user_id;
    return id;
  }
  return null;
};
