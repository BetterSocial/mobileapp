/* eslint-disable no-shadow */
import {MMKV} from 'react-native-mmkv';

/**
 * TYPES
 */
enum StorageKeysEnum {
  OnboardingPassword = 'onboardingPassword'
}

interface IStorage {
  get: () => string;
  set: (value: string) => void;
  clear: () => void;
}
/**
 * TYPES
 */

const MMKVStorage = new MMKV();

const storageBuilder = (keyName: StorageKeysEnum): IStorage => {
  const get = () => {
    return MMKVStorage.getString(keyName);
  };

  const set = (value: string) => {
    MMKVStorage.set(keyName, value);
  };

  const clear = () => {
    MMKVStorage.delete(keyName);
  };

  return {
    get,
    set,
    clear
  };
};

const StorageUtils = {
  onboardingPassword: storageBuilder(StorageKeysEnum.OnboardingPassword)
};

export interface IStorageUtils {
  onboardingPassword: Storage;
}
export default StorageUtils;
