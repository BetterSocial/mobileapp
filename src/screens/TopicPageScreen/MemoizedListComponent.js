import PropTypes from 'prop-types';
import React from 'react';
import {Dimensions, StatusBar, StyleSheet, View} from 'react-native';
import SimpleToast from 'react-native-simple-toast';

import {useRoute} from '@react-navigation/core';
import {Footer, PreviewComment} from '../../components';
import useWriteComment from '../../components/Comments/hooks/useWriteComment';
import TopicsChip from '../../components/TopicsChip/TopicsChip';
import usePostHook from '../../hooks/core/post/usePostHook';
import {showScoreAlertDialog} from '../../utils/Utils';
import {
  ANALYTICS_SHARE_POST_TOPIC_ID,
  ANALYTICS_SHARE_POST_TOPIC_SCREEN,
  POST_TYPE_LINK,
  POST_TYPE_POLL,
  POST_TYPE_STANDARD
} from '../../utils/constants';
import dimen from '../../utils/dimen';
import {normalize, normalizeFontSizeByWidth} from '../../utils/fonts';
import {getCommentLength, getCountCommentWithChild} from '../../utils/getstream';
import ShareUtils from '../../utils/share';
import StringConstant from '../../utils/string/StringConstant';
import {COLORS} from '../../utils/theme';
import Content from '../FeedScreen/Content';
import ContentLink from '../FeedScreen/ContentLink';
import Header from '../FeedScreen/Header';
import AddCommentPreview from '../FeedScreen/elements/AddCommentPreview';
import BlurredLayer from '../FeedScreen/elements/BlurredLayer';
import useCalculationContent from '../FeedScreen/hooks/useCalculationContent';
import useFeed from '../FeedScreen/hooks/useFeed';

const FULL_WIDTH = Dimensions.get('screen').width;
const tabBarHeight = StatusBar.currentHeight;

const RenderListFeed = (props) => {
  const {
    item,
    index,
    onPress,
    onNewPollFetched,
    onPressDomain,
    onPressComment,
    onPressBlock,
    userId,
    onPressDownVote,
    selfUserId,
    onPressUpvote,
    offset
  } = props;

  const [loadingVote, setLoadingVote] = React.useState(false);
  const [isHaveSeeMore, setIsHaveSeeMore] = React.useState(false);
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

  return (
    <View style={[styles.cardContainer()]}>
      <View style={styles.cardMain}>
        <Header
          headerStyle={styles.ml3}
          hideThreeDot={true}
          props={item}
          height={getHeightHeader()}
          isSelf={item?.is_self}
          isFollow={item?.is_following_target}
          onPressFollUnFoll={() => followUnfollowTopic(item, route?.params?.id, offset)}
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
            contentHeight={
              dimen.size.FEED_CURRENT_ITEM_HEIGHT - getHeightHeader() - getHeightReaction()
            }
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
            totalComment={getCountCommentWithChild(item)}
            totalVote={totalVote}
            onPressShare={() =>
              ShareUtils.sharePostInTopic(
                item,
                ANALYTICS_SHARE_POST_TOPIC_SCREEN,
                ANALYTICS_SHARE_POST_TOPIC_ID
              )
            }
            onPressComment={() => onPressComment(isHaveSeeMore)}
            onPressBlock={() => onPressBlock(item)}
            onPressDownVote={onPressDownVoteHandle}
            onPressUpvote={onPressUpvoteHandle}
            statusVote={voteStatus}
            loadingVote={loadingVote}
            isSelf={item.anonimity ? false : userId === item?.actor?.id}
            onPressScore={showScoreAlertDialog}
            showScoreButton={showScoreButton}
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
            <View style={styles.contentReaction(getHeightReaction())}>
              <PreviewComment
                user={item.latest_reactions.comment[0].user}
                comment={item?.latest_reactions?.comment[0]?.data?.text || ''}
                image={item?.latest_reactions?.comment[0]?.user?.data?.profile_pic_url || ''}
                time={item.latest_reactions.comment[0].created_at}
                totalComment={getTotalReaction(item) - 1}
                item={item.latest_reactions.comment[0]}
                onPress={onPressComment}
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
  cardContainer: () => ({
    height: dimen.size.TOPIC_CURRENT_ITEM_HEIGHT,
    width: FULL_WIDTH,
    marginBottom: normalizeFontSizeByWidth(4),
    backgroundColor: COLORS.white,
    shadowColor: COLORS.black000,
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.3,
    shadowRadius: 4
  }),
  cardMain: {
    height: '100%',
    width: '100%'
  },
  footerWrapper: (h) => ({height: h}),
  contentReaction: (heightReaction) => ({
    maxHeight: heightReaction,
    marginBottom: heightReaction <= 0 ? tabBarHeight + normalize(10) : 0
  }),
  ml3: {
    marginLeft: 3
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

function compare(prevProps, nextProps) {
  return JSON.stringify(prevProps) === JSON.stringify(nextProps);
}

const MemoizedListComponent = React.memo(RenderListFeed, compare);
export default MemoizedListComponent;
