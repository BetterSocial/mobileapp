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

const getAccessToken = async () => await AsyncStorage.getItem(KEY_ACCESS_TOKEN);
const clearLocalStorege = async () => await AsyncStorage.clear();

const setAccessToken = async (token) => {
  await AsyncStorage.setItem(KEY_ACCESS_TOKEN, token);
};

const setRefreshToken = async (value) => {
  try {
    await AsyncStorage.setItem(KEY_REFRESH_TOKEN, value);
  } catch (e) {
  }
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
  setRefreshToken,
  getRefreshToken,
  clearLocalStorege,
};
