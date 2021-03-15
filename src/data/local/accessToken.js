import AsyncStorage from '@react-native-async-storage/async-storage';
export const getToken = async () => {
  try {
    const value = await AsyncStorage.getItem('t-ping');
    return value;
  } catch (e) {
    console.log(e);
    // error reading value
    return null;
  }
};
