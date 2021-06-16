import api from './config';
import crashlytics from '@react-native-firebase/crashlytics';

export const getDomains = async () => {
  try {
    let res = await api.get('/domain');
    return res.data;
  } catch (error) {
    console.log(error);
    crashlytics().recordError(new Error(error));
    throw new Error(error);
  }
};

export const getDetailDomains = async (domain) => {
  try {
    let res = await api.get(`/domain/domain/${domain}`);
    return res.data;
  } catch (error) {
    console.log(error);
    crashlytics().recordError(new Error(error));
    throw new Error(error);
  }
};

export const getProfileDomain = async (name) => {
  try {
    let res = await api.get(`/domain/profile-domain/${name}`);
    return res.data;
  } catch (error) {
    console.log(error);
    crashlytics().recordError(new Error(error));
    throw new Error(error);
  }
};
