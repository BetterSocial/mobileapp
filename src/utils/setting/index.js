import AsyncStorage from '@react-native-async-storage/async-storage';

const KEY_LOCATION_ID = 'KEY_LOCATION_ID';
const KEY_PRIVACY_ID = 'KEY_PRIVACY_ID';
const KEY_DURATION = 'KEY_DURATION';

const converStringToInt = (str) => parseInt(str, 10);

const setLocationId = async (locatioId) => {
  await AsyncStorage.setItem(KEY_LOCATION_ID, locatioId);
};

const getLocationId = async () => {
  const res = await AsyncStorage.getItem(KEY_LOCATION_ID);
  return converStringToInt(res);
};

const setPrivacyId = async (privacyId) => {
  await AsyncStorage.setItem(KEY_PRIVACY_ID, privacyId);
};

const getPrivacyId = async () => {
  const res = await AsyncStorage.getItem(KEY_PRIVACY_ID);
  return converStringToInt(res);
};

const setDurationId = async (id) => {
  await AsyncStorage.setItem(KEY_DURATION, id);
};

const getDurationId = async () => {
  const res = await AsyncStorage.getItem(KEY_DURATION);
  return converStringToInt(res);
};

export {setLocationId, getLocationId, setPrivacyId, getPrivacyId, setDurationId, getDurationId};
