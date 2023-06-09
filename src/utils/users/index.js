import JWTDecode from 'jwt-decode';

import {getAccessToken, getAnonymousToken} from '../token';

export const getUserId = async () => {
  const token = await getAccessToken();
  if (token) {
    const id = await JWTDecode(token.id).user_id;
    return id;
  }
  return null;
};

export const getAnonymousUserId = async () => {
  try {
    const token = await getAnonymousToken();
    if (token) {
      const id = await JWTDecode(token).user_id;
      return id;
    }
    return null;
  } catch (e) {
    console.log(e);
    return null;
  }
};
