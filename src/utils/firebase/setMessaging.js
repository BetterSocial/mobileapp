import messaging from '@react-native-firebase/messaging';

export const setMessage = async (client) => {
  const token = await messaging().getToken();
  const sendToken = await client.addDevice(token, 'firebase')
  messaging().onTokenRefresh(async (newToken) => {
    await client.addDevice(newToken, 'firebase');
  });
};
