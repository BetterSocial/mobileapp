import * as React from 'react';
import axios from 'axios';
import {Keyboard, Platform, ScrollView, StatusBar, StyleSheet} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';

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

// const { height } = Dimensions.get('screen');

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
  // const tabs = ['Users', 'Communities', 'Domains', 'News'];

  const [discoveryData, discoveryDispatch] = React.useContext(Context).discovery;
  const [profileState] = React.useContext(Context).profile;
  const cancelTokenRef = React.useRef(axios.CancelToken.source());

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
    const cancelToken = cancelTokenRef?.current?.token;
    DiscoveryRepo.fetchDiscoveryDataUser(text, {cancelToken}).then(async (data) => {
      if (data.success) {
        setDiscoveryDataFollowedUsers(data?.followedUsers || []);
        setDiscoveryDataUnfollowedUsers(data?.unfollowedUsers || []);
      }
      setIsLoadingDiscovery((prevState) => ({
        ...prevState,
        user: false
      }));
    });

    DiscoveryRepo.fetchDiscoveryDataDomain(text, {cancelToken}).then(async (data) => {
      if (data.success) {
        setDiscoveryDataFollowedDomains(data?.followedDomains || []);
        setDiscoveryDataUnfollowedDomains(data?.unfollowedDomains || []);
      }

      setIsLoadingDiscovery((prevState) => ({
        ...prevState,
        domain: false
      }));
    });

    DiscoveryRepo.fetchDiscoveryDataTopic(text, {cancelToken}).then(async (data) => {
      if (data.success) {
        setDiscoveryDataFollowedTopics(data?.followedTopic);
        setDiscoveryDataUnfollowedTopics(data?.unfollowedTopic);
      }

      setIsLoadingDiscovery((prevState) => ({
        ...prevState,
        topic: false
      }));
    });

    DiscoveryRepo.fetchDiscoveryDataNews(text, {cancelToken}).then(async (data) => {
      if (data.success) {
        setDiscoveryDataNews(data?.news);
      }

      setIsLoadingDiscovery((prevState) => ({
        ...prevState,
        news: false
      }));
    });
  };

  React.useEffect(() => {
    // if (route.name === 'Followings') {
    setTabs({
      Users: discoveryData.initialUsers.filter((user) => user.user_id_follower !== null).length,
      Communities: discoveryData.initialTopics.filter((user) => user.user_id_follower !== null)
        .length,
      Domains: discoveryData.initialDomains.filter((user) => user.user_id_follower !== null).length,
      News: 0
    });
    console.log();
    // }
  }, [discoveryData]);

  const onCancelToken = () => {
    cancelTokenRef?.current?.cancel();
    cancelTokenRef.current = axios.CancelToken.source();
  };

  // React.useEffect(() => {
  //     if (discoverySearchBarText.length > 1) DiscoveryAction.setDiscoveryFirstTimeOpen(false, discoveryDispatch)
  // }, [discoverySearchBarText])

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
      <Search
        searchText={searchText}
        setSearchText={setSearchText}
        setDiscoveryLoadingData={setIsLoadingDiscovery}
        isFocus={isFocus}
        setIsFocus={setIsFocus}
        setIsFirstTimeOpen={setIsFirstTimeOpen}
        fetchDiscoveryData={fetchDiscoveryData}
        onCancelToken={onCancelToken}
        placeholderText={
          route.name === 'Followings' || route.name === 'Followers'
            ? profileState.navbarTitle
            : undefined
        }
      />
      {route.name !== 'Followers' && (
        <DiscoveryTab
          selectedScreen={selectedScreen}
          onChangeScreen={(index) => setSelectedScreen(index)}
          tabs={tabs}
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
  }
});

export default withInteractionsManagedNoStatusBar(DiscoveryScreenV2);
// export default React.memo(DiscoveryScreenV2)

const DiscoveryContainer = ({children}) => {
  if (Platform.OS === 'ios') return <>{children}</>;

  return <SafeAreaView style={{flex: 1}}>{children}</SafeAreaView>;
};
