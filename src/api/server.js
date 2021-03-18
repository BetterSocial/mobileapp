import api from './api';

export const get = ({url}) => {
  return new Promise((resolve, reject) => {
    api
      .get(url)
      .then((res) => {
        resolve(res);
      })
      .catch((err) => {
        reject(err);
      });
  });
};
