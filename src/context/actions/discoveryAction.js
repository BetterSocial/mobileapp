import {
  DISCOVERY_SET_DATA,
  DISCOVERY_SET_DATA_DOMAINS,
  DISCOVERY_SET_DATA_NEWS,
  DISCOVERY_SET_DATA_TOPICS,
  DISCOVERY_SET_DATA_USERS,
  DISCOVERY_SET_FIRST_TIME_OPEN,
  DISCOVERY_SET_FOCUS,
  DISCOVERY_SET_LOADING_DATA,
  DISCOVERY_SET_LOADING_DATA_DOMAIN,
  DISCOVERY_SET_LOADING_DATA_NEWS,
  DISCOVERY_SET_LOADING_DATA_TOPIC,
  DISCOVERY_SET_LOADING_DATA_USER,
  DISCOVERY_SET_NEW_FOLLOWED_DOMAIN,
  DISCOVERY_SET_NEW_FOLLOWED_USER,
  DISCOVERY_SET_NEW_UNFOLLOWED_DOMAIN,
  DISCOVERY_SET_NEW_UNFOLLOWED_USER,
} from '../Types';

/**
 *
 * @param {Boolean} isLoading
 * @param {Any} dispatch
 */
const setDiscoveryLoadingData = async (isLoading, dispatch) => {
  dispatch({
    type: DISCOVERY_SET_LOADING_DATA,
    payload: isLoading,
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
    payload: isLoading,
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
    payload: isLoading,
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
    payload: isLoading,
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
    payload: isLoading,
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
    payload: isFirstTimeOpen,
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
    payload: isFocus,
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
      discovery: data,
    },
  });
};

const setDiscoveryDataUsers = async (data, dispatch) => {
  dispatch({
    type: DISCOVERY_SET_DATA_USERS,
    payload: {
      discovery: data,
    },
  });
};

const setDiscoveryDataDomains = async (data, dispatch) => {
  dispatch({
    type: DISCOVERY_SET_DATA_DOMAINS,
    payload: {
      discovery: data,
    },
  });
};

const setDiscoveryDataTopics = async (data, dispatch) => {
  dispatch({
    type: DISCOVERY_SET_DATA_TOPICS,
    payload: {
      discovery: data,
    },
  });
};

const setDiscoveryDataNews = async (data, dispatch) => {
  dispatch({
    type: DISCOVERY_SET_DATA_NEWS,
    payload: {
      discovery: data,
    },
  });
};

const setNewFollowedUsers = async (data, dispatch) => {
  dispatch({
    type: DISCOVERY_SET_NEW_FOLLOWED_USER,
    payload: {
      newFollowedUsers: data,
    },
  });
};

const setNewUnfollowedUsers = async (data, dispatch) => {
  dispatch({
    type: DISCOVERY_SET_NEW_UNFOLLOWED_USER,
    payload: {
      newUnfollowedUsers: data,
    },
  });
};

const setNewFollowedDomains = async (data, dispatch) => {
  dispatch({
    type: DISCOVERY_SET_NEW_FOLLOWED_DOMAIN,
    payload: {
      newFollowedDomains: data,
    },
  });
};

const setNewUnfollowedDomains = async (data, dispatch) => {
  dispatch({
    type: DISCOVERY_SET_NEW_UNFOLLOWED_DOMAIN,
    payload: {
      newUnfollowedDomains: data,
    },
  });
};

const DiscoveryAction = {
  setDiscoveryLoadingData,
  setDiscoveryLoadingDataUser,
  setDiscoveryLoadingDataDomain,
  setDiscoveryLoadingDataTopic,
  setDiscoveryLoadingDataNews,
  setDiscoveryData,
  setDiscoveryDataUsers,
  setDiscoveryDataDomains,
  setDiscoveryDataTopics,
  setDiscoveryDataNews,
  setDiscoveryFirstTimeOpen,
  setDiscoveryFocus,
  setNewFollowedDomains,
  setNewFollowedUsers,
  setNewUnfollowedDomains,
  setNewUnfollowedUsers,
};

export default DiscoveryAction;
