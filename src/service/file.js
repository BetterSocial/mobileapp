import api from './config';

export const uploadFile = async (base64String = '') => {
  console.log('asdasdadad');
  return new Promise((resolve, reject) => {
    api
      .post('/file/upload', {picture: base64String})
      .then((res) => {
        resolve(res.data);
      })
      .catch((err) => {
        reject(err);
      });
  });
};
