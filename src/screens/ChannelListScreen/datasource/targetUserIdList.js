import asyncStorage from '@react-native-async-storage/async-storage';

export const getTargetUserIdList = async () => {
  const targetUserIdList = await asyncStorage.getItem('targetUserIdList');
  return JSON.parse(targetUserIdList);
};

export const setTargetUserIdList = async (value) => {
  const targetUserIdList = await asyncStorage.setItem('targetUserIdList', value);
  return JSON.stringify(targetUserIdList);
};

export const removeTargetUserIdList = async () => {
  const targetUserIdList = await asyncStorage.setItem('targetUserIdList');
  return JSON.stringify(targetUserIdList);
};
