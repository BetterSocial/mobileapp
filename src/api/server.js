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

export const post = ({url, params}) => {
  return new Promise((resolve, reject) => {
    api
      .post(url, params)
      .then((res) => {
        resolve(res);
      })
      .catch((err) => {
        reject(err);
      });
  });
};
