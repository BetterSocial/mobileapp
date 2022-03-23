import crashlytics from '@react-native-firebase/crashlytics';

import api from './config';

/**
 *
 * @typedef {Object} FetchDiscoveryDataResponse
 * @property {Object[]} followedDomains
 * @property {Object[]} unfollowedDomains
 * @property {Object[]} followedUsers
 * @property {Object[]} unfollowedUsers
 * @property {Object[]} followedTopic
 * @property {Object[]} unfollowedTopic
 * @property {Object[]} news
 * @property {Boolean} success
 * @property {String} message
 */
/**
 *
 * @param {String} query
 * @return {FetchDiscoveryDataResponse}
 */
const fetchDiscoveryDataUser = async (query) => {
  try {
    const response = await api.get(`/discovery/user/?q=${encodeURIComponent(query)}`);
    if (response.data.success) {
      return response.data;
    }
    return {
      success: false,
      message: response.data.message,
    };
  } catch (error) {
    crashlytics().recordError(new Error(error));
    throw new Error(error);
  }
};
/**
 *
 * @param {String} query
 * @return {FetchDiscoveryDataResponse}
 */
const fetchDiscoveryDataDomain = async (query) => {
  try {
    const response = await api.get(`/discovery/domain/?q=${encodeURIComponent(query)}`);
    if (response.data.success) {
      return response.data;
    }
    return {
      success: false,
      message: response.data.message,
    };
  } catch (error) {
    crashlytics().recordError(new Error(error));
    throw new Error(error);
  }
};
/**
 *
 * @param {String} query
 * @return {FetchDiscoveryDataResponse}
 */
const fetchDiscoveryDataTopic = async (query) => {
  try {
    const response = await api.get(`/discovery/topic/?q=${encodeURIComponent(query)}`);
    if (response.data.success) {
      return response.data;
    }
    return {
      success: false,
      message: response.data.message,
    };
  } catch (error) {
    crashlytics().recordError(new Error(error));
    throw new Error(error);
  }
};
/**
 *
 * @param {String} query
 * @return {FetchDiscoveryDataResponse}
 */
const fetchDiscoveryDataNews = async (query) => {
  try {
    const response = await api.get(`/discovery/news/?q=${encodeURIComponent(query)}`);
    if (response.data.success) {
      return response.data;
    }
    return {
      success: false,
      message: response.data.message,
    };
  } catch (error) {
    crashlytics().recordError(new Error(error));
    throw new Error(error);
  }
};

const DiscoveryRepo = {
  fetchDiscoveryDataUser,
  fetchDiscoveryDataDomain,
  fetchDiscoveryDataTopic,
  fetchDiscoveryDataNews,
};

export default DiscoveryRepo;
