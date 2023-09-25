import * as React from 'react';
import {Animated, InteractionManager, ScrollView, StatusBar, StyleSheet} from 'react-native';
import {useNavigation, useRoute} from '@react-navigation/native';
import axios from 'axios';

import {SafeAreaProvider} from 'react-native-safe-area-context';
import ShareUtils from '../../utils/share';
import dimen from '../../utils/dimen';
import {getAllMemberTopic} from '../../service/topics';
import {withInteractionsManaged} from '../../components/WithInteractionManaged';
import {normalize} from '../../utils/fonts';
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

let lastDragYTopicMember = 0;

const TopicMemberScreen = (props) => {
  const route = useRoute();
  const navigation = useNavigation();
  const topicName = route?.params?.id;
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

  const offsetAnimation = React.useRef(new Animated.Value(0)).current;
  const opacityAnimation = React.useRef(new Animated.Value(0)).current;

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

  const showAnimationHeader = () => {
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
    setHeaderHide(false);
  };

  const handleOnScrollBeginDrag = (event) => {
    lastDragYTopicMember = event.nativeEvent.contentOffset.y;
  };

  const handleScrollEvent = React.useCallback(
    (event) => {
      const {y} = event.nativeEvent.contentOffset;
      const dy = y - lastDragYTopicMember;
      if (y <= 30) {
        showAnimationHeader();
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
        setHeaderHide(true);
      }
    },
    [offsetAnimation]
  );

  const onTokenCancel = () => {
    cancelTokenRef?.current?.cancel();
    cancelTokenRef.current = axios.CancelToken.source();
  };

  if (isInitialLoading) return null;
  return (
    <SafeAreaProvider forceInset={{top: 'always'}} style={styles.parentContainer}>
      <StatusBar barStyle="dark-content" translucent={false} />
      <NavHeader
        domain={topicName}
        onShareCommunity={onCommunityShare}
        isHeaderHide={headerHide}
        opacityAnimation={opacityAnimation}
        offsetAnimation={offsetAnimation}
        hideSeeMember={true}
        isInitialLoading={isInitialLoading}
      />
      <Search
        searchText={searchText}
        setSearchText={setSearchText}
        setDiscoveryLoadingData={setIsLoadingDiscovery}
        isFocus={isFocus}
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
        onScroll={handleScrollEvent}
        onScrollBeginDrag={handleOnScrollBeginDrag}>
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
