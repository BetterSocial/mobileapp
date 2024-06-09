/* eslint-disable no-underscore-dangle */
import {useNavigation} from '@react-navigation/native';
import * as React from 'react';
import {FlatList, Pressable, StyleSheet, Text, View} from 'react-native';

import PropTypes from 'prop-types';
import Accordion from 'react-native-collapsible/Accordion';
import TopicsProfilePictureEmptyState from '../../../assets/icon/TopicsProfilePictureEmptyState';
import IconUserGroup from '../../../assets/icons/Ic_user_group';
import LoadingWithoutModal from '../../../components/LoadingWithoutModal';
import useIsReady from '../../../hooks/useIsReady';
import {fonts, normalizeFontSize} from '../../../utils/fonts';
import useChatClientHook from '../../../utils/getstream/useChatClientHook';
import {convertTopicNameToTopicPageScreenParam} from '../../../utils/string/StringUtils';
import {COLORS} from '../../../utils/theme';
import DomainList from '../elements/DiscoveryItemList';
import DiscoveryTitleSeparator from '../elements/DiscoveryTitleSeparator';
import RecentSearch from '../elements/RecentSearch';
import useDiscovery from '../hooks/useDiscovery';
import dimen from '../../../utils/dimen';

const FROM_FOLLOWED_TOPIC = 'fromfollowedtopics';
const FROM_FOLLOWED_TOPIC_INITIAL = 'fromfollowedtopicsinitial';
const FROM_UNFOLLOWED_TOPIC = 'fromunfollowedtopics';
const FROM_UNFOLLOWED_TOPIC_INITIAL = 'fromunfollowedtopicsinitial';

const SECTIONS = [
  {
    title: 'First',
    content: 'Lorem ipsum...'
  }
];

const AccordionView = ({data, renderItem, setActiveSections, activeSections}) => {
  const renderSectionTitle = () => {
    return <View style={styles.content}></View>;
  };

  const renderHeader = (data, index) => {
    return (
      <DiscoveryTitleSeparator
        withBorderBottom={true}
        key="user-title-separator"
        text="Your Communities"
        showArrow
        rotateArrow={activeSections?.some((actived) => actived === index)}
      />
    );
  };

  const renderContent = () => {
    return (
      <View style={styles.content}>{data?.map((item, index) => renderItem({index, item}))}</View>
    );
  };

  const updateSections = (activeSectionsParams) => {
    setActiveSections(activeSectionsParams);
  };

  return (
    <Accordion
      sections={SECTIONS}
      activeSections={activeSections}
      renderSectionTitle={renderSectionTitle}
      renderHeader={renderHeader}
      renderContent={renderContent}
      onChange={updateSections}
    />
  );
};

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
  const [activeSections, setActiveSections] = React.useState([]);

  const {followTopic} = useChatClientHook();
  const {
    topics,
    updateFollowTopicDiscoveryContext,
    topicExchangeFollower: exchangeFollower
  } = useDiscovery();

  const navigation = useNavigation();

  const isReady = useIsReady();

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

  const handleTopic = (from, willFollow, item) => {
    if (from === FROM_FOLLOWED_TOPIC_INITIAL || from === FROM_UNFOLLOWED_TOPIC_INITIAL) {
      updateFollowTopicDiscoveryContext(willFollow, item);
    }

    if (from === FROM_FOLLOWED_TOPIC) {
      const newFollowedTopics = [...newMapFollowedTopics];
      const newTopic = exchangeFollower(newFollowedTopics, willFollow, item.topic_id);

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
      const newTopic = exchangeFollower(newUnFollowedTopic, willFollow, item.topic_id);

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

  const handleFollow = async (from, willFollow, item) => {
    handleTopic(from, willFollow, item);

    try {
      await followTopic(item?.name);
    } catch (e) {
      handleTopic(from, !willFollow, item);
    }
    if (searchText.length > 0) fetchData();
  };

  const __handleOnTopicPress = (item) => {
    const navigationParam = {
      id: convertTopicNameToTopicPageScreenParam(item.name),
      isFollowing: item.following
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
          <DiscoveryTitleSeparator key="topic-title-separator" text="Communities for you!" />
        </>
      );
    }

    return (
      <>
        <View style={styles.domainContainer}>
          <DomainList
            handleSetFollow={() => handleFollow(from, true, item)}
            handleSetUnFollow={() => handleFollow(from, false, item)}
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
    const firstData = isFirstTimeOpen ? followingTopics : newMapFollowedTopics;
    const data = isFirstTimeOpen
      ? [{separator: true}, ...unfollowingTopics]
      : [{separator: true}, ...newMapUnfollowedTopics];

    return (
      <View>
        <Pressable
          style={styles.buttonContainer}
          onPress={() => navigation.push('CreateCommunity')}>
          <View style={styles.buttonRow}>
            <IconUserGroup height={20} width={22} fill={COLORS.gray400} />
            <Text style={styles.buttonText}>Start new community</Text>
          </View>
          <View style={styles.buttonGo}>
            <Text style={styles.buttonGoText}>Go</Text>
          </View>
        </Pressable>
        <FlatList
          ListHeaderComponent={() => (
            <>
              <RecentSearch
                shown={!withoutRecent || isFirstTimeOpen}
                setSearchText={setSearchText}
                setIsFirstTimeOpen={setIsFirstTimeOpen}
              />
              <AccordionView
                data={firstData}
                renderItem={renderItem}
                activeSections={activeSections}
                setActiveSections={setActiveSections}
              />
            </>
          )}
          keyboardDismissMode="on-drag"
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={{paddingBottom: 100}}
          data={data}
          renderItem={renderItem}
          keyExtractor={(item, index) => index.toString()}
          onEndReached={() => fetchData()}
          onEndReachedThreshold={0.6}
        />
      </View>
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
  buttonContainer: {
    borderWidth: 1,
    borderColor: COLORS.gray310,
    borderRadius: 10,
    backgroundColor: COLORS.gray110,
    marginHorizontal: dimen.normalizeDimen(20),
    marginVertical: dimen.normalizeDimen(12),
    paddingHorizontal: dimen.normalizeDimen(16),
    paddingVertical: dimen.normalizeDimen(8),
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  buttonRow: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  buttonText: {
    color: COLORS.white,
    fontFamily: fonts.inter[500],
    fontSize: normalizeFontSize(16),
    lineHeight: normalizeFontSize(24),
    marginLeft: dimen.normalizeDimen(20)
  },
  buttonGo: {
    width: 41,
    height: 20,
    borderRadius: 100,
    backgroundColor: COLORS.signed_primary,
    justifyContent: 'center',
    alignItems: 'center'
  },
  buttonGoText: {
    color: COLORS.white,
    fontFamily: fonts.inter[500],
    fontSize: normalizeFontSize(12),
    lineHeight: normalizeFontSize(18)
  },
  fragmentContainer: {
    flex: 1,
    backgroundColor: COLORS.almostBlack
  },
  noDataFoundContainer: {
    flex: 1,
    backgroundColor: COLORS.almostBlack,
    justifyContent: 'center'
  },
  noDataFoundText: {
    alignSelf: 'center',
    justifyContent: 'center',
    fontFamily: fonts.inter[600],
    color: COLORS.white
  },
  unfollowedHeaderContainer: {
    backgroundColor: COLORS.gray110,
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
