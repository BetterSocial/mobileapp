import * as React from 'react';
import {
  Animated,
  InteractionManager,
  Keyboard,
  ScrollView,
  StyleSheet,
  Platform
} from 'react-native';
import {useNavigation, useRoute} from '@react-navigation/native';
import axios from 'axios';

import {SafeAreaProvider, useSafeAreaInsets} from 'react-native-safe-area-context';
import ShareUtils from '../../utils/share';
import dimen from '../../utils/dimen';
import {getAllMemberTopic} from '../../service/topics';
import {withInteractionsManaged} from '../../components/WithInteractionManaged';
import {colors} from '../../utils/colors';
import Search from '../DiscoveryScreenV2/elements/Search';
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
    flexGrow: 1
  }
});

const TopicMemberScreen = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const {top} = useSafeAreaInsets();
  const topicName = route?.params?.topicName;
  const topicDetail = route?.params?.topicDetail;
  const getTopicDetail = route?.params?.getTopicDetail;
  const [isFollow, setIsFollow] = React.useState(route?.params?.isFollow);
  const [memberCount, setMemberCount] = React.useState(route?.params?.memberCount);

  const [profile] = React.useContext(Context).profile;
  const [isInitialLoading, setIsInitialLoading] = React.useState(true);
  const [headerHide, setHeaderHide] = React.useState(false);

  const [searchText, setSearchText] = React.useState('');
  const [initalMember, setInitialMember] = React.useState([]);
  const [topicDataFollowedUsers, setTopicDataFollowedUsers] = React.useState([]);
  const [topicDataUnfollowedUsers, setTopicDataUnfollowedUsers] = React.useState([]);
  const [isFocus, setIsFocus] = React.useState(true);
  const [isFirstTimeOpen, setIsFirstTimeOpen] = React.useState(true);
  const cancelTokenRef = React.useRef(axios.CancelToken.source());

  const interactionManagerRef = React.useRef(null);
  const interactionManagerAnimatedRef = React.useRef(null);

  const opacityAnimationHeader = React.useRef(new Animated.Value(1)).current;

  const coverPath = topicDetail?.cover_path || null;
  const topPosition = Platform.OS === 'ios' ? top : 0;

  const animatedHeight = React.useRef(
    new Animated.Value(
      (coverPath
        ? dimen.size.TOPIC_FEED_NAVIGATION_HEIGHT_COVER
        : dimen.size.TOPIC_FEED_NAVIGATION_HEIGHT) +
        dimen.size.TOPIC_FEED_HEADER_HEIGHT +
        topPosition
    )
  ).current;

  const [isLoadingDiscovery, setIsLoadingDiscovery] = React.useState({
    user: false
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

  const showAnimationHeader = () => {
    interactionManagerRef.current = InteractionManager.runAfterInteractions(() => {
      Animated.timing(animatedHeight, {
        toValue:
          (coverPath
            ? dimen.size.TOPIC_FEED_NAVIGATION_HEIGHT_COVER
            : dimen.size.TOPIC_FEED_NAVIGATION_HEIGHT) +
          dimen.size.TOPIC_FEED_HEADER_HEIGHT +
          topPosition,
        duration: 100,
        useNativeDriver: false
      }).start();
      Animated.timing(opacityAnimationHeader, {
        toValue: 1,
        duration: 100,
        useNativeDriver: false
      }).start();
    });
    setHeaderHide(false);
  };

  React.useEffect(() => {
    showAnimationHeader();
  }, [coverPath]);

  React.useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      showAnimationHeader();
    });

    return () => {
      if (interactionManagerRef.current) interactionManagerRef.current.cancel();
      if (interactionManagerAnimatedRef.current) interactionManagerAnimatedRef.current.cancel();

      unsubscribe();
    };
  }, [navigation]);

  const handleScrollEvent = React.useCallback(
    (event) => {
      Keyboard.dismiss();
      const {y} = event.nativeEvent.contentOffset;
      if (y <= 15) {
        showAnimationHeader();
      } else {
        interactionManagerAnimatedRef.current = InteractionManager.runAfterInteractions(() => {
          Animated.timing(animatedHeight, {
            toValue: dimen.size.TOPIC_FEED_NAVIGATION_HEIGHT2 + topPosition,
            duration: 100,
            useNativeDriver: false
          }).start();
          Animated.timing(opacityAnimationHeader, {
            toValue: 0,
            duration: 100,
            useNativeDriver: false
          }).start();
        });
        setHeaderHide(true);
      }
    },
    [coverPath, animatedHeight]
  );

  const onTokenCancel = () => {
    cancelTokenRef?.current?.cancel();
    cancelTokenRef.current = axios.CancelToken.source();
  };

  if (isInitialLoading) return null;
  return (
    <SafeAreaProvider forceInset={{top: 'always'}} style={styles.parentContainer}>
      <NavHeader
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
      />
      <Search
        searchText={searchText}
        setSearchText={setSearchText}
        setDiscoveryLoadingData={setIsLoadingDiscovery}
        isFocus={isFocus}
        autoFocus={false}
        setIsFocus={setIsFocus}
        fetchDiscoveryData={fetchMember}
        onCancelToken={onTokenCancel}
        placeholderText={StringConstant.topicMemberPlaceholder}
        setIsFirstTimeOpen={setIsFirstTimeOpen}
        hideBackIcon={true}
      />
      <ScrollView
        style={styles.fragmentContainer}
        contentContainerStyle={styles.fragmentContentContainer}
        keyboardShouldPersistTaps="handled"
        onScroll={handleScrollEvent}>
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
export default withInteractionsManaged(TopicMemberScreen);
