import JWTDecode from 'jwt-decode';

import TokenStorage, {ITokenEnum} from '../storage/custom/tokenStorage';

export const getUserId = async () => {
  const token = TokenStorage.get(ITokenEnum.token);
  if (token) {
    try {
      const id = await JWTDecode(token).user_id;
      return id;
    } catch (e) {
      console.log('error on get user id', e);
      return null;
    }
  }
  return null;
};

export const getAnonymousUserId = async () => {
  try {
    const token = TokenStorage.get(ITokenEnum.refreshToken);
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
