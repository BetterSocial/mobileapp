import api from './config';

export const getGifFeatured = async () =>
  new Promise((resolve, reject) => {
    api
      .get('/chat/gif/featured')
      .then((res) => {
        resolve(res.data);
      })
      .catch((err) => {
        if (__DEV__) {
          console.log('get gif featured: ', err);
        }
        reject(err);
      });
  });
