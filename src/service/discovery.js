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
 * @param {import('axios').AxiosRequestConfig} axiosOptions
 * @return {FetchDiscoveryDataResponse}
 */
const fetchDiscoveryDataUser = async (query, axiosOptions = {}) => {
  try {
    const response = await api.get(`/discovery/user/?q=${encodeURIComponent(query)}`, axiosOptions);
    if (response?.data?.success) {
      return response?.data;
    }
    return {
      success: false,
      message: response?.data?.message
    };
  } catch (error) {
    crashlytics().recordError(new Error(error));
    throw new Error(error);
  }
};
/**
 *
 * @param {String} query
 * @param {import('axios').AxiosRequestConfig} axiosOptions
 * @return {FetchDiscoveryDataResponse}
 */
const fetchDiscoveryDataDomain = async (query, axiosOptions = {}) => {
  try {
    const response = await api.get(
      `/discovery/domain/?q=${encodeURIComponent(query)}`,
      axiosOptions
    );
    if (response?.data?.success) {
      return response?.data;
    }
    return {
      success: false,
      message: response.data.message
    };
  } catch (error) {
    crashlytics().recordError(new Error(error));
    throw new Error(error);
  }
};
/**
 *
 * @param {String} query
 * @param {import('axios').AxiosRequestConfig} axiosOptions
 * @return {FetchDiscoveryDataResponse}
 */
const fetchDiscoveryDataTopic = async (query, axiosOptions = {}) => {
  try {
    const response = await api.get(
      `/discovery/topic/?q=${encodeURIComponent(query)}`,
      axiosOptions
    );
    if (response.data.success) {
      return response.data;
    }
    return {
      success: false,
      message: response.data.message
    };
  } catch (error) {
    crashlytics().recordError(new Error(error));
    throw new Error(error);
  }
};
/**
 *
 * @param {String} query
 * @param {import('axios').AxiosRequestConfig} axiosOptions
 * @return {FetchDiscoveryDataResponse}
 */
const fetchDiscoveryDataNews = async (query, axiosOptions = {}) => {
  try {
    const response = await api.get(`/discovery/news/?q=${encodeURIComponent(query)}`, axiosOptions);
    if (response.data.success) {
      return response.data;
    }
    return {
      success: false,
      message: response.data.message
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
 * @property {Number} [page]
 * @property {FetchInitialDiscoveryTopicsResponse.SuggestedUsers[]} [suggestedTopics]
 */

/**
 * @param {Number} limit
 * @param {Number} page
 * @returns {FetchInitialDiscoveryTopicsResponse}
 */
const fetchInitialDiscoveryTopics = async (limit = 25, page = 0) => {
  try {
    const response = await api.post(`/discovery/init/topic?limit=${limit}`, {
      limit,
      page
    });

    if (response.data.success) {
      return response.data;
    }
    return {
      success: false,
      message: response.data.message
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
 * @property {Number} [page]
 * @property {FetchInitialDiscoveryUsersResponse.SuggestedUsers[]} [suggestedUsers]
 */

/**
 * @param {Number} limit
 * @param {Number} page
 * @returns {FetchInitialDiscoveryUsersResponse}
 */
const fetchInitialDiscoveryUsers = async (limit = 50, page = 0) => {
  try {
    const response = await api.post('discovery/init/user', {
      limit,
      page
    });

    if (response.data.success) {
      return response.data;
    }

    return {
      success: false,
      message: response.data.message
    };
  } catch (error) {
    crashlytics().recordError(new Error(error));
    throw new Error(error);
  }
};

/**
 * @typedef {Object} FetchInitialDiscoveryUsersResponse.SuggestedDomain
 * @property {String} domain_name
 * @property {String} domain_id_followed
 * @property {String} short_description
 * @property {String} logo
 * @property {String} user_id_follower
 * @property {Number} credder_score
 * @property {Number} common
 */
/**
 * @typedef {Object} FetchInitialDiscoveryDomainsResponse
 * @property {Boolean} success
 * @property {String} message
 * @property {Number} [page]
 * @property {FetchInitialDiscoveryUsersResponse.SuggestedDomain[]} [suggestedDomains]
 */

/**
 * @param {Number} limit
 * @param {Number} page
 * @returns {FetchInitialDiscoveryDomainsResponse}
 */
const fetchInitialDiscoveryDomains = async (limit = 25, page = 0) => {
  try {
    const response = await api.post(`discovery/init/domain?limit=${limit}`, {
      limit,
      page
    });

    if (response.data.success) {
      return response.data;
    }
    return {
      success: false,
      message: response.data.message
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
  fetchInitialDiscoveryDomains
};

export default DiscoveryRepo;
