import AsyncStorage from '@react-native-async-storage/async-storage';

export const getToken = async () => {
  return new Promise((resolve, reject) => {
    AsyncStorage.getItem('userToken')
      .then((val) => {
        resolve(val);
      })
      .catch((err) => {
        reject(err);
      });
  });
};
