import messaging from '@react-native-firebase/messaging';
export const setMessage = async (client) => {
  console.log(`processing`);
  const token = await messaging().getToken();
  console.log(`token : ${token}`);
  await client.addDevice(token, 'firebase');

  messaging().onTokenRefresh(async (newToken) => {
    console.log(`new Token : ${newToken}`);
    await client.addDevice(newToken, 'firebase');
  });
};
