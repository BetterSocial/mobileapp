import api from './config';
import api2 from '../api/api';

export const getMyProfile = async (userId) => {
  return new Promise((resolve, reject) => {
    api
      .get(`/profiles/get-my-profile/${userId}`)
      .then((res) => {
        resolve(res.data);
      })
      .catch((err) => {
        console.log('ERR');
        console.log(err);
        reject(err);
      });
  });
};

export const getPost = async (userId) => {
  return new Promise((resolve, reject) => {
    api
      .get('/activity/feeds')
      .then((res) => {
        resolve(res.data);
      })
      .catch((err) => {
        reject(err);
      });
  });
};

export const getOtherProfile = async (userId, otherId) => {
  return new Promise((resolve, reject) => {
    api
      .get(`/profiles/get-other-profile/${userId}?other_user_id=${otherId}`)
      .then((res) => {
        resolve(res.data);
      })
      .catch((err) => {
        reject(err);
      });
  });
};

export const changeRealName = async (userId, real_name) => {
  return new Promise((resolve, reject) => {
    api
      .post(`/profiles/changes-real-name/${userId}`, {
        real_name,
      })
      .then((res) => {
        resolve(res.data);
      })
      .catch((err) => {
        reject(err);
      });
  });
};

export const getFollowing = async (userId, real_name) => {
  return new Promise((resolve, reject) => {
    api
      .get(`/profiles/following/${userId}`)
      .then((res) => {
        resolve(res.data);
      })
      .catch((err) => {
        reject(err);
      });
  });
};

export const setUnFollow = async (data) => {
  return new Promise((resolve, reject) => {
    api
      .post('/profiles/unset-following', data)
      .then((res) => {
        resolve(res.data);
      })
      .catch((err) => {
        reject(err);
      });
  });
};

export const setFollow = async (data) => {
  return new Promise((resolve, reject) => {
    api
      .post('/profiles/set-following', data)
      .then((res) => {
        resolve(res.data);
      })
      .catch((err) => {
        reject(err);
      });
  });
};

export const updateImageProfile = async (userID, data) => {
  return new Promise((resolve, reject) => {
    api
      .post(`/profiles/changes-image/${userID}`, data)
      .then((res) => {
        resolve(res.data);
      })
      .catch((err) => {
        reject(err);
      });
  });
};

export const removeImageProfile = async (userID) => {
  return new Promise((resolve, reject) => {
    api
      .delete(`/profiles/remove-image/${userID}`)
      .then((res) => {
        resolve(res.data);
      })
      .catch((err) => {
        reject(err);
      });
  });
};

export const updateBioProfile = async (userID, data) => {
  return new Promise((resolve, reject) => {
    api
      .post(`/profiles/update-bio/${userID}`, data)
      .then((res) => {
        resolve(res.data);
      })
      .catch((err) => {
        reject(err);
      });
  });
};

export const getProfileByUsername = async (username) => {
  console.log('username ' + username);
  return new Promise((resolve, reject) => {
    if (!username) {
      return reject();
    }

    api
      .get(`/profiles/get-profile/${username}`)
      .then((res) => resolve(res.data))
      .catch((err) => {
        console.log(err);
        reject(err);
      });
  });
};
