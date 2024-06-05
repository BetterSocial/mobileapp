import PropTypes from 'prop-types';
import React from 'react';
import SimpleToast from 'react-native-simple-toast';
import {Dimensions, StyleSheet, View} from 'react-native';
import {useRoute} from '@react-navigation/core';

import AddCommentPreview from '../FeedScreen/elements/AddCommentPreview';
import Content from '../FeedScreen/Content';
import ContentLink from '../FeedScreen/ContentLink';
import Header from '../FeedScreen/Header';
import ShareUtils from '../../utils/share';
import StringConstant from '../../utils/string/StringConstant';
import TopicsChip from '../../components/TopicsChip/TopicsChip';
import dimen from '../../utils/dimen';
import useCalculationContent from '../FeedScreen/hooks/useCalculationContent';
import useFeed from '../FeedScreen/hooks/useFeed';
import usePostHook from '../../hooks/core/post/usePostHook';
import useWriteComment from '../../components/Comments/hooks/useWriteComment';
import AnalyticsEventTracking, {
  BetterSocialEventTracking
} from '../../libraries/analytics/analyticsEventTracking';
import {COLORS} from '../../utils/theme';
import {Footer, PreviewComment} from '../../components';
import {POST_TYPE_LINK, POST_TYPE_POLL, POST_TYPE_STANDARD} from '../../utils/constants';
import {getCommentLength, getCountCommentWithChild} from '../../utils/getstream';
import {normalize, normalizeFontSizeByWidth} from '../../utils/fonts';
import {showScoreAlertDialog} from '../../utils/Utils';

const FULL_WIDTH = Dimensions.get('screen').width;

const RenderListFeed = (props) => {
  const {
    item,
    index,
    onPress,
    onNewPollFetched,
    onPressDomain,
    onPressComment,
    onPressDmAdditionalProcess,
    onPressBlock,
    userId,
    onPressDownVote,
    selfUserId,
    onPressUpvote,
    offset
  } = props;

  const [loadingVote, setLoadingVote] = React.useState(false);
  const [isHaveSeeMore, setIsHaveSeeMore] = React.useState(false);
  const [isShortText, setIsShortText] = React.useState(true);
  const {
    totalVote,
    getHeightReaction,
    navigateToLinkContextPage,
    getHeightFooter,
    getHeightHeader,
    getTotalReaction,
    statusDownvote,
    voteStatus,
    checkVotes,
    initialSetup,
    onPressUpvoteHook,
    onPressDownVoteHook,
    statusUpvote,
    showScoreButton
  } = useFeed();
  const {handleUserName} = useWriteComment();
  const {followUnfollowTopic} = usePostHook();
  const route = useRoute();

  const onPressDownVoteHandle = async () => {
    onPressDownVoteHook();
    let newStatus = !statusDownvote;
    if (voteStatus === 'upvote') {
      newStatus = true;
    }

    postApiDownvote(newStatus);

    AnalyticsEventTracking.eventTrack(
      newStatus
        ? BetterSocialEventTracking.FEED_COMMUNITY_PAGE_POST_INTERACTION_DOWNVOTE_INSERTED
        : BetterSocialEventTracking.FEED_COMMUNITY_PAGE_POST_INTERACTION_DOWNVOTE_REMOVED
    );
  };

  const onPressUpvoteHandle = async () => {
    onPressUpvoteHook();
    let newStatus = !statusUpvote;
    if (voteStatus === 'downvote') {
      newStatus = true;
    }

    postApiUpvote(newStatus);

    AnalyticsEventTracking.eventTrack(
      newStatus
        ? BetterSocialEventTracking.FEED_COMMUNITY_PAGE_POST_INTERACTION_UPVOTE_INSERTED
        : BetterSocialEventTracking.FEED_COMMUNITY_PAGE_POST_INTERACTION_UPVOTE_REMOVED
    );
  };

  const postApiDownvote = async (status) => {
    try {
      await onPressDownVote({
        activity_id: item.id,
        status,
        feed_group: 'main_feed'
      });
      setLoadingVote(false);
    } catch (e) {
      setLoadingVote(false);
      SimpleToast.show(StringConstant.downvoteFailedText, SimpleToast.SHORT);
    }
  };

  const postApiUpvote = async (status) => {
    try {
      await onPressUpvote({
        activity_id: item.id,
        status,
        feed_group: 'main_feed',
        voteStatus
      });
    } catch (e) {
      SimpleToast.show(StringConstant.upvoteFailedText, SimpleToast.SHORT);
    }
  };

  const checkVotesHandle = () => {
    checkVotes(item, selfUserId);
  };

  React.useEffect(() => {
    initialSetup(item);
    checkVotesHandle();
  }, [item]);

  const hasComment = getCommentLength(item.latest_reactions.comment) > 0;

  const isBlurred = item?.isBlurredPost && item?.anonimity;

  const {onLayoutTopicChip} = useCalculationContent();
  const calculateLineTopicChip = (nativeEvent) => {
    onLayoutTopicChip(nativeEvent, 1);
  };

  const topicBottomPosition = () => {
    if (hasComment) {
      return getHeightReaction() + normalize(4);
    }
    return getHeightFooter() + normalize(4);
  };

  const isShortTextPost =
    item.post_type === POST_TYPE_STANDARD && item.images_url.length <= 0 && isShortText === true;

  const onFollowUnfollowButtonPressed = async () => {
    const action = await followUnfollowTopic(item, route?.params?.id, offset);
    if (action === 'follow' || action === 'follow-anonymous') {
      AnalyticsEventTracking.eventTrack(
        BetterSocialEventTracking.FEED_COMMUNITY_PAGE_FOLLOW_USER_BUTTON_CLICKED
      );
    } else if (action === 'unfollow' || action === 'unfollow-anonymous') {
      AnalyticsEventTracking.eventTrack(
        BetterSocialEventTracking.FEED_COMMUNITY_PAGE_UNFOLLOW_USER_BUTTON_CLICKED
      );
    }
  };

  return (
    <View style={styles.cardContainer}>
      <View style={styles.cardMain}>
        <Header
          hideThreeDot={true}
          props={item}
          height={getHeightHeader()}
          isSelf={item?.is_self}
          isFollow={item?.is_following_target}
          onPressFollUnFoll={onFollowUnfollowButtonPressed}
          isShortText={isShortTextPost}
          navigateToProfileEventName={
            BetterSocialEventTracking.FEED_COMMUNITY_PAGE_POST_INTERACTION_OPEN_AUTHOR_PROFILE
          }
        />
        {item.post_type === POST_TYPE_LINK && (
          <ContentLink
            index={index}
            og={item.og}
            onPress={() => onPress(item)}
            onHeaderPress={() => onPressDomain(item)}
            onCardContentPress={() => navigateToLinkContextPage(item)}
            message={item.message}
            topics={item?.topics}
          />
        )}
        {(item.post_type === POST_TYPE_STANDARD || item.post_type === POST_TYPE_POLL) && (
          <Content
            index={index}
            message={item.message}
            images_url={item.images_url}
            onPress={() => onPress(isHaveSeeMore)}
            item={item}
            onNewPollFetched={onNewPollFetched}
            topics={item?.topics}
            setHaveSeeMore={(haveSeeMore) => setIsHaveSeeMore(haveSeeMore)}
            setIsShortText={(shortText) => setIsShortText(shortText)}
            seeResultsEventName={
              BetterSocialEventTracking.FEED_COMMUNITY_PAGE_MULTIPLE_POLL_SEE_RESULTS
            }
            pollSelectedEventName={
              BetterSocialEventTracking.FEED_COMMUNITY_PAGE_SINGLE_POLL_CLICKED
            }
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
        <Footer
          item={item}
          totalComment={getCountCommentWithChild(item)}
          totalVote={totalVote}
          onPressShare={() => ShareUtils.sharePostInTopic(item)}
          onPressComment={() => onPressComment(isHaveSeeMore)}
          onPressBlock={() => onPressBlock(item)}
          onPressDownVote={onPressDownVoteHandle}
          onPressUpvote={onPressUpvoteHandle}
          eventTrackCallback={{
            pressDMFooter: onPressDmAdditionalProcess
          }}
          statusVote={voteStatus}
          loadingVote={loadingVote}
          isSelf={item.anonimity ? false : userId === item?.actor?.id}
          onPressScore={showScoreAlertDialog}
          showScoreButton={showScoreButton}
          isShowDM
          isShortText={isShortTextPost}
        />
        {hasComment ? (
          <View>
            <PreviewComment
              user={item.latest_reactions.comment[0].user}
              comment={item?.latest_reactions?.comment[0]?.data?.text || ''}
              image={item?.latest_reactions?.comment[0]?.user?.data?.profile_pic_url || ''}
              time={item.latest_reactions.comment[0].created_at}
              totalComment={getTotalReaction(item) - 1}
              item={item.latest_reactions.comment[0]}
              onPress={onPressComment}
              isShortText={isShortTextPost}
              isBlurred={isBlurred}
            />
          </View>
        ) : (
          <AddCommentPreview
            username={handleUserName(item)}
            isBlurred={isBlurred}
            heightReaction={getHeightReaction()}
            onPressComment={() => onPressComment(isHaveSeeMore)}
            isShortText={isShortTextPost}
          />
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  cardContainer: {
    width: FULL_WIDTH,
    height: dimen.size.TOPIC_CURRENT_ITEM_HEIGHT,
    backgroundColor: COLORS.almostBlack
  },
  cardMain: {
    height: '100%',
    width: '100%'
  }
});

RenderListFeed.propTypes = {
  item: PropTypes.object,
  index: PropTypes.number,
  onPress: PropTypes.func,
  onNewPollFetched: PropTypes.func,
  onPressDomain: PropTypes.func,
  onPressComment: PropTypes.func,
  onPressBlock: PropTypes.func,
  Handle: PropTypes.func,
  userId: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  onPressUpvote: PropTypes.func,
  onPressDownVote: PropTypes.func,
  loading: PropTypes.bool
};

export default RenderListFeed;
