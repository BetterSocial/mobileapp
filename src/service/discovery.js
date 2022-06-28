import crashlytics from '@react-native-firebase/crashlytics';

import api from './config';

const API_URL = {
  fetchInitialDiscoveryTopics: '/discovery/init/topic',
  fetchInitialDiscoveryUsers: '/discovery/init/user',
};

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

/**
 * @typedef {Object} FetchInitialDiscoveryTopicsResponse.SuggestedTopics
 * @property {String} topic_id
 * @property {String} name
 * @property {String} icon_path
 * @property {String} categories
 * @property {String} created_at
 * @property {String} flg_show
 * @property {String} common
 */

/**
 * @typedef {Object} FetchInitialDiscoveryTopicsResponse
 * @property {Boolean} success
 * @property {String} message
 * @property {Number} [nextPage]
 * @property {FetchInitialDiscoveryTopicsResponse.SuggestedUsers[]} [suggestedTopics]
 */

/**
 * @param {Number} limit
 * @param {Number} page
 * @returns {FetchInitialDiscoveryTopicsResponse}
 */
const fetchInitialDiscoveryTopics = async (limit = 10, page = 0) => {
  try {
    const response = await api.post('/discovery/init/topic', {
      limit,
      page,
    });

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
 * @typedef {Object} FetchInitialDiscoveryUsersResponse.SuggestedUsers
 * @property {String} user_id
 * @property {String} human_id
 * @property {String} country_code
 * @property {String} username
 * @property {String} real_name
 * @property {String} created_at
 * @property {String} updated_at
 * @property {String} last_active_at
 * @property {String} status
 * @property {String} profile_pic_path
 * @property {String} profile_pic_asset_id
 * @property {String} bio
 * @property {String} common
 */
/**
 * @typedef {Object} FetchInitialDiscoveryUsersResponse
 * @property {Boolean} success
 * @property {String} message
 * @property {Number} [nextPage]
 * @property {FetchInitialDiscoveryUsersResponse.SuggestedUsers[]} [suggestedUsers]
 */

/**
 * @param {Number} limit
 * @param {Number} page
 * @returns {FetchInitialDiscoveryUsersResponse}
 */
const fetchInitialDiscoveryUsers = async (limit = 10, page = 0) => {
  try {
    const response = await api.post('https://devme.bettersocial.org/api/v1/discovery/init/user', {
      limit,
      page,
    });

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
  fetchInitialDiscoveryTopics,
  fetchInitialDiscoveryUsers,
};

export default DiscoveryRepo;
