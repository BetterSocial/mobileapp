import AsyncStorage from '@react-native-async-storage/async-storage';

const CACHE_NAME = 'cache';
export const saveToCache = (cacheKey, jsonData) => {
  if (jsonData && cacheKey && typeof jsonData === 'object' && typeof cacheKey === 'string') {
    AsyncStorage.getItem(CACHE_NAME, (err, result) => {
      if (result && typeof result === 'string') {
        let parseResult = JSON.parse(result);
        parseResult = {...parseResult, [cacheKey]: jsonData};
        AsyncStorage.setItem(CACHE_NAME, JSON.stringify(parseResult));
      } else {
        const dataSave = {
          [cacheKey]: jsonData
        };
        AsyncStorage.setItem(CACHE_NAME, JSON.stringify(dataSave));
      }
    });
  }
};

export const getSpecificCache = (cacheKey, callback) => {
  AsyncStorage.getItem(CACHE_NAME, (error, result) => {
    if (result && typeof result === 'string') {
      const newResult = JSON.parse(result);
      if (newResult[cacheKey]) {
        callback(newResult[cacheKey]);
      } else {
        callback(null);
      }
    } else {
      callback(null);
    }
  });
};

export const removeAllCache = () => {
  AsyncStorage.clear();
};
