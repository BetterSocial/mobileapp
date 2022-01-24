import PropTypes from 'prop-types';
import React from 'react';
import SimpleToast from 'react-native-simple-toast';
import { Dimensions, Share, StatusBar, StyleSheet, View } from 'react-native';
import { useNavigation } from '@react-navigation/core';

import Content from '../FeedScreen/Content';
import ContentLink from '../FeedScreen/ContentLink';
import ContentPoll from '../FeedScreen/ContentPoll';
import Header from '../FeedScreen/Header';
import ShareUtils from '../../utils/share'
import dimen from '../../utils/dimen';
import { ANALYTICS_SHARE_POST_TOPIC_ID, ANALYTICS_SHARE_POST_TOPIC_SCREEN } from '../../utils/constants';
import { Footer, Gap, PreviewComment } from '../../components';
import {
  POST_TYPE_LINK,
  POST_TYPE_POLL,
  POST_TYPE_STANDARD,
} from '../../utils/constants';
import { colors } from '../../utils/colors';
import { getCountCommentWithChild } from '../../utils/getstream';
import { linkContextScreenParamBuilder } from '../../utils/navigation/paramBuilder';

const FULL_WIDTH = Dimensions.get('screen').width;
const FULL_HEIGHT = Dimensions.get('screen').height;
const tabBarHeight = StatusBar.currentHeight;

const getHeightHeader = () => {
  // let h = Math.floor((FULL_HEIGHT * 10) / 100);
  // return h;
  return dimen.size.FEED_HEADER_HEIGHT
};

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
    userId,
    onPressDownVote,
  } = props;
  const navigation = useNavigation();
  const [totalVote, setTotalVote] = React.useState(0);
  const [statusDownvote, setStatusDowvote] = React.useState(false);
  const [voteStatus, setVoteStatus] = React.useState('none');
  const [statusUpvote, setStatusUpvote] = React.useState(false);
  const [previewComment, setPreviewComment] = React.useState({});
  const [isReaction, setReaction] = React.useState(false);
  const [loadingVote, setLoadingVote] = React.useState(false);
  const navigateToLinkContextPage = (item) => {
    let param = linkContextScreenParamBuilder(
      item,
      item.og.domain,
      item.og.domainImage,
      item.og.domain_page_id,
    );
    navigation.push('LinkContextScreen', param);
  };

  const getHeightFooter = () => {
    let h = Math.floor(((FULL_HEIGHT) * 6.8) / 100);
    return h;
  };

  const getHeightReaction = () => {
    // let h = Math.floor(((FULL_HEIGHT) * 16) / 100);
    // return h;
    return dimen.size.FEED_COMMENT_CONTAINER_HEIGHT
  };

  const onPressDownVoteHandle = async () => {
    setStatusDowvote((prev) => !prev);
    setLoadingVote(true);
    if (totalVote === -1) {
      setVoteStatus('none');
      setTotalVote((prevState) => prevState + 1);
    } else if (totalVote === 0) {
      setVoteStatus('downvote');
      setTotalVote((prevState) => prevState - 1);
    } else {
      setVoteStatus('downvote');
      setTotalVote(-1);
      return postApiDownvote(true);
    }
    await postApiDownvote(!statusDownvote);
  };

  const onPressUpvoteHandle = async () => {
    setLoadingVote(true);
    setStatusUpvote((prev) => !prev);
    if (totalVote === 1) {
      setVoteStatus('none');
      setTotalVote((prevState) => prevState - 1);
    } else if (totalVote === 0) {
      setVoteStatus('upvote');
      setTotalVote((prevState) => prevState + 1);
    } else {
      setVoteStatus('upvote');
      setTotalVote(1);
      return await postApiUpvote(true)
    }
    await postApiUpvote(!statusUpvote);
  };

  const handleVote = (data = {}) => {
    if (data.downvotes > 0) {
      setVoteStatus('downvote');
      return setTotalVote(data.downvotes * -1);
    } else if (data.upvotes > 0) {
      setVoteStatus('upvote');
      return setTotalVote(data.upvotes);
    }
    setVoteStatus('none');
    return setTotalVote(0);
  };

  const postApiUpvote = async (status) => {
    try {
      const processData = await onPressUpvote({
        activity_id: item.id,
        status: status,
        feed_group: 'main_feed',
      });
      if (processData.code == 200) {
        setLoadingVote(false);
      }
      setLoadingVote(false);
    } catch (e) {
      setLoadingVote(false);
      return SimpleToast.show(StringConstant.upvoteFailedText, SimpleToast.SHORT);
    }
  };

  const postApiDownvote = async (status) => {
    try {
      const processData = await onPressDownVote({
        activity_id: item.id,
        status: status,
        feed_group: 'main_feed',
      });
      if (processData.code == 200) {
        setLoadingVote(false);
      } else {
        setLoadingVote(false);
      }
    } catch (e) {
      setLoadingVote(false);
      return SimpleToast.show(StringConstant.upvoteFailedText, SimpleToast.SHORT);
    }
  };

  const initial = () => {
    let reactionCount = item.reaction_counts;
    if (JSON.stringify(reactionCount) !== '{}') {
      let comment = reactionCount.comment;
      handleVote(reactionCount);
      if (comment !== undefined) {
        if (comment > 0) {
          setReaction(true);
          setPreviewComment(item.latest_reactions.comment[0]);
        }
      }
    }
  };

  React.useEffect(() => {
    const validationStatusVote = () => {
      if (item.reaction_counts !== undefined || null) {
        if (item.latest_reactions.upvotes !== undefined) {
          let upvote = item.latest_reactions.upvotes.filter(
            (vote) => vote.user_id === userId,
          );
          if (upvote !== undefined) {
            setVoteStatus('upvote');
            setStatusUpvote(true);
          }
        }

        if (item.latest_reactions.downvotes !== undefined) {
          let downvotes = item.latest_reactions.downvotes.filter(
            (vote) => vote.user_id === userId,
          );
          if (downvotes !== undefined) {
            setVoteStatus('downvote');
            setStatusDowvote(true);
          }
        }
      }
    };
    validationStatusVote();
  }, [item, userId]);

  React.useEffect(() => {
    initial();
  }, [item]);

  return (
    <View style={[styles.cardContainer()]}>
      <View style={styles.cardMain}>
        <Header props={item} height={getHeightHeader()} />
        {item.post_type === POST_TYPE_POLL && (
          <ContentPoll
            index={index}
            message={item.message}
            images_url={item.images_url}
            polls={item.pollOptions}
            onPress={() => onPress(item, index)}
            item={item}
            pollexpiredat={item.polls_expired_at}
            multiplechoice={item.multiplechoice}
            isalreadypolling={item.isalreadypolling}
            onnewpollfetched={onNewPollFetched}
            voteCount={item.voteCount}
          />
        )}

        {item.post_type === POST_TYPE_LINK && (
          <ContentLink
            index={index}
            og={item.og}
            onPress={() => onPress(item)}
            onHeaderPress={() => onPressDomain(item)}
            onCardContentPress={() => navigateToLinkContextPage(item)}
          />
        )}
        {item.post_type === POST_TYPE_STANDARD && (
          <Content
            index={index}
            message={item.message}
            images_url={item.images_url}
            onPress={onPress}
          />
        )}
        <View style={styles.footerWrapper(getHeightFooter())}>
          <Footer
            item={item}
            totalComment={getCountCommentWithChild(item)}
            totalVote={totalVote}
            onPressShare={() => ShareUtils.sharePostInTopic(item,
              ANALYTICS_SHARE_POST_TOPIC_SCREEN,
              ANALYTICS_SHARE_POST_TOPIC_ID
            )}
            onPressComment={() => onPressComment(item)}
            onPressBlock={() => onPressBlock(item)}
            onPressDownVote={onPressDownVoteHandle}
            onPressUpvote={onPressUpvoteHandle}
            statusVote={voteStatus}
            loadingVote={loadingVote}
            isSelf={
              item.anonimity
                ? false
                : userId === item.actor.id
                  ? true
                  : false
            }
          />
        </View>
        <View style={styles.contentReaction(getHeightReaction())}>
          {isReaction && (
            <React.Fragment>
              <PreviewComment
                user={previewComment.user}
                comment={previewComment.data.text}
                image={previewComment.user.data.profile_pic_url}
                time={previewComment.created_at}
                totalComment={getCountCommentWithChild(item) - 1}
                onPress={onPressComment}
              />
              <Gap height={8} />
            </React.Fragment>
          )}
        </View>

      </View>
    </View>
  );
};



const styles = StyleSheet.create({
  cardContainer: () => ({
    // height: FULL_HEIGHT - tabBarHeight,
    height: dimen.size.TOPIC_CURRENT_ITEM_HEIGHT,
    width: FULL_WIDTH,
    backgroundColor: colors.white,
    borderBottomWidth: 7,
    borderBottomColor: colors.lightgrey,
  }),
  cardMain: {
    height: '100%',
    width: '100%',
  },
  footerWrapper: (h) => ({ height: h }),
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
  userId: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  onPressUpvote: PropTypes.func,
  onPressDownVote: PropTypes.func,
  loading: PropTypes.bool,
};

function compare(prevProps, nextProps) {

  return JSON.stringify(prevProps) === JSON.stringify(nextProps);
}

const MemoizedListComponent = React.memo(RenderListFeed, compare);
export default MemoizedListComponent
