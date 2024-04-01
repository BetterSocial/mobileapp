import JWTDecode from 'jwt-decode';

import TokenStorage, {ITokenEnum} from '../storage/custom/tokenStorage';

export const getUserId = () => {
  const token = TokenStorage.get(ITokenEnum.token);
  if (token) {
    try {
      const id = JWTDecode(token).user_id;
      return id;
    } catch (e) {
      console.log('error on get user id', e);
      return null;
    }
  }
  return null;
};

export const getAnonymousUserId = () => {
  try {
    const token = TokenStorage.get(ITokenEnum.anonymousToken);
    if (token) {
      const id = JWTDecode(token).user_id;
      return id;
    }
    return null;
  } catch (e) {
    console.log(e);
    return null;
  }
};
