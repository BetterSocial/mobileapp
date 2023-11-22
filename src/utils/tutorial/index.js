import AsyncStorage from '@react-native-async-storage/async-storage';
import StringConstant from '../string/StringConstant';
import {TUTOR_CREATE_POST_ANON, TUTOR_POST_ANON} from '../constants';

// eslint-disable-next-line consistent-return
export const getStorageKey = async (name) => {
  switch (name) {
    case StringConstant.tutorialAnonymousPostTitle:
      return TUTOR_POST_ANON;
    case StringConstant.tutorialCreateAnonymousPostTitle:
      return TUTOR_CREATE_POST_ANON;
    default:
  }
};

export const setFinishedTutor = async (key) => {
  // await AsyncStorage.setItem(key, true);
};

export const getFinishedTutor = async (key) => {
  const res = await AsyncStorage.getItem(key);
  return Boolean(res);
};

export const handleTutorialFinished = async (name) => {
  const key = await getStorageKey(name);
  if (key) {
    setFinishedTutor(key);
  }
};
