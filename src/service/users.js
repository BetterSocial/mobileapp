import api from './config';

export const verifyUser = async () => {
  let resApi = null;
  try {
    resApi = await api.get('/users/verify-user');
  } catch (error) {
    console.log(error);
  } finally {
    console.log(resApi);
  }
};
