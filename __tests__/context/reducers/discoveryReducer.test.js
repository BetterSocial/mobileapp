import {discoveryReducer, discoveryState} from '../../../src/context/reducers/discoveryReducer';

describe('discoveryReducer should pass', () => {
  it('should return default discovery state', () => {
    expect(discoveryState).toEqual({
      isFirstTimeOpen: true,
      isLoadingDiscoveryUser: false,
      isLoadingDiscoveryDomain: false,
      isLoadingDiscoveryTopic: false,
      isLoadingDiscoveryNews: false,
      initialDomains: [],
      initialTopics: [],
      initialUsers: [],
      followedUsers: [],
      unfollowedUsers: [],
      followedDomains: [],
      unfollowedDomains: [],
      followedTopic: [],
      unfollowedTopic: [],
      news: [],
      isFocus: true,
      recentSearch: []
    });
  });

  it('should return default discovery state if action type is not matched', () => {
    const action = {
      type: 'UNDEFINED',
      payload: {
        discovery: {
          followedUsers: [],
          unfollowedUsers: [],
          followedDomains: [],
          unfollowedDomains: [],
          followedTopic: [],
          unfollowedTopic: [],
          news: []
        }
      }
    };

    expect(discoveryReducer(discoveryState, action)).toEqual(discoveryState);
  });

  it('should return reset discovery state if action type is matched', () => {
    const action = {
      type: 'DISCOVERY_RESET'
    };

    expect(discoveryReducer(discoveryState, action)).toEqual(discoveryState);
  });

  it('should return set initial domain discovery state if action type is matched', () => {
    const action = {
      type: 'DISCOVERY_SET_INITIAL_DOMAINS',
      payload: ['domain1', 'domain2']
    };

    expect(discoveryReducer(discoveryState, action)).toEqual({
      ...discoveryState,
      initialDomains: ['domain1', 'domain2']
    });
  });

  it('should return set initial topic discovery state if action type is matched', () => {
    const action = {
      type: 'DISCOVERY_SET_INITIAL_TOPICS',
      payload: ['topics1', 'topics2']
    };

    expect(discoveryReducer(discoveryState, action)).toEqual({
      ...discoveryState,
      initialTopics: ['topics1', 'topics2']
    });
  });

  it('should return set initial users discovery state if action type is matched', () => {
    const action = {
      type: 'DISCOVERY_SET_INITIAL_USERS',
      payload: ['users1', 'users2']
    };

    expect(discoveryReducer(discoveryState, action)).toEqual({
      ...discoveryState,
      initialUsers: ['users1', 'users2']
    });
  });

  it('should return set data domain discovery state if action type is matched', () => {
    const action = {
      type: 'DISCOVERY_SET_DATA_DOMAINS',
      payload: {
        discovery: {
          followedDomains: ['domain1', 'domain2'],
          unfollowedDomains: ['domain3', 'domain4']
        }
      }
    };

    expect(discoveryReducer(discoveryState, action)).toEqual({
      ...discoveryState,
      followedDomains: ['domain1', 'domain2'],
      unfollowedDomains: ['domain3', 'domain4']
    });
  });

  it('should return set data topic discovery state if action type is matched', () => {
    const action = {
      type: 'DISCOVERY_SET_DATA_TOPICS',
      payload: {
        discovery: {
          followedTopic: ['topics1', 'topics2'],
          unfollowedTopic: ['topics3', 'topics4']
        }
      }
    };

    expect(discoveryReducer(discoveryState, action)).toEqual({
      ...discoveryState,
      followedTopic: ['topics1', 'topics2'],
      unfollowedTopic: ['topics3', 'topics4']
    });
  });

  it('should return set data users discovery state if action type is matched', () => {
    const action = {
      type: 'DISCOVERY_SET_DATA_USERS',
      payload: {
        discovery: {
          followedUsers: ['users1', 'users2'],
          unfollowedUsers: ['users3', 'users4']
        }
      }
    };

    expect(discoveryReducer(discoveryState, action)).toEqual({
      ...discoveryState,
      followedUsers: ['users1', 'users2'],
      unfollowedUsers: ['users3', 'users4']
    });
  });

  it('should return set followed domain discovery state if action type is matched', () => {
    const action = {
      type: 'DISCOVERY_SET_NEW_FOLLOWED_DOMAIN',
      payload: {
        newFollowedDomains: ['domain1', 'domain2']
      }
    };

    expect(discoveryReducer(discoveryState, action)).toEqual({
      ...discoveryState,
      followedDomains: ['domain1', 'domain2']
    });
  });

  it('should return set unfollowed domain discovery state if action type is matched', () => {
    const action = {
      type: 'DISCOVERY_SET_NEW_UNFOLLOWED_DOMAIN',
      payload: {
        newUnfollowedDomains: ['domain1', 'domain2']
      }
    };

    expect(discoveryReducer(discoveryState, action)).toEqual({
      ...discoveryState,
      unfollowedDomains: ['domain1', 'domain2']
    });
  });

  it('should return set followed topic discovery state if action type is matched', () => {
    const action = {
      type: 'DISCOVERY_SET_NEW_FOLLOWED_TOPIC',
      payload: {
        newFollowedTopics: ['topic1', 'topic2']
      }
    };

    expect(discoveryReducer(discoveryState, action)).toEqual({
      ...discoveryState,
      followedTopic: ['topic1', 'topic2']
    });
  });

  it('should return set unfollowed topic discovery state if action type is matched', () => {
    const action = {
      type: 'DISCOVERY_SET_NEW_UNFOLLOWED_TOPIC',
      payload: {
        newUnfollowedTopics: ['topic1', 'topic2']
      }
    };

    expect(discoveryReducer(discoveryState, action)).toEqual({
      ...discoveryState,
      unfollowedTopic: ['topic1', 'topic2']
    });
  });

  it('should return set followed user discovery state if action type is matched', () => {
    const action = {
      type: 'DISCOVERY_SET_NEW_FOLLOWED_USER',
      payload: {
        newFollowedUsers: ['user1', 'user2']
      }
    };

    expect(discoveryReducer(discoveryState, action)).toEqual({
      ...discoveryState,
      followedUsers: ['user1', 'user2']
    });
  });

  it('should return set unfollowed user discovery state if action type is matched', () => {
    const action = {
      type: 'DISCOVERY_SET_NEW_UNFOLLOWED_USER',
      payload: {
        newUnfollowedUsers: ['user1', 'user2']
      }
    };

    expect(discoveryReducer(discoveryState, action)).toEqual({
      ...discoveryState,
      unfollowedUsers: ['user1', 'user2']
    });
  });

  it('should return set loading data discovery state if action type is matched', () => {
    const action = {
      type: 'DISCOVERY_SET_LOADING_DATA',
      payload: true
    };

    expect(discoveryReducer(discoveryState, action)).toEqual({
      ...discoveryState,
      isLoadingDiscoveryUser: true,
      isLoadingDiscoveryDomain: true,
      isLoadingDiscoveryTopic: true,
      isLoadingDiscoveryNews: true
    });
  });

  it('should return set loading data discovery user state if action type is matched', () => {
    const action = {
      type: 'DISCOVERY_SET_LOADING_DATA_USER',
      payload: true
    };

    expect(discoveryReducer(discoveryState, action)).toEqual({
      ...discoveryState,
      isLoadingDiscoveryUser: true
    });
  });

  it('should return set loading data discovery domain state if action type is matched', () => {
    const action = {
      type: 'DISCOVERY_SET_LOADING_DATA_DOMAIN',
      payload: true
    };

    expect(discoveryReducer(discoveryState, action)).toEqual({
      ...discoveryState,
      isLoadingDiscoveryDomain: true
    });
  });

  it('should return set loading data discovery topic state if action type is matched', () => {
    const action = {
      type: 'DISCOVERY_SET_LOADING_DATA_TOPIC',
      payload: true
    };

    expect(discoveryReducer(discoveryState, action)).toEqual({
      ...discoveryState,
      isLoadingDiscoveryTopic: true
    });
  });

  it('should return set loading data discovery news state if action type is matched', () => {
    const action = {
      type: 'DISCOVERY_SET_LOADING_DATA_NEWS',
      payload: true
    };

    expect(discoveryReducer(discoveryState, action)).toEqual({
      ...discoveryState,
      isLoadingDiscoveryNews: true
    });
  });

  it('should return set isFirstTimeOpen if action type is matched', () => {
    const action = {
      type: 'DISCOVERY_SET_IS_FIRST_TIME_OPEN',
      payload: true
    };

    expect(discoveryReducer(discoveryState, action)).toEqual({
      ...discoveryState,
      isFirstTimeOpen: true
    });
  });

  it('should return set focus if action type is matched', () => {
    const action = {
      type: 'DISCOVERY_SET_FOCUS',
      payload: true
    };

    expect(discoveryReducer(discoveryState, action)).toEqual({
      ...discoveryState,
      isFocus: true
    });
  });

  it('should return set data news discovery state if action type is matched', () => {
    const action = {
      type: 'DISCOVERY_SET_DATA_NEWS',
      payload: {
        discovery: {
          news: ['news1', 'news2']
        }
      }
    };

    expect(discoveryReducer(discoveryState, action)).toEqual({
      ...discoveryState,
      news: ['news1', 'news2']
    });
  });

  it('should return set recent search discovery state if action type is matched', () => {
    const action = {
      type: 'DISCOVERY_SET_RECENT_SEARCH',
      payload: ['recentSearch1', 'recentSearch2']
    };

    expect(discoveryReducer(discoveryState, action)).toEqual({
      ...discoveryState,
      recentSearch: ['recentSearch1', 'recentSearch2']
    });
  });
});
