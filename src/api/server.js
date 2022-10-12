import api from "../service/config";

export const get = ({url}) => new Promise((resolve, reject) => {
    api
      .get(url)
      .then((res) => {
        resolve(res);
      })
      .catch((err) => {
        reject(err);
      });
  });

export const post = ({url, params}) => new Promise((resolve, reject) => {
    api
      .post(url, params)
      .then((res) => {
        resolve(res);
      })
      .catch((err) => {
        reject(err);
      });
  });
