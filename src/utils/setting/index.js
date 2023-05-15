import AsyncStorage from '@react-native-async-storage/async-storage';

const KEY_LOCATION_ID = 'KEY_LOCATION_ID';
const KEY_PRIVACY_ID = 'KEY_PRIVACY_ID';
const KEY_DURATION = 'KEY_DURATION';

const convertStringToInt = (str) => parseInt(str, 10);
const convertStringToIntNullCheck = (str) => {
  if (!str) return null;
  return convertStringToInt(str);
};

const setLocationId = async (locatioId) => {
  await AsyncStorage.setItem(KEY_LOCATION_ID, locatioId);
};

const getLocationId = async () => {
  const res = await AsyncStorage.getItem(KEY_LOCATION_ID);
  return convertStringToInt(res);
};

const setPrivacyId = async (privacyId) => {
  await AsyncStorage.setItem(KEY_PRIVACY_ID, privacyId);
};

const getPrivacyId = async () => {
  const res = await AsyncStorage.getItem(KEY_PRIVACY_ID);
  return convertStringToInt(res);
};

const setDurationId = async (id) => {
  await AsyncStorage.setItem(KEY_DURATION, id);
};

const getDurationId = async () => {
  const res = await AsyncStorage.getItem(KEY_DURATION);
  return convertStringToIntNullCheck(res);
};

export {setLocationId, getLocationId, setPrivacyId, getPrivacyId, setDurationId, getDurationId};
