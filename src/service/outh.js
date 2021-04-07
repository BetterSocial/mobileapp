import crashlytics from '@react-native-firebase/crashlytics';
export const checkToken = (token) => {
  return fetch('https://core.human-id.org/v0.0.3/server/users/exchange', {
    method: 'POST', // or 'PUT'
    headers: {
      'Content-Type': 'application/json',
      'client-id': 'SERVER_GZXRP7RJAUL11ZZPN31P3Y',
      'client-secret':
        'zIEj7ZB5wbEm99CEs0ydI3L9AVYkkglIejDnqhu9UtoF3YNtPFCETgWm7qXzEq0e',
    },
    body: JSON.stringify({exchangeToken: token}),
  })
    .then((response) => response.json())
    .then((data) => {
      return data;
    })
    .catch((error) => {
      crashlytics().recordError(error);
      console.error('Error:', error);
    });
};
