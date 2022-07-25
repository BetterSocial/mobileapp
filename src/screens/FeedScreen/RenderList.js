import PropTypes from 'prop-types';
import React from 'react';
import SimpleToast from 'react-native-simple-toast';
import { Dimensions, Platform, Share, StatusBar, StyleSheet, Text, View } from 'react-native';
import { useBottomTabBarHeight } from '@react-navigation/bottom-tabs';
import { useNavigation } from '@react-navigation/core';

import Content from './Content';
import ContentLink from './ContentLink';
import ContentPoll from './ContentPoll';
import Header from './Header';
import Log from '../../utils/log/Log';
import ShareUtils from '../../utils/share'
import StringConstant from '../../utils/string/StringConstant';
import dimen from '../../utils/dimen';
import {
  ANALYTICS_SHARE_POST_FEED_ID,
  ANALYTICS_SHARE_POST_FEED_SCREEN,
  POST_TYPE_LINK,
  POST_TYPE_POLL,
  POST_TYPE_STANDARD,
  SOURCE_FEED_TAB,
} from '../../utils/constants';
import { Footer, Gap, PreviewComment } from '../../components';
import { colors } from '../../utils/colors';
import { fonts } from '../../utils/fonts';
import { getCommentLength, getCountCommentWithChild } from '../../utils/getstream';
import { linkContextScreenParamBuilder } from '../../utils/navigation/paramBuilder';
import { showScoreAlertDialog } from '../../utils/Utils'

const FULL_WIDTH = Dimensions.get('screen').width;
const FULL_HEIGHT = Dimensions.get('screen').height;
const tabBarHeight = StatusBar.currentHeight;

const getHeightHeader = () => 
  // let h = Math.floor((FULL_HEIGHT * 10) / 100);
  // return h;
   dimen.size.FEED_HEADER_HEIGHT
;

const majorVersion = parseInt(Platform.Version, 10)

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
  const navigation = useNavigation();
  const [totalVote, setTotalVote] = React.useState(0);
  const [statusDownvote, setStatusDowvote] = React.useState(false);
  const [voteStatus, setVoteStatus] = React.useState('none');
  const [statusUpvote, setStatusUpvote] = React.useState(false);
  const [previewComment, setPreviewComment] = React.useState({});
  const [isReaction, setReaction] = React.useState(false);
  const [loadingVote, setLoadingVote] = React.useState(false);
  const bottomHeight = useBottomTabBarHeight();
  const navigateToLinkContextPage = (item) => {
    const param = linkContextScreenParamBuilder(
      item,
      item.og.domain,
      item.og.domainImage,
      item.og.domain_page_id,
    );
    navigation.push('LinkContextScreen', param);
  };

  const getHeightFooter = () => {
    const h = Math.floor(((FULL_HEIGHT - tabBarHeight - bottomHeight) * 7) / 100);
    return h;
  };

  const getHeightReaction = () => 
    // let h = Math.floor(((FULL_HEIGHT) * 16) / 100);
    // return h;
     dimen.size.FEED_COMMENT_CONTAINER_HEIGHT
  ;

  const onPressDownVoteHandle = async () => {
    // setLoadingVote(true);
    if (voteStatus === 'upvote') {
      setTotalVote((prevState) => prevState - 2)
      setVoteStatus('downvote')
    }
    if (voteStatus === 'downvote') {
      setTotalVote((prevState) => prevState + 1)
      setVoteStatus('none')
    }
    if (voteStatus === 'none') {
      setTotalVote((prevState) => prevState - 1)
      setVoteStatus('downvote')
    }
    setStatusDowvote((prev) => !prev);
    await postApiDownvote(!statusDownvote);
  };

  const onPressUpvoteHandle = async () => {
    // setLoadingVote(true);

    if (voteStatus === 'upvote') {
      setTotalVote((prevState) => prevState - 1)
      setVoteStatus('none')
    }
    if (voteStatus === 'downvote') {
      setTotalVote((prevState) => prevState + 2)
      setVoteStatus('upvote')
    }
    if (voteStatus === 'none') {
      setTotalVote((prevState) => prevState + 1)
      setVoteStatus('upvote')
    }
    setStatusUpvote((prev) => !prev);
    await postApiUpvote(!statusUpvote);
  };
  const handleVote = (data = {}) => {
    const upvote = data.upvotes ? data.upvotes : 0
    const downvotes = data.downvotes ? data.downvotes : 0
    setTotalVote(upvote - downvotes)
  };

  const postApiUpvote = async (status) => {
    try {
      const processData = await onPressUpvote({
        activity_id: item.id,
        status,
        feed_group: 'main_feed',
      });
      if (processData.code == 200) {
        // setLoadingVote(false);
        return;
        // return SimpleToast.show('Success Vote', SimpleToast.SHORT);
      }
      // setLoadingVote(false);
    } catch (e) {
      // setLoadingVote(false);
      return SimpleToast.show(StringConstant.upvoteFailedText, SimpleToast.SHORT);
    }
  };
  const postApiDownvote = async (status) => {
    try {
      const processData = await onPressDownVote({
        activity_id: item.id,
        status,
        feed_group: 'main_feed',
      });
      if (processData.code == 200) {
        // setLoadingVote(false);
        return;
      }
      // setLoadingVote(false);
    } catch (e) {
      // setLoadingVote(false);
      return SimpleToast.show(StringConstant.downvoteFailedText, SimpleToast.SHORT);
    }
  };

  const initial = () => {
    const reactionCount = item.reaction_counts;
    if (JSON.stringify(reactionCount) !== '{}') {
      const {comment} = reactionCount;
      handleVote(reactionCount);
      if (comment !== undefined) {
        if (comment > 0) {
          setReaction(true);
          setPreviewComment(item.latest_reactions.comment[0]);
        }
      }
    }
  };


  const checkVotes = () => {
    const findUpvote = item && item.own_reactions && item.own_reactions.upvotes && item.own_reactions.upvotes.find((vote) => vote.user_id === selfUserId)
    const findDownvote = item && item.own_reactions && item.own_reactions.downvotes && item.own_reactions.downvotes.find((vote) => vote.user_id === selfUserId)
    if (findUpvote) {
      setVoteStatus('upvote')
      setStatusUpvote(true)
    } else if (findDownvote) {
      setVoteStatus('downvote')
      setStatusDowvote(true)
    } else {
      setVoteStatus('none')
    }
  }

  React.useEffect(() => {
    checkVotes()
  }, [item]);

  React.useEffect(() => {
    initial();
  }, [item]);
  return (
    <>
        <Header props={item} height={getHeightHeader()} source={SOURCE_FEED_TAB} />
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
            topics={item?.topics}
          />
        )}

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
        {item.post_type === POST_TYPE_STANDARD && (
          <Content
            index={index}
            message={item.message}
            images_url={item.images_url}
            onPress={onPress}
            topics={item?.topics}
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
                comment={item.latest_reactions.comment[0].data.text}
                image={item.latest_reactions.comment[0].user.data.profile_pic_url}
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
