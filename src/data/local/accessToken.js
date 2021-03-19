import AsyncStorage from '@react-native-async-storage/async-storage';
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
