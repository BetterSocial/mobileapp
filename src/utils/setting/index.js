import AsyncStorage from '@react-native-async-storage/async-storage';

const KEY_LOCATION_ID = 'KEY_LOCATION_ID';
const KEY_PRIVACY_ID = 'KEY_PRIVACY_ID';
const KEY_DURATION = 'KEY_DURATION';

const setLocationId = async (locatioId) => {
  await AsyncStorage.setItem(KEY_LOCATION_ID, locatioId);
};

const getLocationId = async () => {
  return await AsyncStorage.getItem(KEY_LOCATION_ID);
};

const setPrivacyId = async (privacyId) => {
  await AsyncStorage.setItem(KEY_PRIVACY_ID, privacyId);
};

const getPrivacyId = async () => {
  return AsyncStorage.getItem(KEY_PRIVACY_ID);
};

const setDurationId = async (id) => {
  await AsyncStorage.setItem(KEY_DURATION, id);
};

const getDurationId = async () => {
  return AsyncStorage.getItem(KEY_DURATION);
};

export {
  setLocationId,
  getLocationId,
  setPrivacyId,
  getPrivacyId,
  setDurationId,
  getDurationId,
};
