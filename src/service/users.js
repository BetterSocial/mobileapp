import api from './config';

export const verifyUser = async (userId) => {
  try {
    let resApi = await api.post('/users/verify-user', {
      user_id: userId,
    });
    return resApi.data;
  } catch (error) {
    console.log(error);
  }
};
export const verifyToken = async (token) => {
  try {
    let resApi = await api.post('/users/veryfy-token', {
      token,
    });
    console.log(resApi.data);
    return resApi.data;
  } catch (error) {
    console.log(error);
  }
};
export const verifyUsername = async (username) => {
  try {
    let resApi = await api.post('/users/check-username', {
      username,
    });
    return resApi.data;
  } catch (error) {
    console.log(error);
  }
};
