// import AsyncStorage from '@react-native-async-storage/async-storage';
import AsyncStorage from '@react-native-community/async-storage';
import {getAccessToken} from '../data/local/accessToken';

export const getToken = async () => {
  return new Promise((resolve, reject) => {
    getAccessToken()
      .then((val) => {
        resolve(val);
      })
      .catch((err) => {
        reject(err);
      });
  });
};
