import * as React from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';
import {SafeAreaView} from 'react-native-safe-area-context';
import {StatusBar, StyleSheet} from 'react-native';
import {useNavigation} from '@react-navigation/core';

import DiscoveryAction from '../../context/actions/discoveryAction';
import DiscoveryRepo from '../../service/discovery';
import DiscoveryTab from './elements/DiscoveryTab';
import DomainFragment from './fragment/DomainFragment';
import FollowingAction from '../../context/actions/following';
import NewsFragment from './fragment/NewsFragment';
import Search from './elements/Search';
import TopicFragment from './fragment/TopicFragment';
import UsersFragment from './fragment/UsersFragment';
import useDiscoveryScreenAnalyticsHook from '../../libraries/analytics/useDiscoveryScreenAnalyticsHook';
import {COLORS} from '../../utils/theme';
import {Context} from '../../context';
import {
  DISCOVERY_TAB_DOMAINS,
  DISCOVERY_TAB_NEWS,
  DISCOVERY_TAB_TOPICS,
  DISCOVERY_TAB_USERS
} from '../../utils/constants';
import {Header} from '../../components';
import {fonts} from '../../utils/fonts';

const DiscoveryScreenV2 = ({route}) => {
  const {tab} = route.params;
  const [selectedScreen, setSelectedScreen] = React.useState(tab || 0);
  const [isLoadingDiscovery, setIsLoadingDiscovery] = React.useState({
    user: false,
    topic: false,
    domain: false,
    news: false
  });
  const [discoveryDataFollowedTopics, setDiscoveryDataFollowedTopics] = React.useState([]);
  const [discoveryDataUnfollowedTopics, setDiscoveryDataUnfollowedTopics] = React.useState([]);
  const [discoveryDataFollowedDomains, setDiscoveryDataFollowedDomains] = React.useState([]);
  const [discoveryDataUnfollowedDomains, setDiscoveryDataUnfollowedDomains] = React.useState([]);
  const [discoveryDataNews, setDiscoveryDataNews] = React.useState([]);
  const [searchText, setSearchText] = React.useState('');
  const [isFocus, setIsFocus] = React.useState(true);
  const [isFirstTimeOpen, setIsFirstTimeOpen] = React.useState(true);
  const [tabs, setTabs] = React.useState({Users: 0, Communities: 0, Domains: 0, News: 0});

  const [discoveryData, discoveryDispatch] = React.useContext(Context).discovery;
  const [profileState] = React.useContext(Context).profile;
  const cancelTokenRef = React.useRef(axios.CancelToken.source());
  const [, followingDispatch] = React.useContext(Context).following;
  const [userPage, setUserPage] = React.useState({
    currentPage: 1,
    limitPage: 1
  });
  const [topicPage, setTopicPage] = React.useState({
    currentPage: 1,
    limitPage: 1
  });
  const [domainPage, setDomainPage] = React.useState({
    currentPage: 1,
    limitPage: 1
  });

  const navigation = useNavigation();
  const eventTrack = useDiscoveryScreenAnalyticsHook(selectedScreen, setSelectedScreen);
  const {
    common: {
      onSearchCommunityPressed,
      onBackButtonPressed,
      onTabClicked,
      onCommonSearchBarDeletedClicked
    }
  } = eventTrack;

  React.useEffect(() => {
    const unsubscribe = () => {
      DiscoveryAction.setDiscoveryFirstTimeOpen(true, discoveryDispatch);
      DiscoveryAction.setDiscoveryFocus(true, discoveryDispatch);
    };

    return unsubscribe;
  }, []);

  const fetchDiscoveryDataUserOnly = async (text) => {
    const fetchDiscoveryInitialUsers = async () => {
      const initialData = await DiscoveryRepo.fetchInitialDiscoveryUsers(
        50,
        parseInt(userPage.currentPage, 10)
      );
      setUserPage({
        currentPage: initialData.page,
        totalPage: initialData.total_page
      });
      DiscoveryAction.setDiscoveryInitialUsers(
        [...discoveryData.initialUsers, ...initialData.suggestedUsers],
        discoveryDispatch
      );
    };

    const fetchDiscoveryDataUser = async () => {
      try {
        const cancelToken = cancelTokenRef?.current?.token;
        const data = await DiscoveryRepo.fetchDiscoveryDataUser(text, false, {cancelToken});
        if (data.success) {
          const followedUsers =
            data?.followedUsers?.map((item) => ({
              ...item,
              following: item.user_id_follower !== null
            })) || [];

          const unfollowedUsers =
            data?.unfollowedUsers?.map((item) => ({
              ...item,
              following: item.user_id_follower !== null
            })) || [];

          DiscoveryAction.setNewFollowedUsers(followedUsers, discoveryDispatch);
          DiscoveryAction.setNewUnfollowedUsers(unfollowedUsers, discoveryDispatch);
        }
      } catch (e) {
        console.log('e', e);
      } finally {
        setIsLoadingDiscovery((prevState) => ({
          ...prevState,
          user: false
        }));
      }
    };

    if (text === undefined) {
      await fetchDiscoveryInitialUsers();
    } else {
      await fetchDiscoveryDataUser();
    }
  };

  const fetchDiscoveryDataDomainOnly = async (text) => {
    const fetchDiscoveryInitialDomains = async () => {
      const initialData = await DiscoveryRepo.fetchInitialDiscoveryDomains(
        50,
        parseInt(domainPage.currentPage, 10)
      );
      setDomainPage({
        currentPage: initialData.page,
        totalPage: initialData.total_page
      });
      FollowingAction.setFollowingDomain(
        [...discoveryData.initialDomains, ...initialData.suggestedDomains],
        followingDispatch
      );
      DiscoveryAction.setDiscoveryInitialDomains(
        [...discoveryData.initialDomains, ...initialData.suggestedDomains],
        discoveryDispatch
      );
    };

    const fetchDiscoveryDataDomain = async () => {
      const cancelToken = cancelTokenRef?.current?.token;
      const data = await DiscoveryRepo.fetchDiscoveryDataDomain(text, {cancelToken});
      if (data.success) {
        setDiscoveryDataFollowedDomains(data?.followedDomains || []);
        setDiscoveryDataUnfollowedDomains(data?.unfollowedDomains || []);
      }
      setIsLoadingDiscovery((prevState) => ({
        ...prevState,
        domain: false
      }));
    };

    if (text === undefined) {
      await fetchDiscoveryInitialDomains();
    } else {
      await fetchDiscoveryDataDomain();
    }
  };

  const fetchDiscoveryDataTopicOnly = async (text) => {
    const fetchDiscoveryInitialTopics = async () => {
      const initialData = await DiscoveryRepo.fetchInitialDiscoveryTopics(
        50,
        parseInt(topicPage.currentPage, 10)
      );
      setTopicPage({
        currentPage: initialData.page,
        totalPage: initialData.total_page
      });
      DiscoveryAction.setDiscoveryInitialTopics(
        [...discoveryData.initialTopics, ...initialData.suggestedTopics],
        discoveryDispatch
      );
    };

    const fetchDiscoveryDataTopic = async () => {
      const cancelToken = cancelTokenRef?.current?.token;
      const data = await DiscoveryRepo.fetchDiscoveryDataTopic(text, {cancelToken});
      if (data.success) {
        setDiscoveryDataFollowedTopics(data?.followedTopic);
        setDiscoveryDataUnfollowedTopics(data?.unfollowedTopic);
      }
      setIsLoadingDiscovery((prevState) => ({
        ...prevState,
        topic: false
      }));
    };

    if (text === undefined) {
      await fetchDiscoveryInitialTopics();
    } else {
      await fetchDiscoveryDataTopic();
    }
  };

  const fetchDiscoveryDataNewsOnly = async (text) => {
    const fetchDiscoveryDataNews = async () => {
      const cancelToken = cancelTokenRef?.current?.token;
      const data = await DiscoveryRepo.fetchDiscoveryDataNews(text, {cancelToken});
      if (data.success) {
        setDiscoveryDataNews(data?.news);
      }
      setIsLoadingDiscovery((prevState) => ({
        ...prevState,
        news: false
      }));
    };

    await fetchDiscoveryDataNews();
  };

  const fetchDiscoveryData = async (text) => {
    if (text !== undefined) {
      setIsFirstTimeOpen(false);
    }

    await Promise.all([
      fetchDiscoveryDataUserOnly(text),
      fetchDiscoveryDataDomainOnly(text),
      fetchDiscoveryDataTopicOnly(text),
      fetchDiscoveryDataNewsOnly(text)
    ]);
  };

  React.useEffect(() => {
    setTabs({
      Users: discoveryData.initialUsers.filter((user) =>
        user.following !== undefined ? user.following : user.user_id_follower !== null
      ).length,
      Communities: discoveryData.initialTopics.filter((user) =>
        user.following !== undefined ? user.following : user.user_id_follower !== null
      ).length,
      Domains: discoveryData.initialDomains.filter((user) =>
        user.following !== undefined ? user.following : user.user_id_follower !== null
      ).length,
      News: 0
    });
  }, [discoveryData]);

  const onCancelToken = () => {
    cancelTokenRef?.current?.cancel();
    cancelTokenRef.current = axios.CancelToken.source();
  };

  const RenderFragment = (() => {
    if (selectedScreen === DISCOVERY_TAB_USERS)
      return (
        <UsersFragment
          isLoadingDiscoveryUser={isLoadingDiscovery.user}
          setIsLoadingDiscovery={setIsLoadingDiscovery}
          hidden={selectedScreen !== DISCOVERY_TAB_USERS}
          isFirstTimeOpen={isFirstTimeOpen}
          setIsFirstTimeOpen={setIsFirstTimeOpen}
          followedUsers={discoveryData?.followedUsers || []}
          unfollowedUsers={discoveryData?.unfollowedUsers || []}
          setSearchText={setSearchText}
          fetchData={fetchDiscoveryData}
          fetchSpecificData={fetchDiscoveryDataUserOnly}
          searchText={searchText}
          withoutRecent={route.name === 'Followings'}
          isUser={true}
          eventTrack={{
            common: {
              onCommonClearRecentSearch: eventTrack.common.onCommonClearRecentSearch,
              onCommonRecentItemClicked: eventTrack.common.onCommonRecentItemClicked
            },
            user: {
              onUserPageOpened: eventTrack.user.onUserPageOpened,
              onUserPageFollowButtonClicked: eventTrack.user.onUserPageFollowButtonClicked,
              onUserPageUnfollowButtonClicked: eventTrack.user.onUserPageUnfollowButtonClicked,
              onUserPageDMButtonClicked: eventTrack.user.onUserPageDMButtonClicked
            }
          }}
        />
      );

    if (selectedScreen === DISCOVERY_TAB_TOPICS)
      return (
        <TopicFragment
          isLoadingDiscoveryTopic={isLoadingDiscovery.topic}
          hidden={selectedScreen !== DISCOVERY_TAB_TOPICS}
          isFirstTimeOpen={isFirstTimeOpen}
          setIsFirstTimeOpen={setIsFirstTimeOpen}
          followedTopic={discoveryDataFollowedTopics}
          unfollowedTopic={discoveryDataUnfollowedTopics}
          setFollowedTopic={setDiscoveryDataFollowedTopics}
          setUnfollowedTopic={setDiscoveryDataUnfollowedTopics}
          setSearchText={setSearchText}
          fetchData={fetchDiscoveryData}
          fetchSpecificData={fetchDiscoveryDataTopicOnly}
          searchText={searchText}
          withoutRecent={route.name === 'Followings'}
        />
      );

    if (selectedScreen === DISCOVERY_TAB_DOMAINS)
      return (
        <DomainFragment
          isLoadingDiscoveryDomain={isLoadingDiscovery.domain}
          hidden={selectedScreen !== DISCOVERY_TAB_DOMAINS}
          isFirstTimeOpen={isFirstTimeOpen}
          setIsFirstTimeOpen={setIsFirstTimeOpen}
          followedDomains={discoveryDataFollowedDomains}
          unfollowedDomains={discoveryDataUnfollowedDomains}
          setFollowedDomains={setDiscoveryDataFollowedDomains}
          setUnfollowedDomains={setDiscoveryDataUnfollowedDomains}
          setSearchText={setSearchText}
          fetchData={fetchDiscoveryData}
          fetchSpecificData={fetchDiscoveryDataDomainOnly}
          searchText={searchText}
          withoutRecent={route.name === 'Followings'}
        />
      );

    if (selectedScreen === DISCOVERY_TAB_NEWS)
      return (
        <NewsFragment
          isLoadingDiscoveryNews={isLoadingDiscovery.news}
          hidden={selectedScreen !== DISCOVERY_TAB_NEWS}
          isFirstTimeOpen={isFirstTimeOpen}
          setIsFirstTimeOpen={setIsFirstTimeOpen}
          setSearchText={setSearchText}
          news={discoveryDataNews}
          fetchSpecificData={fetchDiscoveryDataNewsOnly}
        />
      );
    return null;
  })();

  return (
    <DiscoveryContainer>
      <StatusBar translucent={false} barStyle={'light-content'} />
      {route.name === 'Followings' ? (
        <Header
          title={
            profileState.navbarTitle === 'Search Users'
              ? "Who you're following"
              : profileState.navbarTitle
          }
          // containerStyle={styles.header}
          titleStyle={styles.headerTitle}
          onPress={() => {
            onBackButtonPressed();
            navigation.goBack();
          }}
          isCenter
        />
      ) : (
        <Search
          searchText={searchText}
          setSearchText={setSearchText}
          setDiscoveryLoadingData={setIsLoadingDiscovery}
          isFocus={isFocus}
          setIsFocus={setIsFocus}
          setIsFirstTimeOpen={setIsFirstTimeOpen}
          fetchDiscoveryData={fetchDiscoveryData}
          onCancelToken={onCancelToken}
          placeholderText={route.name === 'Followings' ? profileState.navbarTitle : undefined}
          eventTrack={{
            onSearchBarClicked: onSearchCommunityPressed,
            onBackButtonPressed,
            onTextCleared: () => {}
          }}
        />
      )}
      <DiscoveryTab selectedScreen={selectedScreen} onChangeScreen={onTabClicked} tabs={tabs} />
      {route.name === 'Followings' && (
        <Search
          searchText={searchText}
          setSearchText={setSearchText}
          setDiscoveryLoadingData={setIsLoadingDiscovery}
          isFocus={isFocus}
          setIsFocus={setIsFocus}
          setIsFirstTimeOpen={setIsFirstTimeOpen}
          fetchDiscoveryData={fetchDiscoveryData}
          onCancelToken={onCancelToken}
          placeholderText={route.name === 'Followings' ? profileState.navbarTitle : undefined}
          hideBackIcon
          eventTrack={{
            onSearchBarClicked: onSearchCommunityPressed,
            onBackButtonPressed,
            onTextCleared: onCommonSearchBarDeletedClicked
          }}
        />
      )}
      {RenderFragment}
    </DiscoveryContainer>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.almostBlack,
    flex: 1,
    paddingTop: 60
  },
  fragmentContainer: {
    height: '100%',
    backgroundColor: COLORS.almostBlack
  },
  fragmentContentContainer: {
    // height: '100%'
    flexGrow: 1
  },
  sectionTitle: {
    paddingHorizontal: 24,
    paddingVertical: 4,
    fontFamily: fonts.inter[600]
  },
  headerTitle: {fontSize: 16, fontFamily: fonts.inter[600], textAlign: 'center'}
});

DiscoveryScreenV2.propTypes = {
  route: PropTypes.object
};

export default DiscoveryScreenV2;

const DiscoveryContainer = ({children}) => {
  return (
    <SafeAreaView style={{flex: 1, backgroundColor: COLORS.almostBlack}}>{children}</SafeAreaView>
  );
};
