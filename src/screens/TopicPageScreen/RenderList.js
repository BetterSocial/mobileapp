import React from 'react';
import { View, Dimensions, StyleSheet, StatusBar, Share } from 'react-native';
import PropTypes from 'prop-types';
import { useNavigation } from '@react-navigation/core';
import analytics from '@react-native-firebase/analytics';
import dynamicLinks from '@react-native-firebase/dynamic-links';

import {
  POST_TYPE_POLL,
  POST_TYPE_LINK,
  POST_TYPE_STANDARD,
} from '../../utils/constants';

import { linkContextScreenParamBuilder } from '../../utils/navigation/paramBuilder';
import { colors } from '../../utils/colors';
import { Gap, PreviewComment, Footer } from '../../components';
import { getCountCommentWithChild } from '../../utils/getstream';
import SimpleToast from 'react-native-simple-toast';


import Header from '../FeedScreen/Header';
import ContentLink from '../FeedScreen/ContentLink';
import ContentPoll from '../FeedScreen/ContentPoll';
import Content from '../FeedScreen/Content';

const FULL_WIDTH = Dimensions.get('screen').width;
const FULL_HEIGHT = Dimensions.get('screen').height;
const tabBarHeight = StatusBar.currentHeight;

const getHeightHeader = () => {
  let h = Math.floor((FULL_HEIGHT * 8.3) / 100);
  return h;
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
    let h = Math.floor(((FULL_HEIGHT) * 16) / 100);
    return h;
  };

  const onShare = async (username) => {
    analytics().logEvent('feed_screen_btn_share', {
      id: 'btn_share',
    });
    try {
      const result = await Share.share({
        message: await buildLink(username),
      });
      if (result.action === Share.sharedAction) {
        if (result.activityType) {
          // shared with activity type of result.activityType
        } else {
          // shared
        }
      } else if (result.action === Share.dismissedAction) {
        // dismissed
      }
    } catch (error) {
      alert(error.message);
    }
  };
  async function buildLink(username) {
    const link = await dynamicLinks().buildLink(
      {
        link: `https://dev.bettersocial.org/${username}`,
        domainUriPrefix: 'https://bettersocialapp.page.link',
        analytics: {
          campaign: 'banner',
        },
        navigation: {
          forcedRedirectEnabled: false,
        },
        // ios: {
        //   bundleId: '',
        //   // customScheme: 'giftit',
        //   appStoreId: '',
        // },
        android: {
          packageName: 'org.bettersocial.dev',
        },
      },
      'SHORT',
    );
    return link;
  }

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
    const processData = await onPressUpvote({
      activity_id: item.id,
      status: status,
      feed_group: 'main_feed',
    });
    if (processData.code == 200) {
      setLoadingVote(false);
      return SimpleToast.show('Success Vote', SimpleToast.SHORT);
    }
    setLoadingVote(false);
  };
  const postApiDownvote = async (status) => {
    const processData = await onPressDownVote({
      activity_id: item.id,
      status: status,
      feed_group: 'main_feed',
    });
    if (processData.code == 200) {
      setLoadingVote(false);
      return SimpleToast.show('Success Vote', SimpleToast.SHORT);
    }
    setLoadingVote(false);
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
            onPressShare={() => onShare(item)}
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
        <View style={styles.contentReaction(isReaction ? getHeightReaction() : 0)}>
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
  cardContainer: (bottomHeight) => ({
    height: FULL_HEIGHT - tabBarHeight,
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
    height: heightReaction,
    marginBottom: heightReaction <= 0 ? tabBarHeight + 10 : 0
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

export default RenderListFeed;
