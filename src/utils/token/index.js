import AsyncStorage from '@react-native-async-storage/async-storage';
import {KEY_ACCESS_TOKEN, KEY_REFRESH_TOKEN} from '../constants';
export const setToken = async (value) => {
  try {
    await AsyncStorage.setItem('tkn-getstream', value);
  } catch (e) {
    console.log(e);
  }
};
export const getToken = async () => {
  try {
    const value = await AsyncStorage.getItem('tkn-getstream');
    return value;
  } catch (e) {
    console.log(e);
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
    console.log(e);
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
  return await AsyncStorage.getItem(KEY_ACCESS_TOKEN);
};
const clearAccessToken = async () => {
  return await AsyncStorage.removeItem(KEY_ACCESS_TOKEN);
};

const setAccessToken = async (token) => {
  await AsyncStorage.setItem(KEY_ACCESS_TOKEN, token);
};

const setRefreshToken = async (value) => {
  try {
    await AsyncStorage.setItem(KEY_REFRESH_TOKEN, value);
  } catch (e) {
    console.log(e);
  }
};

const getRefreshToken = async () => {
  try {
    return await AsyncStorage.getItem(KEY_REFRESH_TOKEN);
  } catch (e) {
    console.log(e);
  }
};

export {
  getAccessToken,
  setAccessToken,
  setRefreshToken,
  getRefreshToken,
  clearAccessToken,
};
