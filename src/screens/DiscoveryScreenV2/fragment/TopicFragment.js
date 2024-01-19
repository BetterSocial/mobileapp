/* eslint-disable no-underscore-dangle */
import * as React from 'react';
import {FlatList, Keyboard, StyleSheet, Text, View} from 'react-native';
import {useNavigation, useRoute} from '@react-navigation/native';

import PropTypes from 'prop-types';
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
import {convertTopicNameToTopicPageScreenParam} from '../../../utils/string/StringUtils';
import {fonts} from '../../../utils/fonts';
import {getUserId} from '../../../utils/users';
import TopicsProfilePictureEmptyState from '../../../assets/icon/TopicsProfilePictureEmptyState';

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
  searchText,
  withoutRecent = false
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
  const newMapFollowedTopics = React.useMemo(() => {
    return followedTopic.map((item) => ({
      ...item,
      following: item.following !== undefined ? item.following : item.user_id_follower !== null
    }));
  }, [followedTopic]);
  const newMapUnfollowedTopics = React.useMemo(() => {
    return unfollowedTopic.map((item) => ({
      ...item,
      following: item.following !== undefined ? item.following : item.user_id_follower !== null
    }));
  }, [unfollowedTopic]);

  React.useEffect(() => {
    const parseToken = async () => {
      const id = await getUserId();
      if (id) {
        setMyId(id);
      }
    };
    parseToken();
  }, []);
  const handleScroll = React.useCallback(() => {
    Keyboard.dismiss();
  });

  const exhangeFollower = (newTopicLists, willFollow, topicId) => {
    const indexTopic = newTopicLists.findIndex((item) => item.topic_id === topicId);
    newTopicLists[indexTopic].following = !!willFollow;
    // newTopicLists[indexTopic].user_id_follower = myId;
    return newTopicLists[indexTopic];
  };

  const mapTopic = (newTopic) => {
    return discovery.initialTopics.map((topic) => {
      if (topic.topic_id === newTopic.topic_id) {
        return newTopic;
      }
      return topic;
    });
  };

  const handleTopic = (from, willFollow, item, index) => {
    if (from === FROM_FOLLOWED_TOPIC_INITIAL) {
      const newFollowedTopics = [...topics];
      const newTopic = exhangeFollower(newFollowedTopics, willFollow, item.topic_id);

      DiscoveryAction.setDiscoveryInitialTopics(mapTopic(newTopic), discoveryDispatch);
    }

    if (from === FROM_UNFOLLOWED_TOPIC_INITIAL) {
      const newFollowedTopics = [...topics];
      const newTopic = exhangeFollower(newFollowedTopics, willFollow, item.topic_id);

      DiscoveryAction.setDiscoveryInitialTopics(mapTopic(newTopic), discoveryDispatch);
    }

    if (from === FROM_FOLLOWED_TOPIC) {
      const newFollowedTopics = [...newMapFollowedTopics];
      const newTopic = exhangeFollower(newFollowedTopics, willFollow, item.topic_id);

      setFollowedTopic(
        followedTopic.map((topic) => {
          if (topic.topic_id === newTopic.topic_id) {
            return newTopic;
          }
          return topic;
        })
      );
    }

    if (from === FROM_UNFOLLOWED_TOPIC) {
      const newUnFollowedTopic = [...newMapUnfollowedTopics];
      const newTopic = exhangeFollower(newUnFollowedTopic, willFollow, item.topic_id);

      setUnfollowedTopic(
        unfollowedTopic.map((topic) => {
          if (topic.topic_id === newTopic.topic_id) {
            return newTopic;
          }
          return topic;
        })
      );
    }
  };

  const handleFollow = async (from, willFollow, item, index) => {
    handleTopic(from, willFollow, item, index);

    try {
      await followTopic(item?.name);
    } catch (e) {
      handleTopic(from, !willFollow, item, index);
    }
    if (searchText.length > 0) fetchData();
  };

  const __handleOnTopicPress = (item) => {
    const navigationParam = {
      id: convertTopicNameToTopicPageScreenParam(item.name)
    };

    navigation.push('TopicPageScreen', navigationParam);
  };

  const renderRecentSearch = (index) => {
    return (
      index === 0 &&
      !withoutRecent && (
        <RecentSearch
          shown={isFirstTimeOpen}
          setSearchText={setSearchText}
          setIsFirstTimeOpen={setIsFirstTimeOpen}
        />
      )
    );
  };
  const renderDiscoveryItem = ({from, item, index}) => {
    if (item.separator) {
      return (
        <>
          {renderRecentSearch(index)}
          <DiscoveryTitleSeparator key="topic-title-separator" text="Suggested Communities" />
        </>
      );
    }

    return (
      <>
        {renderRecentSearch(index)}
        <View style={styles.domainContainer}>
          <DomainList
            handleSetFollow={() => handleFollow(from, true, item, index)}
            handleSetUnFollow={() => handleFollow(from, false, item, index)}
            key={`followedTopic-${index}`}
            isCommunity={true}
            onPressBody={() => __handleOnTopicPress(item)}
            item={{
              name: item.name,
              image: item.icon_path,
              isunfollowed: !item.following,
              description: null
            }}
            DefaultImage={TopicsProfilePictureEmptyState}
          />
        </View>
      </>
    );
  };

  const renderItem = ({index, item}) =>
    renderDiscoveryItem({
      from: isFirstTimeOpen
        ? FROM_FOLLOWED_TOPIC_INITIAL
        : index > newMapFollowedTopics.length
        ? FROM_UNFOLLOWED_TOPIC
        : FROM_FOLLOWED_TOPIC,
      item,
      index
    });

  const __renderTopicItems = () => {
    const followingTopics = [];
    const unfollowingTopics = [];

    topics.forEach((item) => {
      if (item.user_id_follower) {
        followingTopics.push(item);
      } else {
        unfollowingTopics.push(item);
      }
    });

    const data = isFirstTimeOpen
      ? [...followingTopics, {separator: true}, ...unfollowingTopics]
      : [...newMapFollowedTopics, {separator: true}, ...newMapUnfollowedTopics];

    return (
      <FlatList
        onMomentumScrollBegin={handleScroll}
        contentContainerStyle={{paddingBottom: 100}}
        data={data}
        renderItem={renderItem}
        keyExtractor={(item, index) => index.toString()}
        onEndReached={() => fetchData()}
        onEndReachedThreshold={0.6}
      />
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

  return <View>{__renderTopicItems()}</View>;
};

const styles = StyleSheet.create({
  fragmentContainer: {
    flex: 1,
    backgroundColor: COLORS.white
  },
  noDataFoundContainer: {
    flex: 1,
    backgroundColor: COLORS.white,
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

TopicFragment.propTypes = {
  isLoadingDiscoveryTopic: PropTypes.bool,
  followedTopic: PropTypes.array,
  unfollowedTopic: PropTypes.array,
  isFirstTimeOpen: PropTypes.bool,
  setIsFirstTimeOpen: PropTypes.func,
  setSearchText: PropTypes.func,
  setFollowedTopic: PropTypes.func,
  setUnfollowedTopic: PropTypes.func,
  fetchData: PropTypes.func,
  searchText: PropTypes.string,
  withoutRecent: PropTypes.bool
};

export default TopicFragment;
