import PropTypes from 'prop-types';
import React from 'react';
import SimpleToast from 'react-native-simple-toast';
import {Dimensions, StatusBar, StyleSheet, View} from 'react-native';

import Content from '../FeedScreen/Content';
import ContentLink from '../FeedScreen/ContentLink';
import Header from '../FeedScreen/Header';
import ShareUtils from '../../utils/share';
import StringConstant from '../../utils/string/StringConstant';
import dimen from '../../utils/dimen';
import useFeed from '../FeedScreen/hooks/useFeed';
import {
  ANALYTICS_SHARE_POST_TOPIC_ID,
  ANALYTICS_SHARE_POST_TOPIC_SCREEN,
  POST_TYPE_LINK,
  POST_TYPE_POLL,
  POST_TYPE_STANDARD
} from '../../utils/constants';
import {Footer, Gap, PreviewComment} from '../../components';
import {colors} from '../../utils/colors';
import {getCommentLength, getCountCommentWithChild} from '../../utils/getstream';
import {showScoreAlertDialog} from '../../utils/Utils';
import {normalizeFontSizeByWidth} from '../../utils/fonts';

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
    onPressUpvote
  } = props;

  const [loadingVote, setLoadingVote] = React.useState(false);
  const {
    totalVote,
    getHeightReaction,
    navigateToLinkContextPage,
    getHeightFooter,
    getHeightHeader,
    statusDownvote,
    voteStatus,
    checkVotes,
    initialSetup,
    onPressUpvoteHook,
    onPressDownVoteHook,
    statusUpvote,
    showScoreButton
  } = useFeed();

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

  return (
    <View style={[styles.cardContainer()]}>
      <View style={styles.cardMain}>
        <Header hideThreeDot={true} props={item} height={getHeightHeader()} />
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
            onPress={onPress}
            item={item}
            onNewPollFetched={onNewPollFetched}
            topics={item?.topics}
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
            onPressComment={() => onPressComment(item)}
            onPressBlock={() => onPressBlock(item)}
            onPressDownVote={onPressDownVoteHandle}
            onPressUpvote={onPressUpvoteHandle}
            statusVote={voteStatus}
            loadingVote={loadingVote}
            isSelf={item.anonimity ? false : userId === item?.actor?.id}
            onPressScore={showScoreAlertDialog}
            showScoreButton={showScoreButton}
          />
        </View>
        {getCommentLength(item.latest_reactions.comment) > 0 && (
          <View style={styles.contentReaction(getHeightReaction())}>
            <PreviewComment
              user={item.latest_reactions.comment[0].user}
              comment={item?.latest_reactions?.comment[0]?.data?.text || ''}
              image={item?.latest_reactions?.comment[0]?.user?.data?.profile_pic_url || ''}
              time={item.latest_reactions.comment[0].created_at}
              totalComment={getCommentLength(item.latest_reactions.comment) - 1}
              onPress={onPressComment}
              item={item.latest_reactions.comment[0]}
            />
            <Gap height={8} />
          </View>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  cardContainer: () => ({
    height: dimen.size.TOPIC_CURRENT_ITEM_HEIGHT,
    width: FULL_WIDTH,
    marginBottom: normalizeFontSizeByWidth(4),
    backgroundColor: colors.white
  }),
  cardMain: {
    height: '100%',
    width: '100%'
  },
  footerWrapper: (h) => ({height: h}),
  contentReaction: (heightReaction) => ({
    maxHeight: heightReaction,
    marginBottom: heightReaction <= 0 ? tabBarHeight + 10 : 0
  })
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
