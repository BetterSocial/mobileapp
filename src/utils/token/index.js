import AsyncStorage from '@react-native-async-storage/async-storage';

import {KEY_ACCESS_TOKEN, KEY_ANONYMOUS_TOKEN, KEY_REFRESH_TOKEN} from '../constants';

export const setToken = async (value) => {
  try {
    await AsyncStorage.setItem('tkn-getstream', value);
  } catch (e) {
    console.log(e);
  }
};

const setAnonymousToken = async (value) => {
  try {
    await AsyncStorage.setItem(KEY_ANONYMOUS_TOKEN, value);
  } catch (e) {
    console.log(e);
  }
};

export const getToken = async () => {
  try {
    const value = await AsyncStorage.getItem('tkn-getstream');
    return value;
  } catch (e) {
    return null;
  }
};
export const setUserId = async (value) => {
  try {
    await AsyncStorage.setItem('userId', value);
  } catch (e) {
    console.log(e);
  }
};
export const getUserId = async () => {
  try {
    const value = await AsyncStorage.getItem('userId');
    return value;
  } catch (e) {
    return null;
  }
};

export const removeLocalStorege = async (value) => {
  try {
    await AsyncStorage.removeItem(value);
  } catch (e) {
    console.log(e);
  }
};

const getAccessToken = async () => {
  const accessToken = await AsyncStorage.getItem(KEY_ACCESS_TOKEN);
  return JSON.parse(accessToken);
};

const getAnonymousToken = async () => {
  try {
    const value = await AsyncStorage.getItem(KEY_ANONYMOUS_TOKEN);
    return value;
  } catch (e) {
    console.log(e);
    return null;
  }
};

const clearLocalStorege = async () => Promise.resolve(AsyncStorage.clear());

const setAccessToken = async (token) => {
  const value = JSON.stringify(token);
  await AsyncStorage.setItem(KEY_ACCESS_TOKEN, value);
};

const removeAccessToken = () => {
  AsyncStorage.removeItem('userId');
};

const setRefreshToken = async (value) => {
  await AsyncStorage.setItem(KEY_REFRESH_TOKEN, JSON.stringify(value));
};

const getRefreshToken = async () => {
  // eslint-disable-next-line no-useless-catch
  try {
    return await AsyncStorage.getItem(KEY_REFRESH_TOKEN);
  } catch (e) {
    throw e;
  }
};

export {
  getAccessToken,
  setAccessToken,
  setAnonymousToken,
  getAnonymousToken,
  removeAccessToken,
  setRefreshToken,
  getRefreshToken,
  clearLocalStorege
};
