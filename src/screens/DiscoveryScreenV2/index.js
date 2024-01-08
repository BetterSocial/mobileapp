import * as React from 'react';
import axios from 'axios';
import {Keyboard, Platform, ScrollView, StatusBar, StyleSheet} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';

import {useNavigation} from '@react-navigation/core';
import PropTypes from 'prop-types';
import DiscoveryAction from '../../context/actions/discoveryAction';
import DiscoveryRepo from '../../service/discovery';
import DiscoveryTab from './elements/DiscoveryTab';
import DomainFragment from './fragment/DomainFragment';
import NewsFragment from './fragment/NewsFragment';
import Search from './elements/Search';
import TopicFragment from './fragment/TopicFragment';
import UsersFragment from './fragment/UsersFragment';
import {Context} from '../../context';
import {
  DISCOVERY_TAB_DOMAINS,
  DISCOVERY_TAB_NEWS,
  DISCOVERY_TAB_TOPICS,
  DISCOVERY_TAB_USERS
} from '../../utils/constants';
import {colors} from '../../utils/colors';
import {fonts} from '../../utils/fonts';
import {withInteractionsManagedNoStatusBar} from '../../components/WithInteractionManaged';
import FollowingAction from '../../context/actions/following';
import {Header} from '../../components';

const DiscoveryScreenV2 = ({route}) => {
  const {tab} = route.params;
  const [selectedScreen, setSelectedScreen] = React.useState(tab || 0);
  const [isLoadingDiscovery, setIsLoadingDiscovery] = React.useState({
    user: false,
    topic: false,
    domain: false,
    news: false
  });
  const [discoveryDataFollowedUsers, setDiscoveryDataFollowedUsers] = React.useState([]);
  const [discoveryDataUnfollowedUsers, setDiscoveryDataUnfollowedUsers] = React.useState([]);
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

  const navigation = useNavigation();

  const handleScroll = React.useCallback(() => {
    Keyboard.dismiss();
  });

  React.useEffect(() => {
    const unsubscribe = () => {
      DiscoveryAction.setDiscoveryFirstTimeOpen(true, discoveryDispatch);
      DiscoveryAction.setDiscoveryFocus(true, discoveryDispatch);
    };

    return unsubscribe;
  }, []);

  const fetchDiscoveryData = async (text) => {
    const fetchDiscoveryInitialUsers = async () => {
      const initialData = await DiscoveryRepo.fetchInitialDiscoveryUsers();
      DiscoveryAction.setDiscoveryInitialUsers(initialData.suggestedUsers, discoveryDispatch);
    };

    const fetchDiscoveryDataUser = async () => {
      const cancelToken = cancelTokenRef?.current?.token;
      const data = await DiscoveryRepo.fetchDiscoveryDataUser(text, {cancelToken});
      if (data.success) {
        setDiscoveryDataFollowedUsers(
          data?.followedUsers?.map((item) => ({
            ...item,
            following: item.user_id_follower !== null
          })) || []
        );
        setDiscoveryDataUnfollowedUsers(
          data?.unfollowedUsers?.map((item) => ({
            ...item,
            following: item.user_id_follower !== null
          })) || []
        );
      }
      setIsLoadingDiscovery((prevState) => ({
        ...prevState,
        user: false
      }));
    };

    const fetchDiscoveryInitialDomains = async () => {
      const initialData = await DiscoveryRepo.fetchInitialDiscoveryDomains();
      FollowingAction.setFollowingDomain(initialData.suggestedDomains, followingDispatch);
      DiscoveryAction.setDiscoveryInitialDomains(initialData.suggestedDomains, discoveryDispatch);
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

    const fetchDiscoveryInitialTopics = async () => {
      const initialData = await DiscoveryRepo.fetchInitialDiscoveryTopics();
      DiscoveryAction.setDiscoveryInitialTopics(initialData.suggestedTopics, discoveryDispatch);
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

    if (text === undefined) {
      await Promise.all([
        fetchDiscoveryInitialUsers(),
        fetchDiscoveryInitialDomains(),
        fetchDiscoveryInitialTopics(),
        fetchDiscoveryDataNews()
      ]);
    } else {
      await Promise.all([
        fetchDiscoveryDataUser(),
        fetchDiscoveryDataDomain(),
        fetchDiscoveryDataTopic(),
        fetchDiscoveryDataNews()
      ]);
    }
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

  const renderFragment = () => {
    if (selectedScreen === DISCOVERY_TAB_USERS)
      return (
        <UsersFragment
          isLoadingDiscoveryUser={isLoadingDiscovery.user}
          hidden={selectedScreen !== DISCOVERY_TAB_USERS}
          isFirstTimeOpen={isFirstTimeOpen}
          setIsFirstTimeOpen={setIsFirstTimeOpen}
          followedUsers={discoveryDataFollowedUsers}
          unfollowedUsers={discoveryDataUnfollowedUsers}
          setFollowedUsers={setDiscoveryDataFollowedUsers}
          setUnfollowedUsers={setDiscoveryDataUnfollowedUsers}
          setSearchText={setSearchText}
          fetchData={fetchDiscoveryData}
          searchText={searchText}
          withoutRecent={route.name === 'Followings'}
          isUser={true}
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
        />
      );

    return <></>;
  };
  return (
    <DiscoveryContainer>
      <StatusBar translucent={false} />
      {route.name === 'Followings' ? (
        <Header
          title={
            profileState.navbarTitle === 'Search Users'
              ? "Who you're following"
              : profileState.navbarTitle
          }
          // containerStyle={styles.header}
          titleStyle={styles.headerTitle}
          onPress={() => navigation.goBack()}
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
        />
      )}
      <DiscoveryTab
        selectedScreen={selectedScreen}
        onChangeScreen={(index) => setSelectedScreen(index)}
        tabs={tabs}
      />
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
        />
      )}
      <ScrollView
        style={styles.fragmentContainer}
        contentContainerStyle={styles.fragmentContentContainer}
        keyboardShouldPersistTaps="handled"
        onMomentumScrollBegin={handleScroll}>
        {renderFragment()}
      </ScrollView>
    </DiscoveryContainer>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    flex: 1,
    paddingTop: 60
  },
  fragmentContainer: {
    height: '100%',
    backgroundColor: colors.white
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

export default withInteractionsManagedNoStatusBar(DiscoveryScreenV2);

const DiscoveryContainer = ({children}) => {
  if (Platform.OS === 'ios') return <>{children}</>;

  return <SafeAreaView style={{flex: 1}}>{children}</SafeAreaView>;
};
