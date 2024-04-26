import api from './config';

export const uploadFile = async (base64String = '') =>
  new Promise((resolve, reject) => {
    api
      .post('/file/upload', {picture: base64String})
      .then((res) => {
        resolve(res.data);
      })
      .catch((err) => {
        reject(err);
      });
  });

export const uploadPhoto = async (formData) => {
  const result = await api.post('/upload/photo', formData, {
    headers: {
      'Content-Type': 'multipart/form-data'
    },
    testing: 'test'
  });

  if (result.data) {
    return result.data;
  }

  return null;
};

export const uploadPhotoWithoutAuth = async (formData) => {
  try {
    const result = await api.post('/upload/photo-without-auth', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      },
      testing: 'test'
    });

    return Promise.resolve(result.data);
  } catch (e) {
    return Promise.reject(e);
  }
};
