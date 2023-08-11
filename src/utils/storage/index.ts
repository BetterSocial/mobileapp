/* eslint-disable no-shadow */
import {MMKV} from 'react-native-mmkv';

/**
 * TYPES
 */
enum StorageKeysEnum {
  OnboardingPassword = 'onboardingPassword',
  TopicPages = 'topicPages'
}

interface IStorage {
  get: () => string;
  set: (value: string) => void;
  setForKey: (key: string, value: string) => void;
  getForKey: (key: string) => string;
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

  const setForKey = (key: string, value: string) => {
    MMKVStorage.set(`${keyName}_${key}`, value);
  };

  const getForKey = (key: string) => {
    return MMKVStorage.getString(`${keyName}_${key}`);
  };

  const clear = () => {
    MMKVStorage.delete(keyName);
  };

  return {
    get,
    set,
    setForKey,
    getForKey,
    clear
  };
};

const StorageUtils = {
  onboardingPassword: storageBuilder(StorageKeysEnum.OnboardingPassword),
  topicPages: storageBuilder(StorageKeysEnum.TopicPages)
};

export interface IStorageUtils {
  onboardingPassword: Storage;
  topicPages: Storage;
}
export default StorageUtils;
