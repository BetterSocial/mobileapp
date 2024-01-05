/* eslint-disable import/no-extraneous-dependencies */
import PropTypes from 'prop-types';
import React from 'react';
import {Dimensions, StatusBar, StyleSheet, TouchableOpacity, View} from 'react-native';

import {Footer, Gap, PreviewComment} from '../../components';
import {showScoreAlertDialog} from '../../utils/Utils';
import {
  ANALYTICS_SHARE_POST_FEED_ID,
  ANALYTICS_SHARE_POST_FEED_SCREEN,
  POST_TYPE_LINK,
  POST_TYPE_POLL,
  POST_TYPE_STANDARD,
  SOURCE_FEED_TAB
} from '../../utils/constants';
import {getCommentLength} from '../../utils/getstream';
import {normalize, normalizeFontSizeByWidth} from '../../utils/fonts';
import {COLORS} from '../../utils/theme';
import dimen from '../../utils/dimen';
import ShareUtils from '../../utils/share';
import Content from './Content';
import ContentLink from './ContentLink';
import Header from './Header';
import useFeed from './hooks/useFeed';
import usePostHook from '../../hooks/core/post/usePostHook';
import WriteComment from '../../components/Comments/WriteComment';
import useWriteComment from '../../components/Comments/hooks/useWriteComment';

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

  const {followUnfollow} = usePostHook();
  const {handleUserName} = useWriteComment();

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

  const checkVotesHandle = () => {
    checkVotes(item, selfUserId);
  };

  React.useEffect(() => {
    checkVotesHandle();
    initialSetup(item);
  }, [item]);

  const hasComment = getCommentLength(item.latest_reactions.comment) > 0;

  const contentLinkHeight = () => {
    const haveLength = hasComment ? getHeightReaction() / 2.2 : getHeightReaction() / 1.6;
    return dimen.size.FEED_CURRENT_ITEM_HEIGHT - getHeightHeader() - getHeightFooter() - haveLength;
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
          onPressFollUnFoll={() => followUnfollow(item)}
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
            contentHeight={contentLinkHeight()}
            hasComment={hasComment}
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
            onPressComment={() => onPress(isHaveSeeMore)}
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
        {hasComment ? (
          <View testID="previewComment" style={styles.contentReaction(getHeightReaction())}>
            <React.Fragment>
              <PreviewComment
                user={item.latest_reactions.comment[0].user}
                comment={item?.latest_reactions?.comment[0]?.data?.text || ''}
                image={item?.latest_reactions?.comment[0]?.user?.data?.profile_pic_url || ''}
                time={item.latest_reactions.comment[0].created_at}
                totalComment={getTotalReaction(item) - 1}
                item={item.latest_reactions.comment[0]}
                onPress={onPress}
              />
              <Gap height={8} />
            </React.Fragment>
          </View>
        ) : (
          <TouchableOpacity
            testID="writeComment"
            onPress={() => onPress(isHaveSeeMore)}
            style={styles.contentReaction(getHeightReaction())}>
            <WriteComment
              postId={''}
              username={handleUserName(item)}
              value={''}
              onChangeText={() => {}}
              onPress={() => {}}
              loadingPost={false}
              isViewOnly={true}
              withAnonymityLabel={false}
            />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  footerWrapper: (h) => ({height: h, alignItems: 'center', justifyContent: 'center'}),
  contentReaction: (heightReaction) => ({
    maxHeight: heightReaction,
    marginBottom: heightReaction <= 0 ? tabBarHeight + normalize(10) : 0
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
  onDeletePost: PropTypes.func,
  isSelf: PropTypes.bool,
  onPreviewCommentPress: PropTypes.func
};

export default React.memo(
  RenderListFeed,
  (prevProps, nextProps) => prevProps.item === nextProps.item
);
