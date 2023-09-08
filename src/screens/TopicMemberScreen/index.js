import * as React from 'react';
import {Animated, InteractionManager, ScrollView, StatusBar, StyleSheet} from 'react-native';
import {useNavigation, useRoute} from '@react-navigation/native';

import {SafeAreaProvider} from 'react-native-safe-area-context';
import ShareUtils from '../../utils/share';
import dimen from '../../utils/dimen';
import useChatClientHook from '../../utils/getstream/useChatClientHook';
import {getTopics, getUserTopic} from '../../service/topics';
import {withInteractionsManaged} from '../../components/WithInteractionManaged';
import {normalize} from '../../utils/fonts';
import Search from './elements/Search';
import MemberList from './elements/MemberList';
import Navigation from '../TopicPageScreen/elements/Navigation';
import Header from '../TopicPageScreen/elements/Header';
import {colors} from '../../utils/colors';

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
  console.log('props: ', props);
  const route = useRoute();
  const navigation = useNavigation();
  const topicName = route?.params?.id;
  const [loading, setLoading] = React.useState(false);
  const [isInitialLoading, setIsInitialLoading] = React.useState(true);
  const [isHeaderHide, setIsHeaderHide] = React.useState(false);
  const [headerHeight, setHeaderHeight] = React.useState(0);

  const [searchText, setSearchText] = React.useState('');
  const [discoveryDataFollowedUsers, setDiscoveryDataFollowedUsers] = React.useState([]);
  const [discoveryDataUnfollowedUsers, setDiscoveryDataUnfollowedUsers] = React.useState([]);

  const [isFollow, setIsFollow] = React.useState(false);
  const [topicDetail, setTopicDetail] = React.useState({});
  const interactionManagerRef = React.useRef(null);
  const interactionManagerAnimatedRef = React.useRef(null);

  const offsetAnimation = React.useRef(new Animated.Value(0)).current;
  const opacityAnimation = React.useRef(new Animated.Value(0)).current;

  const {followTopic} = useChatClientHook();

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
    } catch (error) {
      if (__DEV__) {
        console.log(error);
      }
    } finally {
      setIsInitialLoading(false);
      setLoading(false);
    }
  };

  React.useEffect(() => {
    initData();
  }, []);

  const handleFollowTopic = async () => {
    try {
      setLoading(true);
      const followed = await followTopic(topicName);
      setIsFollow(followed);
      setLoading(false);
    } catch (error) {
      if (__DEV__) {
        console.log(error);
      }
      setLoading(false);
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
        duration: 100,
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
      if (dy + 30 <= 0) {
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

  const handleOnMemberPress = (item) => {
    const navigationParam = {
      id: topicName
    };

    navigation.push('TopicMemberScreen', navigationParam);
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
      />
      <Header
        domain={topicName}
        onShareCommunity={onShareCommunity}
        onPress={() => handleFollowTopic()}
        isFollow={isFollow}
        getSearchLayout={saveHeaderhHeightHandle}
        animatedValue={offsetAnimation}
        detail={topicDetail}
        handleOnMemberPress={handleOnMemberPress}
        hideSeeMember={true}
      />
      <Search searchText={searchText} setSearchText={setSearchText} onContainerClicked={() => {}} />
      <ScrollView
        style={styles.fragmentContainer}
        contentContainerStyle={styles.fragmentContentContainer}
        keyboardShouldPersistTaps="handled"
        onScroll={handleScrollEvent}
        onScrollBeginDrag={handleOnScrollBeginDrag}>
        <MemberList
          isLoadingDiscoveryUser={loading}
          isFirstTimeOpen={false}
          followedUsers={discoveryDataFollowedUsers}
          unfollowedUsers={discoveryDataUnfollowedUsers}
          setFollowedUsers={setDiscoveryDataFollowedUsers}
          setUnfollowedUsers={setDiscoveryDataUnfollowedUsers}
          setSearchText={setSearchText}
          topicName={topicName}
        />
      </ScrollView>
    </SafeAreaProvider>
  );
};
export default withInteractionsManaged(TopicMemberScreen);
