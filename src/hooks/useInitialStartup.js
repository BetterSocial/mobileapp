import React from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {LogBox, StatusBar} from 'react-native';
import {useLocalChannelsFirst} from 'stream-chat-react-native';
import SplashScreen from 'react-native-splash-screen';
import {useRecoilValue, useSetRecoilState} from 'recoil';
import {getDomains, getFollowedDomain} from '../service/domain';
import {getSpecificCache, saveToCache} from '../utils/cache';
import {FEEDS_CACHE, NEWS_CACHE, PROFILE_CACHE, RECENT_SEARCH_TERMS} from '../utils/cache/constant';
import {setNews} from '../context/actions/news';
import {getMainFeed} from '../service/post';
import {setMainFeeds, setTimer} from '../context/actions/feeds';
import {getUserId} from '../utils/users';
import {getFollowing, getMyProfile} from '../service/profile';
import following from '../context/actions/following';
import {getFollowingTopic} from '../service/topics';
import DiscoveryRepo from '../service/discovery';
import DiscoveryAction from '../context/actions/discoveryAction';
import {Context} from '../context';
import {setMyProfileAction} from '../context/actions/setMyProfileAction';
import {useClientGetstream} from '../utils/getstream/ClientGetStram';
import {getAccessToken} from '../utils/token';
import {getFeedNotification, setFeedChatsFromLocal} from '../service/feeds';
import streamFeed from '../utils/getstream/streamer';
import {traceMetricScreen} from '../libraries/performance/firebasePerformance';
import {Analytics} from '../libraries/analytics/firebaseAnalytics';
import {InitialStartupAtom} from '../service/initialStartup';
import {channelListLocalAtom} from '../service/channelListLocal';
import {feedChatAtom} from '../models/feeds/feedsNotification';

export const useInitialStartup = () => {
  const [, newsDispatch] = React.useContext(Context).news;
  const [, discoveryDispatch] = React.useContext(Context).discovery;
  const [feedsContext, dispatchFeeds] = React.useContext(Context).feeds;
  const [, followingDispatch] = React.useContext(Context).following;
  const [profileState, dispatchProfile] = React.useContext(Context).profile;
  const initialStartup = useRecoilValue(InitialStartupAtom);
  const setInitialValue = useSetRecoilState(InitialStartupAtom);
  const setLocalChannelData = useSetRecoilState(channelListLocalAtom);
  const setFeedChatData = useSetRecoilState(feedChatAtom);
  const [clientState] = React.useContext(Context).client;
  const {client} = clientState;
  const perf = React.useRef(null);
  const timeoutSplashScreen = React.useRef(null);
  const [loadingUser, setLoadingUser] = React.useState(true);
  const getLocalChannelData = useLocalChannelsFirst(setLocalChannelData);

  const LIMIT_FIRST_FEEDS = 1;
  const LIMIT_FIRST_NEWS = 3;
  const create = useClientGetstream();

  const doGetAccessToken = async () => {
    const accessToken = await getAccessToken();
    setInitialValue({id: accessToken.id});
  };

  const getFeedChat = async () => {
    const res = await getFeedNotification();
    if (res.success) {
      setFeedChatData(res.data);
      setFeedChatsFromLocal(res.data);
    }
  };

  const callStreamFeed = async () => {
    const token = await getAccessToken();
    if (token) {
      console.tron.log('msk');
      const clientFeed = streamFeed(token);
      const notif = clientFeed.feed('notification', profileState.user_id, token.id);
      notif.subscribe(() => {
        getFeedChat();
      });
    }
  };

  const getProfile = async () => {
    try {
      const selfUserId = await getUserId();
      const profile = await getMyProfile(selfUserId);
      saveToCache(PROFILE_CACHE, profile.data);
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
      const query = `?offset=${offset}&limit=${LIMIT_FIRST_FEEDS}`;
      const dataFeeds = await getMainFeed(query);
      if (dataFeeds.data.length > 0) {
        const {data} = dataFeeds;
        const dataWithDummy = [...data, {dummy: true}];
        let saveData = {
          offset: dataFeeds.offset,
          data: dataWithDummy
        };
        if (offset === 0) {
          setMainFeeds(dataWithDummy, dispatchFeeds);
          saveToCache(FEEDS_CACHE, saveData);
        } else {
          const clonedFeeds = [...feedsContext.feeds];
          clonedFeeds.splice(feedsContext.feeds.length - 1, 0, ...data);
          saveData = {
            ...saveData,
            data: clonedFeeds
          };
          setMainFeeds(clonedFeeds, dispatchFeeds);
          saveToCache(FEEDS_CACHE, saveData);
        }
      }
      setTimer(new Date(), dispatchFeeds);
    } catch (e) {
      throw new Error(e);
    }
  };

  const getDiscoveryData = async () => {
    const selfUserId = await getUserId();

    try {
      getFollowing(selfUserId).then((response) => {
        following.setFollowingUsers(response.data, followingDispatch);
      });

      getFollowedDomain().then((response) => {
        following.setFollowingDomain(response.data.data, followingDispatch);
      });

      getFollowingTopic().then((response) => {
        following.setFollowingTopics(response.data, followingDispatch);
      });

      const discoveryInitialUserResponse = await DiscoveryRepo.fetchInitialDiscoveryUsers();
      DiscoveryAction.setDiscoveryInitialUsers(
        discoveryInitialUserResponse.suggestedUsers,
        discoveryDispatch
      );

      const discoveryInitialTopicResponse = await DiscoveryRepo.fetchInitialDiscoveryTopics();
      DiscoveryAction.setDiscoveryInitialTopics(
        discoveryInitialTopicResponse.suggestedTopics,
        discoveryDispatch
      );

      const discoveryInitialDomainResponse = await DiscoveryRepo.fetchInitialDiscoveryDomains();
      DiscoveryAction.setDiscoveryInitialDomains(
        discoveryInitialDomainResponse.suggestedDomains,
        discoveryDispatch
      );

      const response = await AsyncStorage.getItem(RECENT_SEARCH_TERMS);
      if (!response) return;
      // setItems(JSON.parse(response))
      DiscoveryAction.setDiscoveryRecentSearch(JSON.parse(response), discoveryDispatch);
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
    StatusBar.setBackgroundColor('#ffffff');
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
    if (initialStartup.id !== null) {
      if (initialStartup.id !== '') {
        getFeedChat();
        getDomain();
        getDataFeeds();
        getDiscoveryData();
        getProfile();

        console.tron.log('check');
        timeoutSplashScreen.current = setTimeout(() => {
          SplashScreen.hide();

          if (perf.current) {
            perf.current.stop();
          }
          create();
        }, 700);
      }
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
