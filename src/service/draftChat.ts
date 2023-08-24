import {MMKV} from 'react-native-mmkv';

export const mmkvStorage = new MMKV();

export const getDraftChatStorageKey = (members: any) => {
  const userIds = Object.keys(members);
  return `draftedChat_${userIds.join('_')}`;
};

export const saveDraftChat = (key: string, messages: string) => {
  mmkvStorage.set(key, messages);
};
export const getDraftChat = (key: string) => {
  return mmkvStorage.getString(key);
};
export const deleteDraftChat = (key: string) => {
  mmkvStorage.delete(key);
};
