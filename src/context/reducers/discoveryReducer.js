/* eslint-disable no-case-declarations */
import {
  DISCOVERY_SET_DATA,
  DISCOVERY_SET_LOADING_DATA,
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

    case DISCOVERY_SET_LOADING_DATA:
      return {
        ...state,
        isLoadingDiscovery: action.payload,
      };
    default:
      return state;
  }
};
export { discoveryReducer, discoveryState };
