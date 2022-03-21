/* eslint-disable no-case-declarations */
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
 * @typedef {Object} DiscoveryState
 * @property {Object[]} followedUsers
 * @property {Object[]} unfollowedUsers
 * @property {Object[]} followedTopic
 * @property {Object[]} unfollowedTopic
 * @property {Object[]} followedDomains
 * @property {Object[]} unfollowedDomains
 * @property {Object[]} news
 * @property {Boolean} isLoadingDiscovery
 */
const discoveryState = {
  followedUsers: [],
  unfollowedUsers: [],
  followedTopic: [],
  unfollowedTopic: [],
  followedDomains: [],
  unfollowedDomains: [],
  news: [],
  isLoadingDiscovery: false,
  isFirstTimeOpen: true,
};

/**
 *
 * @typedef {Object} DiscoveryReducerActionPayload
 * @property {import('../../service/discovery').FetchDiscoveryDataResponse} discovery
 */
/**
 *
 * @typedef {Object} DiscoveryReducerAction
 * @property {DiscoveryReducerActionPayload} payload
 */
/**
 *
 * @param {Object} state
 * @param {DiscoveryReducerAction} action
 * @returns
 */
const discoveryReducer = (state = discoveryState, action) => {
  switch (action.type) {
    case DISCOVERY_SET_DATA:
      const {
        followedUsers, unfollowedUsers, followedDomains,
        unfollowedDomains, followedTopic, unfollowedTopic, news,
      } = action.payload.discovery;
      return {
        ...state,
        followedUsers,
        unfollowedUsers,
        followedDomains,
        unfollowedDomains,
        followedTopic,
        unfollowedTopic,
        news,
      };

    case DISCOVERY_SET_FIRST_TIME_OPEN:
      return {
        ...state,
        isFirstTimeOpen: action.payload,
      };

    case DISCOVERY_SET_LOADING_DATA:
      return {
        ...state,
        isLoadingDiscovery: action.payload,
      };

    case DISCOVERY_SET_NEW_FOLLOWED_USER:
      return {
        ...state,
        followedUsers: action.payload.newFollowedUsers,
      };

    case DISCOVERY_SET_NEW_UNFOLLOWED_USER:
      return {
        ...state,
        unfollowedUsers: action.payload.newUnfollowedUsers,
      };

    case DISCOVERY_SET_NEW_FOLLOWED_DOMAIN:
      return {
        ...state,
        followedDomains: action.payload.newFollowedDomains,
      };

    case DISCOVERY_SET_NEW_UNFOLLOWED_DOMAIN:
      return {
        ...state,
        unfollowedDomains: action.payload.newUnfollowedDomains,
      };
    default:
      return state;
  }
};
export { discoveryReducer, discoveryState };
