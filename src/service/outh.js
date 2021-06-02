import crashlytics from '@react-native-firebase/crashlytics';
import {CLIENT_ID, CLIENT_SECRET} from '@env';
export const checkToken = (token) => {
  return fetch('https://core.human-id.org/v0.0.3/server/users/exchange', {
    method: 'POST', // or 'PUT'
    headers: {
      'Content-Type': 'application/json',
      'client-id': CLIENT_ID,
      'client-secret': CLIENT_SECRET,
    },
    body: JSON.stringify({exchangeToken: token}),
  })
    .then((response) => response.json())
    .then((data) => {
      return data;
    })
    .catch((error) => {
      crashlytics().recordError(new Error(error));
      console.error('Error:', error);
    });
};
