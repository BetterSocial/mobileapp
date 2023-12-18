/* eslint-disable import/no-extraneous-dependencies */
import PropTypes from 'prop-types';
import React from 'react';
import {Dimensions, StatusBar, StyleSheet, View} from 'react-native';

import {Footer, PreviewComment} from '../../components';
import useWriteComment from '../../components/Comments/hooks/useWriteComment';
import TopicsChip from '../../components/TopicsChip/TopicsChip';
import {Context} from '../../context';
import {setFeedByIndex} from '../../context/actions/feeds';
import {followUserAnon, setFollow, setUnFollow, unfollowUserAnon} from '../../service/profile';
import {showScoreAlertDialog} from '../../utils/Utils';
import {
  ANALYTICS_SHARE_POST_FEED_ID,
  ANALYTICS_SHARE_POST_FEED_SCREEN,
  POST_TYPE_LINK,
  POST_TYPE_POLL,
  POST_TYPE_STANDARD,
  SOURCE_FEED_TAB
} from '../../utils/constants';
import dimen from '../../utils/dimen';
import {normalize, normalizeFontSizeByWidth} from '../../utils/fonts';
import {getCommentLength} from '../../utils/getstream';
import ShareUtils from '../../utils/share';
import {COLORS} from '../../utils/theme';
import Content from './Content';
import ContentLink from './ContentLink';
import Header from './Header';
import AddCommentPreview from './elements/AddCommentPreview';
import BlurredLayer from './elements/BlurredLayer';
import useCalculationContent from './hooks/useCalculationContent';
import useFeed from './hooks/useFeed';

const tabBarHeight = StatusBar.currentHeight;
const FULL_WIDTH = Dimensions.get('screen').width;

const RenderListFeed = (props) => {
  const [isHaveSeeMore, setIsHaveSeeMore] = React.useState(false);
  const {
    item,
    index,
    onPress,
    onNewPollFetched,
    onPressDomain,
    onPressBlock,
    onPressUpvote,
    onPressComment,
    selfUserId,
    onPressDownVote,
    source = SOURCE_FEED_TAB,
    hideThreeDot = true,
    showAnonymousOption = false,
    onDeletePost,
    isShowDelete,
    isSelf
  } = props;
  const {
    totalVote,
    getHeightReaction,
    navigateToLinkContextPage,
    getHeightFooter,
    getHeightHeader,
    statusDownvote,
    statusUpvote,
    voteStatus,
    checkVotes,
    initialSetup,
    onPressUpvoteHook,
    onPressDownVoteHook,
    getTotalReaction,
    showScoreButton
  } = useFeed();
  const {handleUserName} = useWriteComment();

  const postApiUpvote = async (status) => {
    await onPressUpvote({
      activity_id: item.id,
      status,
      feed_group: 'main_feed',
      voteStatus
    });
  };
  const postApiDownvote = async (status) => {
    await onPressDownVote({
      activity_id: item.id,
      status,
      feed_group: 'main_feed',
      voteStatus
    });
  };

  const [feedsContext, feedsContextDispatch] = React.useContext(Context).feeds;
  const [profileContext] = React.useContext(Context).profile;
  const {myProfile} = profileContext;

  const onPressDownVoteHandle = async () => {
    onPressDownVoteHook();
    let newStatus = !statusDownvote;
    if (voteStatus === 'upvote') {
      newStatus = true;
    }

    await postApiDownvote(newStatus);
  };

  const onPressUpvoteHandle = async () => {
    onPressUpvoteHook();
    let newStatus = !statusUpvote;
    if (voteStatus === 'downvote') {
      newStatus = true;
    }
    await postApiUpvote(newStatus);
  };

  const checkVotesHandle = () => {
    checkVotes(item, selfUserId);
  };

  React.useEffect(() => {
    checkVotesHandle();
    initialSetup(item);
  }, [item]);

  const hasComment = getCommentLength(item.latest_reactions.comment) > 0;

  const isBlurred = item?.isBlurredPost && item?.anonimity;

  const commentHeight = () => {
    if (isBlurred && !hasComment) {
      return 0;
    }
    const isSingleComment = getTotalReaction(item) === 1;
    const commentSectionHeight = getHeightReaction() - getHeightFooter();
    return isSingleComment ? commentSectionHeight - 20 : commentSectionHeight;
  };

  const {onLayoutTopicChip} = useCalculationContent();
  const calculateLineTopicChip = (nativeEvent) => {
    onLayoutTopicChip(nativeEvent, 1);
  };

  const topicBottomPosition = () => {
    if (hasComment) {
      if (getTotalReaction(item) === 1) {
        return getHeightReaction() - 20;
      }
      return getHeightReaction();
    }
    return getHeightFooter();
  };

  const handleFollowUnfollow = async () => {
    const user_id = item?.actor?.id;
    const username = item?.actor?.data?.username;
    const data = {
      user_id_follower: myProfile?.user_id,
      user_id_followed: user_id,
      username_follower: myProfile?.username,
      username_followed: username,
      follow_source: 'feed'
    };
    const dataFollowAnon = {
      follow_source: 'post',
      post_id: item?.id
    };
    const indexFeed = feedsContext?.feeds?.findIndex((feed) => {
      return feed?.id === item?.id;
    });
    const feedData = feedsContext?.feeds[indexFeed];
    if (feedData?.is_following_target) {
      if (!feedData?.anon_user_info_color_name) {
        feedsContext?.feeds.forEach((feed, index) => {
          if (feed?.actor?.id === user_id) {
            setFeedByIndex(
              {
                index,
                singleFeed: {...feedsContext?.feeds[index], is_following_target: false}
              },
              feedsContextDispatch
            );
          }
        });
        await setUnFollow(data);
      } else {
        const newFeed = {...feedsContext?.feeds[indexFeed], is_following_target: false};
        setFeedByIndex(
          {
            index: indexFeed,
            singleFeed: newFeed
          },
          feedsContextDispatch
        );
        await unfollowUserAnon(dataFollowAnon);
      }
    } else {
      // eslint-disable-next-line no-lonely-if
      if (!feedData?.anon_user_info_color_name) {
        feedsContext?.feeds.forEach((feed, index) => {
          if (feed?.actor?.id === user_id) {
            setFeedByIndex(
              {
                index,
                singleFeed: {...feedsContext?.feeds[index], is_following_target: true}
              },
              feedsContextDispatch
            );
          }
        });
        await setFollow(data);
      } else {
        const newFeed = {...feedsContext?.feeds[indexFeed], is_following_target: true};
        setFeedByIndex(
          {
            index: indexFeed,
            singleFeed: newFeed
          },
          feedsContextDispatch
        );
        await followUserAnon(dataFollowAnon);
      }
    }
  };

  return (
    <View key={item.id} testID="dataScroll" style={styles.cardContainer}>
      <View style={[styles.cardMain]}>
        <Header
          hideThreeDot={hideThreeDot}
          props={item}
          height={getHeightHeader()}
          source={source}
          headerStyle={styles.mh9}
          showAnonymousOption={showAnonymousOption}
          onDeletePost={onDeletePost}
          isShowDelete={isShowDelete}
          isSelf={isSelf}
          isFollow={item?.is_following_target}
          onPressFollUnFoll={handleFollowUnfollow}
        />
        {item.post_type === POST_TYPE_LINK && (
          <ContentLink
            key={item.id}
            index={index}
            og={item.og}
            onPress={() => onPress(item)}
            onHeaderPress={() => onPressDomain(item)}
            onCardContentPress={() => navigateToLinkContextPage(item)}
            score={item?.credderScore}
            message={item?.message}
            messageContainerStyle={{paddingHorizontal: 10}}
            topics={item?.topics}
            hasComment={hasComment}
            item={item}
            contentHeight={
              dimen.size.FEED_CURRENT_ITEM_HEIGHT - getHeightHeader() - getHeightReaction()
            }
          />
        )}
        {(item.post_type === POST_TYPE_STANDARD || item.post_type === POST_TYPE_POLL) && (
          <Content
            key={item.id}
            index={index}
            message={item.message}
            images_url={item.images_url}
            onPress={() => {
              onPress(isHaveSeeMore);
            }}
            setHaveSeeMore={(haveSeeMore) => setIsHaveSeeMore(haveSeeMore)}
            topics={item?.topics}
            item={item}
            onNewPollFetched={onNewPollFetched}
            hasComment={hasComment}
          />
        )}
        {isBlurred && (
          <TopicsChip
            onLayout={calculateLineTopicChip}
            topics={item?.topics}
            fontSize={normalizeFontSizeByWidth(14)}
            text={item.message}
            topicContainer={{
              bottom: topicBottomPosition()
            }}
          />
        )}
        <View style={styles.footerWrapper(getHeightFooter())}>
          <Footer
            item={item}
            totalComment={getTotalReaction(item)}
            totalVote={totalVote}
            onPressShare={() =>
              ShareUtils.shareFeeds(
                item,
                ANALYTICS_SHARE_POST_FEED_SCREEN,
                ANALYTICS_SHARE_POST_FEED_ID
              )
            }
            onPressComment={() => onPressComment(isHaveSeeMore)}
            onPressBlock={() => onPressBlock(item)}
            onPressDownVote={onPressDownVoteHandle}
            onPressUpvote={onPressUpvoteHandle}
            statusVote={voteStatus}
            showScoreButton={showScoreButton}
            onPressScore={() => showScoreAlertDialog(item)}
            isSelf={isSelf}
            isShowDM
          />
        </View>
        <BlurredLayer
          layerOnly
          blurType="light"
          withToast={true}
          isVisible={isBlurred}
          containerStyle={{
            height: commentHeight()
          }}>
          {hasComment ? (
            <View
              testID="previewComment"
              style={styles.contentReaction(getHeightReaction(), isBlurred)}>
              <PreviewComment
                user={item.latest_reactions.comment[0].user}
                comment={item?.latest_reactions?.comment[0]?.data?.text || ''}
                image={item?.latest_reactions?.comment[0]?.user?.data?.profile_pic_url || ''}
                time={item.latest_reactions.comment[0].created_at}
                totalComment={getTotalReaction(item) - 1}
                item={item.latest_reactions.comment[0]}
                onPress={onPress}
              />
            </View>
          ) : (
            <AddCommentPreview
              username={handleUserName(item)}
              isBlurred={isBlurred}
              heightReaction={getHeightReaction()}
              onPressComment={() => onPressComment(isHaveSeeMore)}
            />
          )}
        </BlurredLayer>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  footerWrapper: (h) => ({height: h, alignItems: 'center', justifyContent: 'center'}),
  contentReaction: (heightReaction, withBorder) => ({
    maxHeight: heightReaction,
    marginBottom: heightReaction <= 0 ? tabBarHeight + normalize(10) : 0,
    borderTopWidth: withBorder ? 1 : 0,
    borderTopColor: COLORS.light_silver
  }),
  cardContainer: {
    width: FULL_WIDTH,
    borderBottomWidth: 0,
    borderBottomColor: COLORS.lightgrey,
    backgroundColor: 'white',
    height: dimen.size.FEED_CURRENT_ITEM_HEIGHT,
    marginBottom: normalizeFontSizeByWidth(4),
    shadowColor: COLORS.black000,
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.3,
    shadowRadius: 4
  },
  cardMain: {
    width: '100%',
    height: dimen.size.FEED_CURRENT_ITEM_HEIGHT
  },
  mh9: {
    marginHorizontal: 9
  }
});

RenderListFeed.propTypes = {
  item: PropTypes.object,
  index: PropTypes.number,
  onPress: PropTypes.func,
  onNewPollFetched: PropTypes.func,
  onPressDomain: PropTypes.func,
  onPressBlock: PropTypes.func,
  selfUserId: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  onPressUpvote: PropTypes.func,
  onPressDownVote: PropTypes.func,
  source: PropTypes.string,
  hideThreeDot: PropTypes.bool,
  showAnonymousOption: PropTypes.bool,
  onHeaderOptionClicked: PropTypes.func,
  onPreviewCommentPress: PropTypes.func,
  onDeletePost: PropTypes.func,
  isSelf: PropTypes.bool
};

export default React.memo(
  RenderListFeed,
  (prevProps, nextProps) => prevProps.item === nextProps.item
);
