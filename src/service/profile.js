import api from './config';
import {followClient} from './chat';

export const getMyProfile = async () =>
  new Promise((resolve, reject) => {
    api
      .get('/profiles/get-my-profile')
      .then((res) => {
        resolve(res.data);
      })
      .catch((err) => {
        if (__DEV__) {
          console.log('get my profile: ', err);
        }
        reject(err);
      });
  });

export const getPost = async () =>
  new Promise((resolve, reject) => {
    api
      .get('/activity/feeds')
      .then((res) => {
        resolve(res.data);
      })
      .catch((err) => {
        reject(err);
      });
  });

export const getOtherProfile = async (username) =>
  new Promise((resolve, reject) => {
    api
      .get(`/profiles/get-other-profile-by-username/${username}`)
      .then((res) => {
        resolve(res.data);
      })
      .catch((err) => {
        reject(err);
      });
  });

export const checkUserBlock = (data) =>
  new Promise((resolve, reject) => {
    api
      .post('/users/check-block-status', data)
      .then((response) => {
        resolve(response);
      })
      .catch((err) => {
        reject(err);
      });
  });

export const changeRealName = async (real_name) =>
  new Promise((resolve, reject) => {
    api
      .post('/profiles/changes-real-name', {
        real_name
      })
      .then((res) => {
        resolve(res.data);
      })
      .catch((err) => {
        reject(err);
      });
  });

export const getFollowing = async () =>
  new Promise((resolve, reject) => {
    api
      .get('/profiles/following/')
      .then((res) => {
        resolve(res.data);
      })
      .catch((err) => {
        reject(err);
      });
  });
export const getFollower = async (query) =>
  new Promise((resolve, reject) => {
    api
      .get(`/profiles/followers/?q=${encodeURIComponent(query)}`)
      .then((res) => {
        resolve(res.data);
      })
      .catch((err) => {
        reject(err);
      });
  });

export const setUnFollow = async (data) =>
  new Promise((resolve, reject) => {
    api
      .post('/profiles/unfollow-user-v3', data)
      .then((res) => {
        resolve(res.data);
      })
      .catch((err) => {
        reject(err);
      });
  });

export const followUser = async (data) =>
  new Promise((resolve, reject) => {
    api
      .post('/profiles/follow-user-v3', {
        ...data,
        with_system_message: true
      })
      .then((res) => {
        resolve(res.data);
      })
      .catch((err) => {
        reject(err);
      });
  });

export const followUserAnon = async (data) =>
  new Promise((resolve, reject) => {
    api
      .post('/profiles/follow-anonymous-user', data)
      .then((res) => {
        resolve(res.data);
      })
      .catch((err) => {
        reject(err);
      });
  });

export const unfollowUserAnon = async (data) =>
  new Promise((resolve, reject) => {
    api
      .post('/profiles/unfollow-anonymous-user', data)
      .then((res) => {
        resolve(res.data);
      })
      .catch((err) => {
        reject(err);
      });
  });

export const setFollow = async (data) => {
  return new Promise((resolve, reject) => {
    api
      .post('/profiles/follow-user-v3', {
        ...data,
        with_system_message: true
      })
      .then((res) => {
        resolve(res.data);
      })
      .catch((err) => {
        reject(err);
      });
  });
};

export const updateImageProfile = async (data) =>
  new Promise((resolve, reject) => {
    api
      .post('/profiles/changes-image', data)
      .then((res) => {
        resolve(res.data);
      })
      .catch((err) => {
        reject(err);
      });
  });

export const removeImageProfile = async () =>
  new Promise((resolve, reject) => {
    api
      .delete('/profiles/remove-image')
      .then((res) => {
        resolve(res.data);
      })
      .catch((err) => {
        reject(err);
      });
  });

export const updateBioProfile = async (data) =>
  new Promise((resolve, reject) => {
    api
      .post('/profiles/update-bio', data)
      .then((res) => {
        resolve(res.data);
      })
      .catch((err) => {
        reject(err);
      });
  });

export const getProfileByUsername = async (username) => {
  if (__DEV__) {
    console.log(`username ${username}`);
  }
  if (!username) {
    return Promise.reject();
  }

  return new Promise((resolve, reject) => {
    api
      .get(`/profiles/get-profile/${username}`)
      .then((res) => resolve(res.data))
      .catch((err) => {
        console.log('err');
        console.log(err);
        return reject(err);
      });
  });
};

export const getSelfFeedsInProfile = async (offset = 0) =>
  new Promise((resolve, reject) => {
    api
      .get(`/profiles/self-feeds?offset=${offset}`)
      .then((res) => resolve(res.data))
      .catch((err) => {
        reject(err);
      });
  });

export const getOtherFeedsInProfile = async (userId, offset = 0) =>
  new Promise((resolve, reject) => {
    api
      .get(`/profiles/feeds/${userId}?offset=${offset}`)
      .then((res) => resolve(res.data))
      .catch((err) => {
        reject(err);
      });
  });

export const profileSettingsDMpermission = async (allowAnonDm, onlyReceivedDmFromUserFollowing) =>
  new Promise((resolve, reject) => {
    api
      .patch('profiles/settings', {
        allowAnonDm,
        onlyReceivedDmFromUserFollowing
      })
      .then((res) => {
        resolve(res.data);
      })
      .catch((err) => {
        reject(err);
      });
  });
