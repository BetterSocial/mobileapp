import AsyncStorage from '@react-native-async-storage/async-storage';
import { KEY_ACCESS_TOKEN, KEY_REFRESH_TOKEN } from '../constants';

export const setToken = async (value) => {
  try {
    await AsyncStorage.setItem('tkn-getstream', value);
  } catch (e) {
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
  }
};

const getAccessToken = async () => {
  const accessToken = await AsyncStorage.getItem(KEY_ACCESS_TOKEN);
  return JSON.parse(accessToken);
};
const clearLocalStorege = async () => await AsyncStorage.clear();

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
  removeAccessToken,
  setRefreshToken,
  getRefreshToken,
  clearLocalStorege,
};
