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
const fetchDiscoveryData = async (query) => {
  try {
    const response = await api.get(`/discovery/?q=${encodeURIComponent(query)}`);
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
  fetchDiscoveryData,
};

export default DiscoveryRepo;
