import AsyncStorage from '@react-native-async-storage/async-storage';
export const setToken = async (value) => {
  try {
    await AsyncStorage.setItem('t-ping', value);
  } catch (e) {
    console.log(e);
  }
}
export const getToken = async () => {
  try {
    const value = await AsyncStorage.getItem('t-ping');
    return value;
  } catch (e) {
    console.log(e);
    // error reading value
    return null;
  }
}
