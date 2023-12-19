/* eslint-disable no-shadow */
import StorageUtils from '..';

type ITokenResponse = {
  token: string;
  refresh_token: string;
  anonymousToken: string;
};

export enum ITokenEnum {
  token = 'token',
  refreshToken = 'refresh_token',
  anonymousToken = 'anonymousToken'
}

interface ITokenStorage {
  set: (response: ITokenResponse) => void;
  get: (tokenEnum: ITokenEnum) => string | null | undefined;
  clear: () => void;
}

const TokenStorage: ITokenStorage = {
  set: (response: ITokenResponse) => {
    StorageUtils.jwtToken.set(response.token);
    StorageUtils.refreshToken.set(response.refresh_token);
    StorageUtils.anonymousToken.set(response.anonymousToken);
  },
  get: (tokenEnum: ITokenEnum) => {
    switch (tokenEnum) {
      case ITokenEnum.token:
        return StorageUtils.jwtToken.get();
      case ITokenEnum.refreshToken:
        return StorageUtils.refreshToken.get();
      case ITokenEnum.anonymousToken:
        return StorageUtils.anonymousToken.get();
      default:
        return null;
    }
  },
  clear: () => {
    StorageUtils.jwtToken.clear();
    StorageUtils.refreshToken.clear();
    StorageUtils.anonymousToken.clear();
  }
};

export default TokenStorage;
