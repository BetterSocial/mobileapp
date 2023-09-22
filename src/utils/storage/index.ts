/* eslint-disable no-shadow */
import {MMKV} from 'react-native-mmkv';

/**
 * TYPES
 */
enum StorageKeysEnum {
  OnboardingPassword = 'onboardingPassword',
  TopicPages = 'topicPages',
  RefreshToken = 'refreshToken',
  JwtToken = 'jwtToken',
  AnonymousToken = 'anonymousToken',
  FeedPages = 'feedpages',
  MyFeeds = 'myfeeds',
  MyAnonymousFeed = 'myanonymousfeed',
  OtherProfileFeed = 'otherprofilefeed'
}

interface IStorage {
  get: () => string;
  set: (value: string) => void;
  clear: () => void;
  setForKey: (key: string, value: string) => void;
  getForKey: (key: string) => string;
  clearForKey: (key: string) => void;
  clearAll: () => void;
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

  const clearForKey = (key: string) => {
    MMKVStorage.delete(`${keyName}_${key}`);
  };

  const clearAll = () => {
    MMKVStorage.clearAll();
  };

  return {
    get,
    set,
    clear,
    setForKey,
    getForKey,
    clearForKey,
    clearAll
  };
};

const StorageUtils = {
  onboardingPassword: storageBuilder(StorageKeysEnum.OnboardingPassword),
  topicPages: storageBuilder(StorageKeysEnum.TopicPages),
  refreshToken: storageBuilder(StorageKeysEnum.RefreshToken),
  jwtToken: storageBuilder(StorageKeysEnum.JwtToken),
  anonymousToken: storageBuilder(StorageKeysEnum.AnonymousToken),
  feedPages: storageBuilder(StorageKeysEnum.FeedPages),
  myFeeds: storageBuilder(StorageKeysEnum.MyFeeds),
  myAnonymousFeed: storageBuilder(StorageKeysEnum.MyAnonymousFeed),
  otherProfileFeed: storageBuilder(StorageKeysEnum.OtherProfileFeed)
};

export interface IStorageUtils {
  onboardingPassword: Storage;
  topicPages: Storage;
  refreshToken: Storage;
  jwtToken: Storage;
  anonymousToken: Storage;
}
export default StorageUtils;
