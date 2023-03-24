import { createChannel } from './chat';
import api from './config';

export const getMyProfile = async (userId) => new Promise((resolve, reject) => {
  api
    .get(`/profiles/get-my-profile/${userId}`)
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

export const getPost = async (userId) => new Promise((resolve, reject) => {
  api
    .get('/activity/feeds')
    .then((res) => {
      resolve(res.data);
    })
    .catch((err) => {
      reject(err);
    });
});

export const getOtherProfile = async (username) => new Promise((resolve, reject) => {
  api
    .get(`/profiles/get-other-profile-by-username/${username}`)
    .then((res) => {
      resolve(res.data);
    })
    .catch((err) => {
      reject(err);
    });
});

export const checkUserBlock = (data) => new Promise((resolve, reject) => {
  api
    .post('/users/check-block-status', data)
    .then((response) => {
      resolve(response);
    })
    .catch((err) => {
      reject(err);
    });
});

export const changeRealName = async (userId, real_name) => new Promise((resolve, reject) => {
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

export const getFollowing = async (userId, real_name) => new Promise((resolve, reject) => {
  api
    .get(`/profiles/following/${userId}`)
    .then((res) => {
      resolve(res.data);
    })
    .catch((err) => {
      reject(err);
    });
});

export const setUnFollow = async (data) => new Promise((resolve, reject) => {
  api
    .post('/profiles/unset-following', data)
    .then((res) => {
      resolve(res.data);
    })
    .catch((err) => {
      reject(err);
    });
});

export const setFollow = async (data) => new Promise( async (resolve, reject) => {
  const textTargetUser= `${data.username_follower} started following you. Send them a message now`;
  const textOwnUser = `You started following ${data.username_followed}. Send them a message now.`;
  const chat = await createChannel('messaging', [data.user_id_followed, data.user_id_follower], `${data.username_followed},${data.username_follower}`)
  chat.update({
    name: `${data.username_followed},${data.username_follower}`
  }, {text: textTargetUser,
    system_user:data.user_id_follower,
    is_from_prepopulated: true,
    other_text: textOwnUser}, {skip_push: true})
  api
    .post('/profiles/set-following', data)
    .then((res) => {
      resolve(res.data);
    })
    .catch((err) => {
      reject(err);
    });
});

export const updateImageProfile = async (userID, data) => new Promise((resolve, reject) => {
  api
    .post(`/profiles/changes-image/${userID}`, data)
    .then((res) => {
      resolve(res.data);
    })
    .catch((err) => {
      reject(err);
    });
});

export const removeImageProfile = async () => new Promise((resolve, reject) => {
  api
    .delete(`/profiles/remove-image`)
    .then((res) => {
      resolve(res.data);
    })
    .catch((err) => {
      reject(err);
    });
});

export const updateBioProfile = async (userID, data) => new Promise((resolve, reject) => {
  api
    .post(`/profiles/update-bio/${userID}`, data)
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
  return new Promise((resolve, reject) => {
    if (!username) {
      return reject();
    }

    api
      .get(`/profiles/get-profile/${username}`)
      .then((res) => resolve(res.data))
      .catch((err) => {
        reject(err);
      });
  });
};

export const getSelfFeedsInProfile = async (offset = 0) => new Promise((resolve, reject) => {
  api
    .get(`/profiles/self-feeds?offset=${offset}`)
    .then((res) => resolve(res.data))
    .catch((err) => {
      reject(err);
    });
});

export const getOtherFeedsInProfile = async (userId, offset = 0) => new Promise((resolve, reject) => {
  api
    .get(`/profiles/feeds/${userId}?offset=${offset}`)
    .then((res) => resolve(res.data))
    .catch((err) => {
      reject(err);
    });
});
