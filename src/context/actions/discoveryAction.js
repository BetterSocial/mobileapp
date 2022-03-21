import {
  DISCOVERY_SET_DATA,
  DISCOVERY_SET_FIRST_TIME_OPEN,
  DISCOVERY_SET_LOADING_DATA,
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
 * @param {Boolean} isFirstTimeOpen
 * @param {Any} dispatch
 */
const setDiscoveryFirstTimeOpen = async (isFirstTimeOpen, dispatch) => {
  console.log('dispatch first time open');
  dispatch({
    type: DISCOVERY_SET_FIRST_TIME_OPEN,
    payload: isFirstTimeOpen,
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
  setDiscoveryData,
  setDiscoveryFirstTimeOpen,
  setNewFollowedDomains,
  setNewFollowedUsers,
  setNewUnfollowedDomains,
  setNewUnfollowedUsers,
};

export default DiscoveryAction;
