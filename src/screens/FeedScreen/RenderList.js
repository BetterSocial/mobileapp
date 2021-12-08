import PropTypes from 'prop-types';
import React from 'react';
import SimpleToast from 'react-native-simple-toast';
import analytics from '@react-native-firebase/analytics';
import dynamicLinks from '@react-native-firebase/dynamic-links';
import {Dimensions, Share, StatusBar, StyleSheet, View, Platform} from 'react-native';
import {useBottomTabBarHeight} from '@react-navigation/bottom-tabs';
import {useNavigation} from '@react-navigation/core';

import Content from './Content';
import ContentLink from './ContentLink';
import ContentPoll from './ContentPoll';
import Header from './Header';
import StringConstant from '../../utils/string/StringConstant';
import {Footer, Gap, PreviewComment} from '../../components';
import {
  POST_TYPE_LINK,
  POST_TYPE_POLL,
  POST_TYPE_STANDARD,
} from '../../utils/constants';
import {colors} from '../../utils/colors';
import {getCountCommentWithChild} from '../../utils/getstream';
import {linkContextScreenParamBuilder} from '../../utils/navigation/paramBuilder';

const FULL_WIDTH = Dimensions.get('screen').width;
const FULL_HEIGHT = Dimensions.get('screen').height;
const tabBarHeight = StatusBar.currentHeight;

const getHeightHeader = () => {
  let h = Math.floor((FULL_HEIGHT * 8.3) / 100);
  return h;
};

const majorVersion = parseInt(Platform.Version, 10)

const styles = StyleSheet.create({
  cardContainer: (bottomHeight) => ({
    height: FULL_HEIGHT - bottomHeight - tabBarHeight,
    width: FULL_WIDTH,
    backgroundColor: colors.white,
    borderBottomWidth: 7,
    borderBottomColor: colors.lightgrey,
  }),
  cardMain: {
    height: '100%',
    width: '100%',
    paddingVertical : Platform.OS === 'ios' && majorVersion >=10 ? 30 : 0,
  },
  footerWrapper: (h) => ({height: h}),
  contentReaction: (heightReaction) => ({
    height: heightReaction,
    marginBottom: heightReaction <= 0 ? tabBarHeight + 10 : 0
  }),
});

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
    let param = linkContextScreenParamBuilder(
      item,
      item.og.domain,
      item.og.domainImage,
      item.og.domain_page_id,
    );
    navigation.push('LinkContextScreen', param);
  };

  const getHeightFooter = () => {
    let h = Math.floor(((FULL_HEIGHT - tabBarHeight -bottomHeight ) * 6.8) / 100);
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
    setLoadingVote(true);
    if(voteStatus === 'upvote') {
      setTotalVote((prevState) => prevState - 2)
      setVoteStatus('downvote')
    }
    if(voteStatus === 'downvote') {
      setTotalVote((prevState) => prevState + 1)
      setVoteStatus('none')
    }
    if(voteStatus === 'none') {
      setTotalVote((prevState) => prevState - 1)
      setVoteStatus('downvote')
    }
    setStatusDowvote((prev) => !prev); 
    await postApiDownvote(!statusDownvote);
  };

  const onPressUpvoteHandle = async () => {
    setLoadingVote(true);
  
    if(voteStatus === 'upvote') {
      setTotalVote((prevState) => prevState - 1)
      setVoteStatus('none')
    }
    if(voteStatus === 'downvote') {
      setTotalVote((prevState) => prevState +2)
      setVoteStatus('upvote')
    }
    if(voteStatus === 'none') {
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
        status: status,
        feed_group: 'main_feed',
      });
      if (processData.code == 200) {
        setLoadingVote(false);
        return;
        // return SimpleToast.show('Success Vote', SimpleToast.SHORT);
      }
      setLoadingVote(false);
    } catch(e) {
      setLoadingVote(false);
      console.log(e)
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
        return;
      }
      setLoadingVote(false);
    } catch (e) {
      setLoadingVote(false);
      console.log(e)
      return SimpleToast.show(StringConstant.downvoteFailedText, SimpleToast.SHORT);
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

  const checkVotes = () => {
    const findUpvote = item && item.own_reactions && item.own_reactions.upvotes && item.own_reactions.upvotes.find((vote) => vote.user_id === selfUserId)
    const findDownvote = item && item.own_reactions && item.own_reactions.downvotes && item.own_reactions.downvotes.find((vote) => vote.user_id === selfUserId)
    if(findUpvote) {
      setVoteStatus('upvote')
      setStatusUpvote(true)
    } else if(findDownvote) {
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
    <View style={[styles.cardContainer(bottomHeight)]}>
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
                : selfUserId === item.actor.id
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

export default RenderListFeed;
