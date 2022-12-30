/* eslint-disable import/no-extraneous-dependencies */
import PropTypes from 'prop-types';
import React from 'react';
import SimpleToast from 'react-native-simple-toast';
import { StatusBar, StyleSheet, View } from 'react-native';

import Content from './Content';
import ContentLink from './ContentLink';
import Header from './Header';
import ShareUtils from '../../utils/share';
import StringConstant from '../../utils/string/StringConstant';
import useFeed from './hooks/useFeed';
import {
  ANALYTICS_SHARE_POST_FEED_ID,
  ANALYTICS_SHARE_POST_FEED_SCREEN,
  POST_TYPE_LINK,
  POST_TYPE_POLL,
  POST_TYPE_STANDARD,
  SOURCE_FEED_TAB
} from '../../utils/constants';
import { Footer, Gap, PreviewComment } from '../../components';
import { getCommentLength } from '../../utils/getstream';
import { showScoreAlertDialog } from '../../utils/Utils';

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
    onPressUpvote,
    selfUserId,
    onPressDownVote,
  } = props;
  const {totalVote, getHeightReaction, navigateToLinkContextPage, getHeightFooter, getHeightHeader, statusDownvote, statusUpvote, voteStatus, checkVotes, initialSetup, onPressUpvoteHook, onPressDownVoteHook} = useFeed()


  const onPressDownVoteHandle = async () => {
    onPressDownVoteHook()
    await postApiDownvote(!statusDownvote);
  };

  const onPressUpvoteHandle = async () => {
    onPressUpvoteHook()
    await postApiUpvote(!statusUpvote);
  };

  const postApiUpvote = async (status) => {
    try {
     await onPressUpvote({
        activity_id: item.id,
        status,
        feed_group: 'main_feed',
      });
    } catch (e) {
      SimpleToast.show(StringConstant.upvoteFailedText, SimpleToast.SHORT);
    }
  };
  const postApiDownvote = async (status) => {
    try {
     await onPressDownVote({
        activity_id: item.id,
        status,
        feed_group: 'main_feed',
      });
    } catch (e) {
      SimpleToast.show(StringConstant.downvoteFailedText, SimpleToast.SHORT);
    }
  };



  const checkVotesHandle = () => {
    checkVotes(item, selfUserId)
  }

  React.useEffect(() => {
    checkVotesHandle()
  }, [item]);

  React.useEffect(() => {
    initialSetup(item)
  }, [item]);
  return (
    <>
        <Header props={item} height={getHeightHeader()} source={SOURCE_FEED_TAB} />

        {item.post_type === POST_TYPE_LINK && (
          <ContentLink
            index={index}
            og={item.og}
            onPress={() => onPress(item)}
            onHeaderPress={() => onPressDomain(item)}
            onCardContentPress={() => navigateToLinkContextPage(item)}
            score={item?.credderScore}
            message={item?.message}
            messageContainerStyle={{paddingHorizontal: 10}}
            topics={item?.topics}
          />
        )}
        {(item.post_type === POST_TYPE_STANDARD || item.post_type === POST_TYPE_POLL) && (
            <Content
            index={index}
            message={item.message}
            images_url={item.images_url}
            onPress={onPress}
            topics={item?.topics}
            item={item}
            onNewPollFetched={onNewPollFetched}
          />
        )}
        <View style={styles.footerWrapper(getHeightFooter())}>
          <Footer
            item={item}
            totalComment={getCommentLength(item.latest_reactions.comment)}
            totalVote={totalVote}
            onPressShare={() => ShareUtils.shareFeeds(item,
              ANALYTICS_SHARE_POST_FEED_SCREEN,
              ANALYTICS_SHARE_POST_FEED_ID
            )}
            // onPressShare={() => {}}
            onPressComment={() => onPressComment(item)}
            onPressBlock={() => onPressBlock(item)}
            onPressDownVote={onPressDownVoteHandle}
            onPressUpvote={onPressUpvoteHandle}
            statusVote={voteStatus}
            // loadingVote={loadingVote}
            showScoreButton={true}
            onPressScore={() => showScoreAlertDialog(item)}
            isSelf={
              item.anonimity
                ? false
                : selfUserId === item.actor.id
            }
          />
        </View>
        {getCommentLength(item.latest_reactions.comment) > 0 && (
          <View style={styles.contentReaction(getHeightReaction())}>
            <React.Fragment>
              <PreviewComment
                user={item.latest_reactions.comment[0].user}
                comment={item?.latest_reactions?.comment[0]?.data?.text || ""}
                image={item?.latest_reactions?.comment[0]?.user?.data?.profile_pic_url || ""}
                time={item.latest_reactions.comment[0].created_at}
                totalComment={getCommentLength(item.latest_reactions.comment) - 1}
                onPress={onPressComment}
              />
              <Gap height={8} />
            </React.Fragment>
          </View>
        )}

</>
  );
};

const styles = StyleSheet.create({
  footerWrapper: (h) => ({ height: h + 10, }),
  contentReaction: (heightReaction) => ({
    maxHeight: heightReaction,
    marginBottom: heightReaction <= 0 ? tabBarHeight + 10 : 0,
  }),
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
  selfUserId: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  onPressUpvote: PropTypes.func,
  onPressDownVote: PropTypes.func,
  loading: PropTypes.bool,
};

export default React.memo (RenderListFeed, (prevProps, nextProps) => prevProps.item === nextProps.item);
