/* eslint-disable no-case-declarations */
import {
  DISCOVERY_RESET,
  DISCOVERY_SET_DATA,
  DISCOVERY_SET_DATA_DOMAINS,
  DISCOVERY_SET_DATA_NEWS,
  DISCOVERY_SET_DATA_TOPICS,
  DISCOVERY_SET_DATA_USERS,
  DISCOVERY_SET_FIRST_TIME_OPEN,
  DISCOVERY_SET_FOCUS,
  DISCOVERY_SET_INITIAL_TOPICS,
  DISCOVERY_SET_INITIAL_USERS,
  DISCOVERY_SET_LOADING_DATA,
  DISCOVERY_SET_LOADING_DATA_DOMAIN,
  DISCOVERY_SET_LOADING_DATA_NEWS,
  DISCOVERY_SET_LOADING_DATA_TOPIC,
  DISCOVERY_SET_LOADING_DATA_USER,
  DISCOVERY_SET_NEW_FOLLOWED_DOMAIN,
  DISCOVERY_SET_NEW_FOLLOWED_USER,
  DISCOVERY_SET_NEW_UNFOLLOWED_DOMAIN,
  DISCOVERY_SET_NEW_UNFOLLOWED_USER,
  DISCOVERY_SET_RECENT_SEARCH,
} from '../Types';

/**
 * @typedef {Object} DiscoveryState
 * @property {Object[]} initialUsers
 * @property {Object[]} initialTopics
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
  initialUsers: [],
  initialTopics: [],
  followedUsers: [],
  unfollowedUsers: [],
  followedTopic: [],
  unfollowedTopic: [],
  followedDomains: [],
  unfollowedDomains: [],
  news: [],
  recentSearch: [],
  isLoadingDiscoveryUser: false,
  isLoadingDiscoveryDomain: false,
  isLoadingDiscoveryTopic: false,
  isLoadingDiscoveryNews: false,
  isFirstTimeOpen: true,
  isFocus: true,
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
    // case DISCOVERY_SET_DATA:
    //   const {
    //     followedUsers, unfollowedUsers, followedDomains,
    //     unfollowedDomains, followedTopic, unfollowedTopic, news,
    //   } = action.payload.discovery;
    //   return {
    //     ...state,
    //     followedUsers,
    //     unfollowedUsers,
    //     followedDomains,
    //     unfollowedDomains,
    //     followedTopic,
    //     unfollowedTopic,
    //     news,
    //   };

    case DISCOVERY_RESET:
      return {
        ...state,
        isFirstTimeOpen: true,
        isLoadingDiscoveryUser: false,
        isLoadingDiscoveryDomain: false,
        isLoadingDiscoveryTopic: false,
        isLoadingDiscoveryNews: false,
      };

    case DISCOVERY_SET_INITIAL_TOPICS:
      return {
        ...state,
        initialTopics: action.payload,
      };

    case DISCOVERY_SET_INITIAL_USERS:
      return {
        ...state,
        initialUsers: action.payload,
      };

    case DISCOVERY_SET_DATA_USERS:
      const {
        followedUsers, unfollowedUsers,
      } = action.payload.discovery;
      return {
        ...state,
        followedUsers,
        unfollowedUsers,
      };

    case DISCOVERY_SET_DATA_DOMAINS:
      const {
        followedDomains, unfollowedDomains,
      } = action.payload.discovery;
      return {
        ...state,
        followedDomains,
        unfollowedDomains,
      };

    case DISCOVERY_SET_DATA_TOPICS:
      const {
        followedTopic, unfollowedTopic,
      } = action.payload.discovery;
      return {
        ...state,
        followedTopic,
        unfollowedTopic,
      };

    case DISCOVERY_SET_DATA_NEWS:
      const {
        news,
      } = action.payload.discovery;
      return {
        ...state,
        news,
      };

    case DISCOVERY_SET_FOCUS:
      return {
        ...state,
        isFocus: action.payload,
      };

    case DISCOVERY_SET_FIRST_TIME_OPEN:
      return {
        ...state,
        isFirstTimeOpen: action.payload,
      };

    case DISCOVERY_SET_RECENT_SEARCH:
      return {
        ...state,
        recentSearch: action.payload,
      };

    case DISCOVERY_SET_LOADING_DATA:
      return {
        ...state,
        isLoadingDiscoveryUser: action.payload,
        isLoadingDiscoveryDomain: action.payload,
        isLoadingDiscoveryTopic: action.payload,
        isLoadingDiscoveryNews: action.payload,
      };

    case DISCOVERY_SET_LOADING_DATA_USER:
      return {
        ...state,
        isLoadingDiscoveryUser: action.payload,
      };

    case DISCOVERY_SET_LOADING_DATA_TOPIC:
      return {
        ...state,
        isLoadingDiscoveryTopic: action.payload,
      };

    case DISCOVERY_SET_LOADING_DATA_DOMAIN:
      return {
        ...state,
        isLoadingDiscoveryDomain: action.payload,
      };

    case DISCOVERY_SET_LOADING_DATA_NEWS:
      return {
        ...state,
        isLoadingDiscoveryNews: action.payload,
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
