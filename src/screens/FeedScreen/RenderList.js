/* eslint-disable import/no-extraneous-dependencies */
import PropTypes from 'prop-types';
import React from 'react';
import moment from 'moment';
import {Dimensions, StyleSheet, View} from 'react-native';

import AddCommentPreview from './elements/AddCommentPreview';
import Content from './Content';
import ContentLink from './ContentLink';
import Header from './Header';
import ShareUtils from '../../utils/share';
import TopicsChip from '../../components/TopicsChip/TopicsChip';
import dimen from '../../utils/dimen';
import useCalculationContent from './hooks/useCalculationContent';
import useFeed from './hooks/useFeed';
import usePostHook from '../../hooks/core/post/usePostHook';
import {
  ANALYTICS_SHARE_POST_FEED_ID,
  ANALYTICS_SHARE_POST_FEED_SCREEN,
  POST_TYPE_LINK,
  POST_TYPE_POLL,
  POST_TYPE_STANDARD,
  SOURCE_FEED_TAB
} from '../../utils/constants';
import {COLORS} from '../../utils/theme';
import {Footer, PreviewComment} from '../../components';
import {getCommentLength} from '../../utils/getstream';
import {normalize, normalizeFontSizeByWidth} from '../../utils/fonts';

const FULL_WIDTH = Dimensions.get('screen').width;

const RenderListFeed = (props) => {
  const [isHaveSeeMore, setIsHaveSeeMore] = React.useState(false);
  const [isShortText, setIsShortText] = React.useState(true);
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
    onDeletePost,
    isShowDelete,
    isSelf,
    onHeaderOptionClicked = () => {}
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
    getTotalReaction
  } = useFeed();

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

  const {followUnfollow} = usePostHook();

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

  const hasComment =
    getCommentLength(item.latest_reactions.comment) > 0 && item.latest_reactions.comment[0].user;

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

  const latestComment = React.useMemo(() => {
    if (!item?.latest_reactions?.comment) return {};

    const sortedComment = item?.latest_reactions?.comment?.sort(
      (a, b) => moment(b.created_at).valueOf() - moment(a.created_at).valueOf()
    );

    return sortedComment;
  }, [item]);

  return (
    <View key={item.id} testID="dataScroll" style={styles.cardContainer}>
      <View style={[styles.cardMain]}>
        <Header
          item={item}
          hideThreeDot={hideThreeDot}
          props={item}
          height={getHeightHeader()}
          source={source}
          onDeletePost={onDeletePost}
          isShowDelete={isShowDelete}
          isSelf={isSelf}
          isFollow={item?.is_following_target}
          onPressFollUnFoll={() => followUnfollow(item)}
          onHeaderOptionClicked={onHeaderOptionClicked}
          isShortText={isShortTextPost}
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
            item={item}
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
            setIsShortText={(shortText) => setIsShortText(shortText)}
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
          isSelf={isSelf}
          isShowDM
          isShortText={isShortTextPost}
        />
        {hasComment ? (
          <View testID="previewComment">
            <PreviewComment
              user={latestComment?.[0]?.user}
              comment={latestComment?.[0]?.data?.text || ''}
              image={latestComment?.[0]?.user?.data?.profile_pic_url || ''}
              time={latestComment?.[0]?.created_at}
              totalComment={getTotalReaction(item) - 1}
              item={latestComment?.[0]}
              onPress={() => onPressComment(isHaveSeeMore)}
              isShortText={isShortTextPost}
              isBlurred={isBlurred}
            />
          </View>
        ) : (
          <AddCommentPreview
            isBlurred={isBlurred}
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
    backgroundColor: COLORS.gray110,
    height: dimen.size.FEED_CURRENT_ITEM_HEIGHT,
    paddingTop: normalize(4)
  },
  cardMain: {
    width: '100%',
    height: dimen.size.FEED_CURRENT_ITEM_HEIGHT - normalize(56),
    borderTopLeftRadius: normalize(16),
    borderTopRightRadius: normalize(16),
    backgroundColor: COLORS.almostBlack
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
  onHeaderOptionClicked: PropTypes.func,
  onPreviewCommentPress: PropTypes.func,
  onDeletePost: PropTypes.func,
  isSelf: PropTypes.bool
};

export default React.memo(
  RenderListFeed,
  (prevProps, nextProps) => prevProps.item === nextProps.item
);
