import asyncStorage from '@react-native-async-storage/async-storage';

export const getTargetUserIdList = async () => {
  const targetUserIdList = await asyncStorage.getItem('targetUserIdList');
  return JSON.parse(targetUserIdList);
};

export const setTargetUserIdList = async (value) => {
  await asyncStorage.setItem('targetUserIdList', JSON.stringify(value));
};

export const removeTargetUserIdList = async () => {
  await asyncStorage.setItem('targetUserIdList');
};
