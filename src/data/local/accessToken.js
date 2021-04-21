import AsyncStorage from '@react-native-community/async-storage';

const KEY_ACCESS_TOKEN = 'access_token';
const KEY_REFRESH_TOKEN = 'refresh_token';

export const setToken = async (value) => {
  try {
    await AsyncStorage.setItem('t-ping', value);
  } catch (e) {
    console.log(e);
  }
};
export const getToken = async () => {
  try {
    const value = await AsyncStorage.getItem('t-ping');
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

const setAccessToken = async (token) => {
  await AsyncStorage.setItem(KEY_ACCESS_TOKEN, token);
};

const setRefershToken = async (value) => {
  try {
    await AsyncStorage.setItem(KEY_REFRESH_TOKEN, value);
  } catch (e) {
    console.log(e);
  }
};

const getRefreshToken = async () => {
  try {
    await AsyncStorage.getItem(KEY_REFRESH_TOKEN);
  } catch (e) {
    console.log(e);
  }
};

export {getAccessToken, setAccessToken, setRefershToken, getRefreshToken};
