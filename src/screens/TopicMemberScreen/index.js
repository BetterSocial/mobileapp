import * as React from 'react';
import {Animated, ScrollView, StyleSheet, Platform} from 'react-native';
import {useRoute} from '@react-navigation/native';
import axios from 'axios';

import {SafeAreaProvider, useSafeAreaInsets} from 'react-native-safe-area-context';
import ShareUtils from '../../utils/share';
import dimen from '../../utils/dimen';
import {getAllMemberTopic} from '../../service/topics';
import {withInteractionsManaged} from '../../components/WithInteractionManaged';
import {colors} from '../../utils/colors';
import StringConstant from '../../utils/string/StringConstant';
import UsersFragment from '../DiscoveryScreenV2/fragment/UsersFragment';
import {Context} from '../../context';
import NavHeader from '../TopicPageScreen/elements/NavHeader';

const styles = StyleSheet.create({
  parentContainer: {
    flex: 1
  },
  fragmentContainer: {
    height: '100%',
    backgroundColor: colors.white
  },
  fragmentContentContainer: {
    // flexGrow: 1,
    backgroundColor: 'white'
  }
});

const TopicMemberScreen = () => {
  const route = useRoute();
  const {top} = useSafeAreaInsets();
  const topicName = route?.params?.topicName;
  const topicDetail = route?.params?.topicDetail;
  const getTopicDetail = route?.params?.getTopicDetail;
  const [isFollow, setIsFollow] = React.useState(route?.params?.isFollow);
  const [memberCount, setMemberCount] = React.useState(route?.params?.memberCount);

  const [profile] = React.useContext(Context).profile;
  const [isInitialLoading, setIsInitialLoading] = React.useState(true);
  const [headerHide, setHeaderHide] = React.useState(false);
  const [searchHeight, setSearchHeight] = React.useState(0);
  const [searchText, setSearchText] = React.useState('');
  const [initalMember, setInitialMember] = React.useState([]);
  const [topicDataFollowedUsers, setTopicDataFollowedUsers] = React.useState([]);
  const [topicDataUnfollowedUsers, setTopicDataUnfollowedUsers] = React.useState([]);
  const [isFocus, setIsFocus] = React.useState(true);
  const [isFirstTimeOpen, setIsFirstTimeOpen] = React.useState(true);
  const cancelTokenRef = React.useRef(axios.CancelToken.source());
  const scrollY = React.useRef(new Animated.Value(0)).current;

  const [isLoadingDiscovery, setIsLoadingDiscovery] = React.useState({
    user: false
  });

  const pathCover = topicDetail?.cover_path || null;
  const positionTop = Platform.OS === 'ios' ? top : 0;

  const navigationHeight = pathCover
    ? dimen.size.TOPIC_FEED_NAVIGATION_HEIGHT_COVER
    : dimen.size.TOPIC_FEED_NAVIGATION_HEIGHT;
  const headerShowHeight =
    navigationHeight + dimen.size.TOPIC_FEED_HEADER_HEIGHT + positionTop + searchHeight;
  const headerHideHeight = dimen.size.TOPIC_FEED_NAVIGATION_HEIGHT2 + positionTop + searchHeight;

  const animatedHeight = scrollY.interpolate({
    inputRange: [0, headerHideHeight],
    outputRange: [headerShowHeight, headerHideHeight],
    extrapolate: 'clamp'
  });

  const opacityAnimationHeader = scrollY.interpolate({
    inputRange: [0, 100],
    outputRange: [1, 0],
    extrapolate: 'clamp'
  });

  React.useEffect(() => {
    const listener = scrollY.addListener(({value}) => {
      if (value >= 0 && value <= headerHideHeight) {
        setHeaderHide(false);
      } else if (value >= headerHideHeight) {
        setHeaderHide(true);
      }
    });

    return () => {
      scrollY.removeListener(listener);
    };
  }, []);

  const handleScroll = Animated.event([{nativeEvent: {contentOffset: {y: scrollY}}}], {
    useNativeDriver: false
  });

  const fetchMember = async (text = '') => {
    setIsLoadingDiscovery({user: true});
    let query = `?name=${topicName}`;
    if (text.length > 2) {
      query = `?name=${topicName}&search=${text}`;
    }

    const result = await getAllMemberTopic(query);
    if (result.code === 200) {
      const newDataFollowed = result.data
        .filter((item) => item.is_following && profile.myProfile.user_id !== item.user_id)
        .map((data) => ({
          ...data,
          name: data.username,
          image: data.profile_pic_path,
          description: null
        }));
      const newDataUnfollowed = result.data
        .filter((item) => !item.is_following && profile.myProfile.user_id !== item.user_id)
        .map((data) => ({
          ...data,
          name: data.username,
          image: data.profile_pic_path,
          description: null
        }));
      if (text) {
        setTopicDataFollowedUsers(newDataFollowed);
        setTopicDataUnfollowedUsers(newDataUnfollowed);
      } else {
        setInitialMember([...newDataFollowed, ...newDataUnfollowed]);
      }
      setIsLoadingDiscovery({user: false});
    }
    setIsInitialLoading(false);
  };

  const initialData = async () => {
    try {
      setIsInitialLoading(true);
      fetchMember();
    } catch (error) {
      if (__DEV__) {
        console.log(error);
      }
    }
  };

  React.useEffect(() => {
    initialData();
  }, []);

  const onCommunityShare = () => {
    ShareUtils.shareCommunity(topicName);
  };

  const onTokenCancel = () => {
    cancelTokenRef?.current?.cancel();
    cancelTokenRef.current = axios.CancelToken.source();
  };

  return (
    <SafeAreaProvider forceInset={{top: 'always'}} style={styles.parentContainer}>
      <NavHeader
        domain={topicName}
        animatedHeight={animatedHeight}
        onShareCommunity={onCommunityShare}
        isHeaderHide={headerHide}
        opacityHeaderAnimation={opacityAnimationHeader}
        hideSeeMember={true}
        topicDetail={topicDetail}
        memberCount={memberCount}
        setMemberCount={setMemberCount}
        setIsFollow={setIsFollow}
        isFollow={isFollow}
        getTopicDetail={getTopicDetail}
        hasSearch={true}
        searchText={searchText}
        setSearchText={setSearchText}
        setDiscoveryLoadingData={setIsLoadingDiscovery}
        isFocus={isFocus}
        setIsFocus={setIsFocus}
        fetchDiscoveryData={fetchMember}
        onCancelToken={onTokenCancel}
        placeholderText={StringConstant.topicMemberPlaceholder}
        setIsFirstTimeOpen={setIsFirstTimeOpen}
        getSearchLayout={setSearchHeight}
      />
      <ScrollView
        decelerationRate="fast"
        scrollEventThrottle={1}
        style={styles.fragmentContainer}
        contentContainerStyle={[styles.fragmentContentContainer]}
        keyboardShouldPersistTaps="handled"
        keyboardDismissMode="on-drag"
        removeClippedSubviews={true}
        onScroll={handleScroll}>
        <UsersFragment
          isLoadingDiscoveryUser={isLoadingDiscovery.user}
          isFirstTimeOpen={isFirstTimeOpen}
          initialUsers={initalMember}
          setInitialUsers={setInitialMember}
          followedUsers={topicDataFollowedUsers}
          unfollowedUsers={topicDataUnfollowedUsers}
          setFollowedUsers={setTopicDataFollowedUsers}
          setUnfollowedUsers={setTopicDataUnfollowedUsers}
          setIsFirstTimeOpen={setIsFirstTimeOpen}
          setSearchText={setSearchText}
          withoutRecent={true}
        />
      </ScrollView>
    </SafeAreaProvider>
  );
};
export default TopicMemberScreen;
