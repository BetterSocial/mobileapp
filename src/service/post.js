import api from './config';
export const createPost = async (data) => {
  try {
    let resApi = await api.post('/activity/post', data);
    return resApi.data;
  } catch (error) {
    console.log(error);
  }
};
