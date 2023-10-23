/* eslint-disable no-underscore-dangle */
import * as React from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {useNavigation, useRoute} from '@react-navigation/native';

import DiscoveryAction from '../../../context/actions/discoveryAction';
import DiscoveryTitleSeparator from '../elements/DiscoveryTitleSeparator';
import DomainList from '../elements/DiscoveryItemList';
import LoadingWithoutModal from '../../../components/LoadingWithoutModal';
import RecentSearch from '../elements/RecentSearch';
import StringConstant from '../../../utils/string/StringConstant';
import useChatClientHook from '../../../utils/getstream/useChatClientHook';
import useIsReady from '../../../hooks/useIsReady';
import {COLORS} from '../../../utils/theme';
import {Context} from '../../../context/Store';
import {colors} from '../../../utils/colors';
import {convertTopicNameToTopicPageScreenParam} from '../../../utils/string/StringUtils';
import {fonts} from '../../../utils/fonts';
import {getUserId} from '../../../utils/users';

const FROM_FOLLOWED_TOPIC = 'fromfollowedtopics';
const FROM_FOLLOWED_TOPIC_INITIAL = 'fromfollowedtopicsinitial';
const FROM_UNFOLLOWED_TOPIC = 'fromunfollowedtopics';
const FROM_UNFOLLOWED_TOPIC_INITIAL = 'fromunfollowedtopicsinitial';

const TopicFragment = ({
  isLoadingDiscoveryTopic = false,
  followedTopic = [],
  unfollowedTopic = [],
  isFirstTimeOpen,
  setIsFirstTimeOpen,
  setSearchText,
  setFollowedTopic,
  setUnfollowedTopic,
  fetchData = () => {},
  searchText
}) => {
  const [discovery, discoveryDispatch] = React.useContext(Context).discovery;
  const {followTopic} = useChatClientHook();

  const navigation = useNavigation();

  const [myId, setMyId] = React.useState('');

  const isReady = useIsReady();

  const route = useRoute();

  const topics = React.useMemo(() => {
    return discovery.initialTopics.map((item) => ({
      ...item,
      following: item.following !== undefined ? item.following : item.user_id_follower !== null
    }));
  }, [discovery.initialTopics]);

  React.useEffect(() => {
    const parseToken = async () => {
      const id = await getUserId();
      if (id) {
        setMyId(id);
      }
    };
    parseToken();
  }, []);

  const handleFollow = async (from, willFollow, item, index) => {
    if (from === FROM_FOLLOWED_TOPIC_INITIAL) {
      const newFollowedTopics = [...topics];
      newFollowedTopics[index].following = !!willFollow;
      DiscoveryAction.setDiscoveryInitialTopics(newFollowedTopics, discoveryDispatch);
    }

    if (from === FROM_UNFOLLOWED_TOPIC_INITIAL) {
      const newFollowedTopics = [...topics];
      newFollowedTopics[index].following = !!willFollow;

      DiscoveryAction.setDiscoveryInitialTopics(newFollowedTopics, discoveryDispatch);
    }

    if (from === FROM_FOLLOWED_TOPIC) {
      const newFollowedTopics = [...followedTopic];
      newFollowedTopics[index].following = !!willFollow;

      setFollowedTopic(newFollowedTopics);
    }

    if (from === FROM_UNFOLLOWED_TOPIC) {
      const newUnFollowedTopic = [...unfollowedTopic];
      newUnFollowedTopic[index].following = !!willFollow;

      setUnfollowedTopic(newUnFollowedTopic);
    }

    followTopic(item?.name);
    if (searchText.length > 0) fetchData();
  };

  const __handleOnTopicPress = (item) => {
    const navigationParam = {
      id: convertTopicNameToTopicPageScreenParam(item.name)
    };

    navigation.push('TopicPageScreen', navigationParam);
  };

  const __renderDiscoveryItem = (from, key, item, index) => (
    <View key={`${key}-${index}`} style={styles.domainContainer}>
      {route.name === 'Followings' && item.user_id_follower !== null && (
        <DomainList
          handleSetFollow={() => handleFollow(from, true, item, index)}
          handleSetUnFollow={() => handleFollow(from, false, item, index)}
          key={`followedTopic-${index}`}
          onPressBody={() => __handleOnTopicPress(item)}
          isHashtag
          item={{
            name: item.name,
            image: item.profile_pic_path,
            isunfollowed: !item.following,
            description: null
          }}
        />
      )}
      {route.name !== 'Followings' && (
        <DomainList
          handleSetFollow={() => handleFollow(from, true, item, index)}
          handleSetUnFollow={() => handleFollow(from, false, item, index)}
          key={`followedTopic-${index}`}
          onPressBody={() => __handleOnTopicPress(item)}
          isHashtag
          item={{
            name: item.name,
            image: item.profile_pic_path,
            isunfollowed: !item.following,
            description: null
          }}
        />
      )}
    </View>
  );

  const __renderTopicItems = () => {
    if (isFirstTimeOpen) {
      return [
        route.name !== 'Followings' && (
          <DiscoveryTitleSeparator key="topic-title-separator" text="Suggested Communities" />
        )
      ].concat(
        topics.map((item, index) =>
          __renderDiscoveryItem(FROM_FOLLOWED_TOPIC_INITIAL, 'followedTopicDiscovery', item, index)
        )
      );
    }

    return (
      <>
        {followedTopic.map((item, index) =>
          __renderDiscoveryItem(FROM_FOLLOWED_TOPIC, 'followedTopicDiscovery', item, index)
        )}

        {route.name !== 'Followings' && unfollowedTopic.length > 0 && followedTopic.length > 0 && (
          <View style={styles.unfollowedHeaderContainer}>
            <Text style={styles.unfollowedHeaders}>{StringConstant.discoveryMoreTopics}</Text>
          </View>
        )}
        {route.name !== 'Followings' &&
          unfollowedTopic.map((item, index) =>
            __renderDiscoveryItem(FROM_UNFOLLOWED_TOPIC, 'unfollowedTopicDiscovery', item, index)
          )}
      </>
    );
  };

  if (!isReady) return <></>;

  if (isLoadingDiscoveryTopic)
    return (
      <View style={styles.fragmentContainer}>
        <LoadingWithoutModal />
      </View>
    );
  if (followedTopic.length === 0 && unfollowedTopic.length === 0 && !isFirstTimeOpen)
    return (
      <View style={styles.noDataFoundContainer}>
        <Text style={styles.noDataFoundText}>No Communities found</Text>
      </View>
    );

  return (
    <View>
      <RecentSearch
        shown={isFirstTimeOpen}
        setSearchText={setSearchText}
        setIsFirstTimeOpen={setIsFirstTimeOpen}
      />
      {__renderTopicItems()}
    </View>
  );
};

const styles = StyleSheet.create({
  fragmentContainer: {
    flex: 1,
    backgroundColor: colors.white
  },
  noDataFoundContainer: {
    flex: 1,
    backgroundColor: colors.white,
    justifyContent: 'center'
  },
  noDataFoundText: {
    alignSelf: 'center',
    justifyContent: 'center',
    fontFamily: fonts.inter[600]
  },
  unfollowedHeaderContainer: {
    backgroundColor: COLORS.lightgrey,
    height: 40,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center'
  },
  unfollowedHeaders: {
    fontFamily: fonts.inter[600],
    marginLeft: 20
  }
});

export default TopicFragment;
