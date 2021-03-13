import AsyncStorage from '@react-native-async-storage/async-storage';

export const setToken = async (value) => {
  try {
    await AsyncStorage.setItem('t-ping', value);
  } catch (e) {
    console.log(e);
  }
};
