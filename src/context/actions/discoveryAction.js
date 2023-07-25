import {
  DISCOVERY_RESET,
  DISCOVERY_RESET_ALL,
  DISCOVERY_SET_DATA,
  DISCOVERY_SET_DATA_DOMAINS,
  DISCOVERY_SET_DATA_NEWS,
  DISCOVERY_SET_DATA_TOPICS,
  DISCOVERY_SET_DATA_USERS,
  DISCOVERY_SET_FIRST_TIME_OPEN,
  DISCOVERY_SET_FOCUS,
  DISCOVERY_SET_INITIAL_DOMAINS,
  DISCOVERY_SET_INITIAL_TOPICS,
  DISCOVERY_SET_INITIAL_USERS,
  DISCOVERY_SET_LOADING_DATA,
  DISCOVERY_SET_LOADING_DATA_DOMAIN,
  DISCOVERY_SET_LOADING_DATA_NEWS,
  DISCOVERY_SET_LOADING_DATA_TOPIC,
  DISCOVERY_SET_LOADING_DATA_USER,
  DISCOVERY_SET_NEW_FOLLOWED_DOMAIN,
  DISCOVERY_SET_NEW_FOLLOWED_TOPIC,
  DISCOVERY_SET_NEW_FOLLOWED_USER,
  DISCOVERY_SET_NEW_UNFOLLOWED_DOMAIN,
  DISCOVERY_SET_NEW_UNFOLLOWED_TOPIC,
  DISCOVERY_SET_NEW_UNFOLLOWED_USER,
  DISCOVERY_SET_RECENT_SEARCH
} from '../Types';

/**
 *
 * @param {Boolean} isLoading
 * @param {Any} dispatch
 */
const setDiscoveryLoadingData = async (isLoading, dispatch) => {
  dispatch({
    type: DISCOVERY_SET_LOADING_DATA,
    payload: isLoading
  });
};

/**
 *
 * @param {import('../../service/discovery').FetchInitialDiscoveryTopicsResponse.SuggestedDomain[]} data
 * @param {Any} dispatch
 */
const setDiscoveryInitialDomains = async (data, dispatch) => {
  dispatch({
    type: DISCOVERY_SET_INITIAL_DOMAINS,
    payload: data
  });
};

/**
 *
 * @param {import('../../service/discovery').FetchInitialDiscoveryTopicsResponse.SuggestedTopics[]} data
 * @param {Any} dispatch
 */
const setDiscoveryInitialTopics = async (data, dispatch) => {
  dispatch({
    type: DISCOVERY_SET_INITIAL_TOPICS,
    payload: data
  });
};

/**
 *
 * @param {import('../../service/discovery').FetchInitialDiscoveryUsersResponse.SuggestedUsers[]} data
 * @param {Any} dispatch
 */
const setDiscoveryInitialUsers = async (data, dispatch) => {
  dispatch({
    type: DISCOVERY_SET_INITIAL_USERS,
    payload: data
  });
};

/**
 *
 * @param {Boolean} isLoading
 * @param {Any} dispatch
 */
const setDiscoveryLoadingDataUser = async (isLoading, dispatch) => {
  dispatch({
    type: DISCOVERY_SET_LOADING_DATA_USER,
    payload: isLoading
  });
};
/**
 *
 * @param {Boolean} isLoading
 * @param {Any} dispatch
 */
const setDiscoveryLoadingDataDomain = async (isLoading, dispatch) => {
  dispatch({
    type: DISCOVERY_SET_LOADING_DATA_DOMAIN,
    payload: isLoading
  });
};
/**
 *
 * @param {Boolean} isLoading
 * @param {Any} dispatch
 */
const setDiscoveryLoadingDataTopic = async (isLoading, dispatch) => {
  dispatch({
    type: DISCOVERY_SET_LOADING_DATA_TOPIC,
    payload: isLoading
  });
};
/**
 *
 * @param {Boolean} isLoading
 * @param {Any} dispatch
 */
const setDiscoveryLoadingDataNews = async (isLoading, dispatch) => {
  dispatch({
    type: DISCOVERY_SET_LOADING_DATA_NEWS,
    payload: isLoading
  });
};

/**
 *
 * @param {Boolean} isFirstTimeOpen
 * @param {Any} dispatch
 */
const setDiscoveryFirstTimeOpen = async (isFirstTimeOpen, dispatch) => {
  dispatch({
    type: DISCOVERY_SET_FIRST_TIME_OPEN,
    payload: isFirstTimeOpen
  });
};

/**
 *
 * @param {Boolean} isFocus
 * @param {Any} dispatch
 */
const setDiscoveryFocus = async (isFocus, dispatch) => {
  dispatch({
    type: DISCOVERY_SET_FOCUS,
    payload: isFocus
  });
};

/**
 *
 * @param {import('../../service/discovery').FetchDiscoveryDataResponse} data
 * @param {Any} dispatch
 */
const setDiscoveryData = async (data, dispatch) => {
  dispatch({
    type: DISCOVERY_SET_DATA,
    payload: {
      discovery: data
    }
  });
};

const setDiscoveryDataUsers = async (data, dispatch) => {
  dispatch({
    type: DISCOVERY_SET_DATA_USERS,
    payload: {
      discovery: data
    }
  });
};

const setDiscoveryDataDomains = async (data, dispatch) => {
  dispatch({
    type: DISCOVERY_SET_DATA_DOMAINS,
    payload: {
      discovery: data
    }
  });
};

const setDiscoveryRecentSearch = async (data, dispatch) => {
  dispatch({
    type: DISCOVERY_SET_RECENT_SEARCH,
    payload: data
  });
};

const setDiscoveryDataTopics = async (data, dispatch) => {
  dispatch({
    type: DISCOVERY_SET_DATA_TOPICS,
    payload: {
      discovery: data
    }
  });
};

const setDiscoveryDataNews = async (data, dispatch) => {
  dispatch({
    type: DISCOVERY_SET_DATA_NEWS,
    payload: {
      discovery: data
    }
  });
};

const setNewFollowedUsers = async (data, dispatch) => {
  dispatch({
    type: DISCOVERY_SET_NEW_FOLLOWED_USER,
    payload: {
      newFollowedUsers: data
    }
  });
};

const setNewUnfollowedUsers = async (data, dispatch) => {
  dispatch({
    type: DISCOVERY_SET_NEW_UNFOLLOWED_USER,
    payload: {
      newUnfollowedUsers: data
    }
  });
};

const setNewFollowedDomains = async (data, dispatch) => {
  dispatch({
    type: DISCOVERY_SET_NEW_FOLLOWED_DOMAIN,
    payload: {
      newFollowedDomains: data
    }
  });
};

const setNewUnfollowedDomains = async (data, dispatch) => {
  dispatch({
    type: DISCOVERY_SET_NEW_UNFOLLOWED_DOMAIN,
    payload: {
      newUnfollowedDomains: data
    }
  });
};

const reset = async (dispatch) => {
  dispatch({
    type: DISCOVERY_RESET
  });
};

const setNewFollowedTopics = async (data, dispatch) => {
  dispatch({
    type: DISCOVERY_SET_NEW_FOLLOWED_TOPIC,
    payload: {
      newFollowedTopics: data
    }
  });
};

const setNewUnfollowedTopics = async (data, dispatch) => {
  dispatch({
    type: DISCOVERY_SET_NEW_UNFOLLOWED_TOPIC,
    payload: {
      newUnfollowedTopics: data
    }
  });
};

const resetAllDiscovery = async (dispatch) => {
  dispatch({
    type: DISCOVERY_RESET_ALL
  });
};

const DiscoveryAction = {
  reset,
  resetAllDiscovery,
  setDiscoveryInitialDomains,
  setDiscoveryInitialTopics,
  setDiscoveryInitialUsers,
  setDiscoveryData,
  setDiscoveryDataDomains,
  setDiscoveryDataNews,
  setDiscoveryDataTopics,
  setDiscoveryDataUsers,
  setDiscoveryFirstTimeOpen,
  setDiscoveryFocus,
  setDiscoveryLoadingData,
  setDiscoveryLoadingDataDomain,
  setDiscoveryLoadingDataNews,
  setDiscoveryLoadingDataTopic,
  setDiscoveryLoadingDataUser,
  setNewFollowedDomains,
  setNewFollowedTopics,
  setNewFollowedUsers,
  setNewUnfollowedDomains,
  setNewUnfollowedTopics,
  setNewUnfollowedUsers,
  setDiscoveryRecentSearch
};

export default DiscoveryAction;
