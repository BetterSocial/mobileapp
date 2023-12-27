import api from './config';

export const getGifFeatured = async (search) =>
  new Promise((resolve, reject) => {
    api
      .get(search?.trim() !== '' ? `/chat/gif/search?q=${search.trim()}` : '/chat/gif/featured')
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
