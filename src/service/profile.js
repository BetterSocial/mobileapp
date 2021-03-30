import api from './config';

export const getMyProfile = async (userId) => {
  return new Promise((resolve, reject) => {
    api
      .get(`/profiles/get-my-profile/${userId}`)
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
      .post(`/profiles/unset-following`, data)
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
      .post(`/profiles/set-following`, data)
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