// import AsyncStorage from '@react-native-async-storage/async-storage';
import AsyncStorage from '@react-native-community/async-storage'

export const getToken = async () => {
  return new Promise((resolve, reject) => {
    AsyncStorage.getItem('tkn-getstream')
      .then((val) => {
        resolve(val);
      })
      .catch((err) => {
        reject(err);
      });
  });
};
