import AsyncStorage from '@react-native-async-storage/async-storage';
import React from 'react';
import SplashScreen from 'react-native-splash-screen';
import {LogBox, Platform, StatusBar} from 'react-native';
import {useLocalChannelsFirst} from 'stream-chat-react-native';
import {useRecoilValue, useSetRecoilState} from 'recoil';

import DiscoveryAction from '../context/actions/discoveryAction';
import DiscoveryRepo from '../service/discovery';
import following from '../context/actions/following';
import streamFeed from '../utils/getstream/streamer';
import useFeedService from './useFeedService';
import useResetContext from './context/useResetContext';
import TokenStorage, {ITokenEnum} from '../utils/storage/custom/tokenStorage';
import {Analytics} from '../libraries/analytics/firebaseAnalytics';
import {Context} from '../context';
import {NEWS_CACHE, PROFILE_CACHE, RECENT_SEARCH_TERMS} from '../utils/cache/constant';
import {InitialStartupAtom} from '../service/initialStartup';
import {channelListLocalAtom} from '../service/channelListLocal';
import {getDomains, getFollowedDomain} from '../service/domain';
import {getFollowing, getMyProfile} from '../service/profile';
import {getFollowingTopic} from '../service/topics';
import {getSpecificCache, saveToCache} from '../utils/cache';
import {setTimer} from '../context/actions/feeds';
import {setMyProfileAction} from '../context/actions/setMyProfileAction';
import {addIFollowByID, setNews} from '../context/actions/news';
import {traceMetricScreen} from '../libraries/performance/firebasePerformance';
import {useClientGetstream} from '../utils/getstream/ClientGetStram';
import useCoreFeed from '../screens/FeedScreen/hooks/useCoreFeed';
import StorageUtils from '../utils/storage';
import {COLORS} from '../utils/theme';

export const useInitialStartup = () => {
  const [, newsDispatch] = React.useContext(Context).news;
  const [, discoveryDispatch] = React.useContext(Context).discovery;
  const [, dispatchFeeds] = React.useContext(Context).feeds;
  const [, followingDispatch] = React.useContext(Context).following;
  const [profileState, dispatchProfile] = React.useContext(Context).profile;
  const initialStartup = useRecoilValue(InitialStartupAtom);
  const setInitialValue = useSetRecoilState(InitialStartupAtom);
  const setLocalChannelData = useSetRecoilState(channelListLocalAtom);
  const [clientState] = React.useContext(Context).client;
  const {client} = clientState;
  const perf = React.useRef(null);
  const timeoutSplashScreen = React.useRef(null);
  const [loadingUser, setLoadingUser] = React.useState(true);
  const getLocalChannelData = useLocalChannelsFirst(setLocalChannelData);
  const {resetAllContext, resetLocalDB} = useResetContext();
  const {checkCacheFeed} = useCoreFeed();
  const {getFeedChat} = useFeedService();
  const LIMIT_FIRST_NEWS = 3;
  const create = useClientGetstream();

  const doGetAccessToken = async () => {
    const token = TokenStorage.get(ITokenEnum.token);
    if (token) {
      setInitialValue({id: token});
    } else {
      resetAllContext();
      resetLocalDB();
    }
  };

  const callStreamFeed = async () => {
    const token = TokenStorage.get(ITokenEnum.token);
    if (token) {
      const clientFeed = streamFeed(token);
      try {
        const notif = clientFeed.feed('notification', profileState?.myProfile?.user_id, token);
        notif.subscribe(() => {
          getFeedChat();
        });
      } catch (e) {
        console.log('qweqwewqeq', e);
      }
    }
  };

  const getProfile = async () => {
    try {
      const storageData = StorageUtils.profileData.get();
      if (storageData) {
        const profileData = JSON.parse(storageData);
        setMyProfileAction(profileData, dispatchProfile);
      }
      const profile = await getMyProfile();
      StorageUtils.profileData.set(JSON.stringify(profile.data));
      setMyProfileAction(profile.data, dispatchProfile);
      setLoadingUser(false);
    } catch (e) {
      setLoadingUser(false);
    }
  };

  const getDomain = () => {
    getDomains(0, LIMIT_FIRST_NEWS)
      .then((response) => {
        saveToCache(NEWS_CACHE, response);
        setNews(response.data, newsDispatch);
      })
      .catch((e) => {
        throw new Error(e);
      });
  };

  const getDataFeeds = async (offset = 0) => {
    try {
      checkCacheFeed();
      setTimer(new Date(), dispatchFeeds);
    } catch (e) {
      throw new Error(e);
    }
  };

  const getDiscoveryData = async () => {
    try {
      DiscoveryRepo.fetchInitialDiscoveryTopics().then((discoveryInitialTopicResponse) => {
        DiscoveryAction.setDiscoveryInitialTopics(
          discoveryInitialTopicResponse.suggestedTopics,
          discoveryDispatch
        );
      });
      DiscoveryRepo.fetchInitialDiscoveryUsers().then((discoveryInitialUserResponse) => {
        DiscoveryAction.setDiscoveryInitialUsers(
          discoveryInitialUserResponse.suggestedUsers,
          discoveryDispatch
        );
      });
      DiscoveryRepo.fetchInitialDiscoveryDomains().then((discoveryInitialDomainResponse) => {
        DiscoveryAction.setDiscoveryInitialDomains(
          discoveryInitialDomainResponse.suggestedDomains,
          discoveryDispatch
        );
      });

      getFollowingTopic().then((response) => {
        following.setFollowingTopics(response.data, followingDispatch);
      });

      getFollowing().then((response) => {
        following.setFollowingUsers(response.data, followingDispatch);
      });

      getFollowedDomain().then((response) => {
        following.setFollowingDomain(response.data.data, followingDispatch);
        response.data.data.forEach((item) => {
          addIFollowByID(
            {
              domain_id_followed: item.domain_id_followed
            },
            newsDispatch
          );
        });
      });

      const recentSearchTermsResponse = await AsyncStorage.getItem(RECENT_SEARCH_TERMS);
      if (recentSearchTermsResponse) {
        DiscoveryAction.setDiscoveryRecentSearch(
          JSON.parse(recentSearchTermsResponse),
          discoveryDispatch
        );
      }
    } catch (e) {
      if (__DEV__) {
        console.log('error');
        console.log(e);
      }
      throw new Error(e);
    }
  };

  React.useEffect(() => {
    // logging section
    traceMetricScreen('loading_splashscreen').then((fnCallback) => {
      perf.current = fnCallback;
    });
    Analytics.logEvent('splashscreen_startup');
    Analytics.trackingScreen('splashscreen');

    LogBox.ignoreAllLogs();

    // statusbar
    if (Platform.OS === 'android') StatusBar.setBackgroundColor(COLORS.almostBlack);
    StatusBar.setBarStyle('dark-content', true);

    doGetAccessToken();
    getLocalChannelData();

    getSpecificCache(PROFILE_CACHE, (res) => {
      if (res) {
        setMyProfileAction(res, dispatchProfile);
        setLoadingUser(false);
      }
    });

    return async () => {
      if (timeoutSplashScreen.current) {
        clearTimeout(timeoutSplashScreen.current);
      }
      await client?.disconnectUser();
    };
  }, []);

  React.useEffect(() => {
    if (profileState) {
      callStreamFeed();
    }
  }, [JSON.stringify(profileState)]);

  React.useEffect(() => {
    if (initialStartup.id !== null && initialStartup.id !== '') {
      getDiscoveryData();
      getFeedChat();
      getDomain();
      getDataFeeds();
      getProfile();

      timeoutSplashScreen.current = setTimeout(() => {
        SplashScreen.hide();

        if (perf.current) {
          perf.current.stop();
        }
        create();
      }, 700);
    } else {
      timeoutSplashScreen.current = setTimeout(() => {
        SplashScreen.hide();

        if (perf.current) {
          perf.current.stop();
        }
      }, 700);
    }
  }, [initialStartup]);

  return {
    loadingUser
  };
};
