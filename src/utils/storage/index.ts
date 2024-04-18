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
  OtherProfileFeed = 'otherprofilefeed',
  ProfileData = 'profiledata',
  OtherProfileData = 'otherprofiledata',
  LastPromptNotification = 'lastPromptNotification',
  LastSelectedMenu = 'lastSelectedMenu',
  BlockedStatus = 'blockedStatus',
  BlockingStatus = 'blockingStatus',
  IncognitoCreatePostFirstTime = 'incognitoCreatePostFirstTime',
  FetchInitialData = 'fetchInitialData',
  ChannelSignedTimeStamps = 'channelSignedTimeStamps',
  ChannelAnonTimeStamps = 'channelAnonTimeStamps',
  ChannelDetailTimeStamps = 'channelDetailTimeStamps',
  FeedChatTimeStamps = 'feedChatTimeStamps',
  AnonymousNotificationTimeStamps = 'anynoymousNotificationTimeStamp',
  SignedNotificationTimeStamp = 'signedNotificationTimeStamp',
  TotalAnonChannels = 'totalAnonChannels'
}

interface IStorage {
  get: () => string | undefined;
  set: (value: string) => void;
  clear: () => void;
  setForKey: (key: string, value: string) => void;
  getForKey: (key: string) => string | undefined;
  clearForKey: (key: string) => void;
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

  return {
    get,
    set,
    clear,
    setForKey,
    getForKey,
    clearForKey
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
  otherProfileFeed: storageBuilder(StorageKeysEnum.OtherProfileFeed),
  profileData: storageBuilder(StorageKeysEnum.ProfileData),
  otherProfileData: storageBuilder(StorageKeysEnum.OtherProfileData),
  lastPromptNotification: storageBuilder(StorageKeysEnum.LastPromptNotification),
  lastSelectedMenu: storageBuilder(StorageKeysEnum.LastSelectedMenu),
  blockingStatus: storageBuilder(StorageKeysEnum.BlockingStatus),
  blockedStatus: storageBuilder(StorageKeysEnum.BlockedStatus),
  incognitoCreatePostFirstTime: storageBuilder(StorageKeysEnum.IncognitoCreatePostFirstTime),
  fetchInitialData: storageBuilder(StorageKeysEnum.FetchInitialData),
  channelSignedTimeStamps: storageBuilder(StorageKeysEnum.ChannelSignedTimeStamps),
  channelAnonTimeStamps: storageBuilder(StorageKeysEnum.ChannelAnonTimeStamps),
  channelDetailTimeStamps: storageBuilder(StorageKeysEnum.ChannelDetailTimeStamps),
  feedChatTimeStamps: storageBuilder(StorageKeysEnum.FeedChatTimeStamps),
  anonymousNotificationTimeStamp: storageBuilder(StorageKeysEnum.AnonymousNotificationTimeStamps),
  signedNotificationTimeStamp: storageBuilder(StorageKeysEnum.SignedNotificationTimeStamp),
  totalAnonChannels: storageBuilder(StorageKeysEnum.TotalAnonChannels),
  clearAll: () => MMKVStorage.clearAll()
};

const clearAll = () => {
  const onboardingPassword = StorageUtils.onboardingPassword.get();
  MMKVStorage.clearAll();
  StorageUtils.onboardingPassword.set(onboardingPassword || '');
};

StorageUtils.clearAll = clearAll;

export interface IStorageUtils {
  onboardingPassword: Storage;
  topicPages: Storage;
  refreshToken: Storage;
  jwtToken: Storage;
  anonymousToken: Storage;
  lastPromptNotification: Storage;
  lastSelectedMenu: Storage;
  blockingStatus: Storage;
  blockedStatus: Storage;
  incognitoCreatePostFirstTime: Storage;
  fetchInitialData: Storage;
  channelSignedTimeStamps: Storage;
  channelAnonTimeStamps: Storage;
  channelDetailTimeStamps: Storage;
  feedChatTimeStamps: Storage;
  anonymousNotificationTimeStamps: Storage;
  signedNotificationTimeStamp: Storage;
  clearAll: () => void;
}
export default StorageUtils;
