import * as React from 'react';
import {Animated, InteractionManager, ScrollView, StatusBar, StyleSheet} from 'react-native';
import {useNavigation, useRoute} from '@react-navigation/native';
import axios from 'axios';

import {SafeAreaProvider} from 'react-native-safe-area-context';
import ShareUtils from '../../utils/share';
import dimen from '../../utils/dimen';
import useChatClientHook from '../../utils/getstream/useChatClientHook';
import {getAllMemberTopic, getTopics, getUserTopic} from '../../service/topics';
import {withInteractionsManaged} from '../../components/WithInteractionManaged';
import {normalize} from '../../utils/fonts';
import Navigation from '../TopicPageScreen/elements/Navigation';
import Header from '../TopicPageScreen/elements/Header';
import {colors} from '../../utils/colors';
import Search from '../DiscoveryScreenV2/elements/Search';
import StringConstant from '../../utils/string/StringConstant';
import UsersFragment from '../DiscoveryScreenV2/fragment/UsersFragment';
import {Context} from '../../context';

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

let lastDragY = 0;

const TopicMemberScreen = (props) => {
  const route = useRoute();
  const navigation = useNavigation();
  const topicName = route?.params?.id;
  const [profile] = React.useContext(Context).profile;
  const [isInitialLoading, setIsInitialLoading] = React.useState(true);
  const [isHeaderHide, setIsHeaderHide] = React.useState(false);
  const [headerHeight, setHeaderHeight] = React.useState(0);

  const [searchText, setSearchText] = React.useState('');
  const [initalMember, setInitialMember] = React.useState([]);
  const [topicDataFollowedUsers, setTopicDataFollowedUsers] = React.useState([]);
  const [topicDataUnfollowedUsers, setTopicDataUnfollowedUsers] = React.useState([]);
  const [isFocus, setIsFocus] = React.useState(true);
  const [isFirstTimeOpen, setIsFirstTimeOpen] = React.useState(true);
  const cancelTokenRef = React.useRef(axios.CancelToken.source());

  const [isFollow, setIsFollow] = React.useState(false);
  const [topicDetail, setTopicDetail] = React.useState({});
  const interactionManagerRef = React.useRef(null);
  const interactionManagerAnimatedRef = React.useRef(null);

  const offsetAnimation = React.useRef(new Animated.Value(0)).current;
  const opacityAnimation = React.useRef(new Animated.Value(0)).current;

  const [isLoadingDiscovery, setIsLoadingDiscovery] = React.useState({
    user: false
  });

  const {followTopic} = useChatClientHook();

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
  };

  const initData = async () => {
    try {
      setIsInitialLoading(true);

      const query = `?name=${topicName}`;
      const resultGetUserTopic = await getUserTopic(query);
      if (resultGetUserTopic.data) {
        setIsFollow(true);
      }
      const resultTopicDetail = await getTopics(topicName);
      if (resultTopicDetail.data) {
        const detail = resultTopicDetail.data[0];
        setTopicDetail(detail);
      }
      fetchMember();
    } catch (error) {
      if (__DEV__) {
        console.log(error);
      }
    } finally {
      setIsInitialLoading(false);
    }
  };

  React.useEffect(() => {
    initData();
  }, []);

  const handleFollowTopic = async () => {
    try {
      const followed = await followTopic(topicName);
      setIsFollow(followed);
    } catch (error) {
      if (__DEV__) {
        console.log(error);
      }
    }
  };

  const onShareCommunity = () => {
    ShareUtils.shareCommunity(topicName);
  };

  React.useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      showHeaderAnimation();
    });

    return () => {
      if (interactionManagerRef.current) interactionManagerRef.current.cancel();
      if (interactionManagerAnimatedRef.current) interactionManagerAnimatedRef.current.cancel();

      unsubscribe();
    };
  }, [navigation]);

  const showHeaderAnimation = () => {
    interactionManagerRef.current = InteractionManager.runAfterInteractions(() => {
      Animated.timing(offsetAnimation, {
        toValue: 0,
        duration: 200,
        useNativeDriver: false
      }).start();
      Animated.timing(opacityAnimation, {
        toValue: 0,
        duration: 100,
        useNativeDriver: false
      }).start();
    });
    setIsHeaderHide(false);
  };

  const handleOnScrollBeginDrag = (event) => {
    lastDragY = event.nativeEvent.contentOffset.y;
  };

  const handleScrollEvent = React.useCallback(
    (event) => {
      const {y} = event.nativeEvent.contentOffset;
      const dy = y - lastDragY;
      if (y <= 30) {
        showHeaderAnimation();
      } else if (dy - 20 > 0) {
        interactionManagerAnimatedRef.current = InteractionManager.runAfterInteractions(() => {
          Animated.timing(offsetAnimation, {
            toValue: -(
              dimen.size.TOPIC_FEED_HEADER_HEIGHT +
              dimen.size.DISCOVERY_HEADER_HEIGHT +
              normalize(4)
            ),
            duration: 100,
            useNativeDriver: false
          }).start();
          Animated.timing(opacityAnimation, {
            toValue: 1,
            duration: 100,
            useNativeDriver: false
          }).start();
        });
        setIsHeaderHide(true);
      }
    },
    [offsetAnimation]
  );

  const saveHeaderhHeightHandle = (height) => {
    if (!headerHeight) {
      setHeaderHeight(Number(height));
    }
  };

  const onCancelToken = () => {
    cancelTokenRef?.current?.cancel();
    cancelTokenRef.current = axios.CancelToken.source();
  };

  if (isInitialLoading) return null;
  return (
    <SafeAreaProvider forceInset={{top: 'always'}} style={styles.parentContainer}>
      <StatusBar barStyle="dark-content" translucent={false} />
      <Navigation
        domain={topicName}
        onShareCommunity={onShareCommunity}
        onPress={() => handleFollowTopic()}
        isHeaderHide={isHeaderHide}
        animatedValue={opacityAnimation}
        detail={topicDetail}
        hideSeeMember={true}
        isFollow={isFollow}
      />
      <Header
        domain={topicName}
        onShareCommunity={onShareCommunity}
        onPress={() => handleFollowTopic()}
        isFollow={isFollow}
        getSearchLayout={saveHeaderhHeightHandle}
        animatedValue={offsetAnimation}
        detail={topicDetail}
        hideSeeMember={true}
      />
      <Search
        searchText={searchText}
        setSearchText={setSearchText}
        setDiscoveryLoadingData={setIsLoadingDiscovery}
        isFocus={isFocus}
        setIsFocus={setIsFocus}
        fetchDiscoveryData={fetchMember}
        onCancelToken={onCancelToken}
        placeholderText={StringConstant.topicMemberPlaceholder}
        setIsFirstTimeOpen={setIsFirstTimeOpen}
        hideBackIcon={true}
      />
      <ScrollView
        style={styles.fragmentContainer}
        contentContainerStyle={styles.fragmentContentContainer}
        keyboardShouldPersistTaps="handled"
        onScroll={handleScrollEvent}
        onScrollBeginDrag={handleOnScrollBeginDrag}>
        <UsersFragment
          isLoadingDiscoveryUser={isLoadingDiscovery.user}
          isFirstTimeOpen={isFirstTimeOpen}
          initialUsers={initalMember}
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
