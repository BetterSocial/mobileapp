import * as React from 'react';
import Toast from 'react-native-simple-toast';
import moment from 'moment';
import {
  Dimensions,
  Keyboard,
  ScrollView,
  StatusBar,
  StyleSheet,
  View,
  useWindowDimensions
} from 'react-native';
import {useNavigation} from '@react-navigation/core';
import {useRoute} from '@react-navigation/native';

import BlockComponent from '../BlockComponent';
import ContainerComment from '../Comments/ContainerComment';
import Content from './elements/Content';
import Header from '../../screens/FeedScreen/Header';
import LoadingWithoutModal from '../LoadingWithoutModal';
import ShareUtils from '../../utils/share';
import StringConstant from '../../utils/string/StringConstant';
import WriteComment from '../Comments/WriteComment';
import useFeed from '../../screens/FeedScreen/hooks/useFeed';
import usePostHook from '../../hooks/core/post/usePostHook';
import useWriteComment from '../Comments/hooks/useWriteComment';
import AnalyticsEventTracking, {
  BetterSocialEventTracking
} from '../../libraries/analytics/analyticsEventTracking';
import usePostContextHook, {CONTEXT_SOURCE} from '../../hooks/usePostContextHooks';
import {
  ANALYTICS_SHARE_POST_FEED_ID,
  ANALYTICS_SHARE_POST_PDP_SCREEN,
  POST_TYPE_STANDARD,
  SOURCE_PDP
} from '../../utils/constants';
import {COLORS} from '../../utils/theme';
import {Context} from '../../context';
import {Footer} from '..';
import {Shimmer} from '../Shimmer/Shimmer';
import {createChildCommentV3, createCommentParentV3, getCommentList} from '../../service/comment';
import {downVote, upVote} from '../../service/vote';
import {fonts, normalize} from '../../utils/fonts';
import {getCountCommentWithChildInDetailPage} from '../../utils/getstream';
import {getFeedDetail} from '../../service/post';
import {saveComment} from '../../context/actions/comment';
import {setFeedByIndex} from '../../context/actions/feeds';
import {showScoreAlertDialog} from '../../utils/Utils';
import {useFeedDataContext} from '../../hooks/useFeedDataContext';

const {width, height} = Dimensions.get('window');
const FULL_WIDTH = Dimensions.get('screen').width;

const PostPageDetailIdComponent = (props) => {
  const {
    feedId,
    contextSource = CONTEXT_SOURCE.FEEDS,
    haveSeeMore,
    parentData,
    isKeyboardOpen,
    fromFeeds
  } = props;
  const [profile] = React.useContext(Context).profile;
  const [loading, setLoading] = React.useState(true);
  const [, setReaction] = React.useState(false);
  const [textComment, setTextComment] = React.useState('');
  const [typeComment, setTypeComment] = React.useState('parent');
  const [, setTotalComment] = React.useState(0);
  const [totalVote, setTotalVote] = React.useState(0);
  const [voteStatus, setVoteStatus] = React.useState('none');
  const [statusUpvote, setStatusUpvote] = React.useState(false);
  const [statusDownvote, setStatusDowvote] = React.useState(false);
  const [loadingPost, setLoadingPost] = React.useState(false);
  const [reactionId, setReactionId] = React.useState('');
  const [replyUsername, setReplyUsername] = React.useState('');
  const navigation = useNavigation();
  const route = useRoute();
  const [item, setItem] = React.useState(route?.params?.data);
  const scrollViewRef = React.useRef(null);
  const refBlockComponent = React.useRef();
  const [feedsContext, dispatch] = useFeedDataContext(contextSource);
  const [commenListParam] = React.useState({
    limit: 100
  });
  const {getTotalReaction, getHeightHeader} = useFeed();
  const [commentContext, dispatchComment] = React.useContext(Context).comments;
  const {comments} = commentContext;
  const [loadingGetComment, setLoadingGetComment] = React.useState(false);
  const {updateFeedContext} = usePostContextHook(contextSource);
  const {updateFeedContext: updateTopicContext} = usePostContextHook(CONTEXT_SOURCE.TOPIC_FEEDS);
  const {width: displayWidth} = useWindowDimensions();

  const {handleUserName} = useWriteComment();
  const getComment = async (scrollToBottom, noNeedLoading) => {
    if (!noNeedLoading) {
      setLoadingGetComment(true);
    }
    const queryParam = new URLSearchParams(commenListParam).toString();
    const response = await getCommentList(feedId, queryParam);
    saveComment(response.data.data, dispatchComment);
    setLoadingGetComment(false);
    if (scrollToBottom) {
      setTimeout(() => {
        onBottomPage();
      }, 300);
    }
  };

  React.useEffect(() => {
    getComment();
  }, []);

  const handleVote = (data = {}) => {
    const upvote = data.upvotes ? data.upvotes : 0;
    const downvotes = data.downvotes ? data.downvotes : 0;
    setTotalVote(upvote - downvotes);
  };
  const initial = () => {
    const reactionCount = item?.reaction_counts;
    if (JSON.stringify(reactionCount) !== '{}' && reactionCount) {
      let count = 0;
      const {comment} = reactionCount;
      handleVote(reactionCount);
      if (reactionCount?.comment !== undefined) {
        if (reactionCount?.comment > 0) {
          if (comment > 0) {
            setReaction(true);
            setTotalComment(getCountCommentWithChildInDetailPage(item.latest_reactions));
          }
        }
        const upvote = reactionCount.upvotes;
        if (upvote !== undefined) {
          count += upvote;
        }
        const downvote = reactionCount.downvotes;
        if (downvote !== undefined) {
          count -= downvote;
        }
        setTotalVote(count);
      }
    }
  };

  const onBottomPage = () => {
    if (scrollViewRef && scrollViewRef.current) {
      scrollViewRef.current.scrollToEnd({animated: true});
    }
  };

  const getDetailFeed = async () => {
    if (!route.params.isCaching) {
      try {
        setLoading(true);
        const data = await getFeedDetail(feedId);
        setItem(data?.data);
        setLoading(false);
        if (route.params.is_from_pn) {
          setTimeout(() => {
            onBottomPage();
          }, 300);
        }
      } catch (e) {
        setLoading(false);
        Toast.show(
          e?.response?.data?.message || 'Failed to load feed - please try again',
          Toast.LONG
        );
        navigation.goBack();
      }
    } else {
      setItem(route.params.data);
      setLoading(false);
    }
  };

  React.useEffect(() => {
    initial();
  }, [item]);

  React.useEffect(() => {
    getDetailFeed();
  }, []);

  const updateFeed = async (isSort) => {
    try {
      const data = await getFeedDetail(feedId);
      let oldData = {...data?.data};
      if (isSort) {
        oldData = {
          ...oldData,
          latest_reactions: {
            ...oldData?.latest_reactions,
            comment: oldData?.latest_reactions?.comment.sort(
              (a, b) => moment(a.updated_at).unix() - moment(b.updated_at).unix()
            )
          }
        };
      }
      setLoadingPost(false);
      if (data) {
        await getComment(true, true);
      }
      updateAllContent(oldData);
      Keyboard.dismiss();
    } catch (e) {
      if (__DEV__) {
        console.log(e);
      }
    }
  };

  const commentParent = async (isAnonimity, anonimityData) => {
    setLoadingPost(true);
    try {
      if (textComment.trim() !== '') {
        let sendData = {
          activity_id: item.id,
          message: textComment,
          sendPostNotif: true,
          anonimity: isAnonimity,
          is_you: true
        };

        const anonUser = {
          emoji_name: anonimityData.emojiName,
          color_name: anonimityData.colorName,
          emoji_code: anonimityData.emojiCode,
          color_code: anonimityData.colorCode,
          is_anonymous: isAnonimity,
          is_you: true
        };
        if (isAnonimity) {
          sendData = {...sendData, anon_user_info: anonUser};
        }
        const data = await createCommentParentV3(sendData);
        updateCachingComment(data?.data);
        if (data.code === 200) {
          setTextComment('');
          updateFeed(true);
        } else {
          Toast.show(StringConstant.generalCommentFailed, Toast.LONG);
          setLoadingPost(false);
        }
      } else {
        Toast.show('Comments are empty', Toast.LONG);
        setLoadingPost(false);
      }
    } catch (e) {
      setLoadingPost(false);
      Toast.show(StringConstant.generalCommentFailed, Toast.LONG);
    }
  };

  const commentChildren = async (isAnonimity, anonimityData) => {
    setLoadingPost(true);
    try {
      if (textComment.trim() !== '') {
        const data = await createChildCommentV3(
          textComment,
          reactionId,
          true,
          item.id,
          isAnonimity,
          anonimityData
        );
        scrollViewRef.current.scrollToEnd();
        if (data.code === 200) {
          setTextComment('');
          setReplyUsername('');
          setTypeComment('parent');
          updateFeed(true);
        } else {
          Toast.show(StringConstant.generalCommentFailed, Toast.LONG);
          setLoadingPost(false);
        }
      }
    } catch (error) {
      Toast.show(StringConstant.generalCommentFailed, Toast.LONG);
      setLoadingPost(false);
    }
  };

  const onComment = (isAnonimity, anonimityData) => {
    if (typeComment === 'parent') {
      commentParent(isAnonimity, anonimityData);
      if (props?.refreshParent) {
        props.refreshParent();
      }
    } else {
      commentChildren(isAnonimity, anonimityData);
    }

    AnalyticsEventTracking.eventTrack(
      BetterSocialEventTracking.PDP_COMMENT_SEND_REPLY_BUTTON_CLICKED
    );
  };

  const onCommentButtonClicked = () => {
    scrollViewRef.current.scrollToEnd();
  };

  const updateAllContent = (newFeed) => {
    if (item && item.id) {
      const mappingData = feedsContext.feeds.map((feed) => {
        if (feed.id === item.id) {
          return {...feed, ...newFeed};
        }
        return {...feed};
      });
      updateFeedContext(mappingData);
    }
  };

  const updateUpvoteTypeHasData = (feed, data, response) => {
    return {
      ...feed,
      reaction_counts: {
        ...feed.reaction_counts,
        upvotes: feed.reaction_counts.upvotes + 1,
        downvotes:
          voteStatus === 'downvote'
            ? feed.reaction_counts.downvotes - 1
            : feed.reaction_counts.downvotes
      },
      own_reactions: {
        ...feed.own_reactions,
        upvotes:
          typeof feed.own_reactions === 'object' ? data : feed.own_reactions.push(response.data),
        downvotes:
          voteStatus === 'downvote'
            ? feed.own_reactions.downvotes.filter(
                (react) => react.user_id !== profile.myProfile.user_id
              )
            : feed.own_reactions.downvotes
      }
    };
  };

  const updateUpvoteTypeNotHaveData = (feed) => {
    return {
      ...feed,
      reaction_counts: {...feed.reaction_counts, upvotes: feed.reaction_counts.upvotes - 1},
      own_reactions: {
        ...feed.own_reactions,
        upvotes: Array.isArray(feed.own_reactions.upvotes)
          ? feed.own_reactions.upvotes.filter(
              (react) => react.user_id !== profile.myProfile.user_id
            )
          : []
      }
    };
  };

  const updateDownvoteHasData = (feed, data, response) => {
    return {
      ...feed,
      reaction_counts: {
        ...feed.reaction_counts,
        downvotes: feed.reaction_counts.downvotes + 1,
        upvotes:
          voteStatus === 'upvote' ? feed.reaction_counts.upvotes - 1 : feed.reaction_counts.upvotes
      },
      own_reactions: {
        ...feed.own_reactions,
        downvotes:
          typeof feed.own_reactions === 'object' ? data : feed.own_reactions.push(response.data),
        upvotes:
          voteStatus === 'upvote'
            ? feed.own_reactions.upvotes.filter(
                (react) => react.user_id !== profile.myProfile.user_id
              )
            : feed.own_reactions.upvotes
      }
    };
  };

  const updateDownvoteNotHasData = (feed) => {
    return {
      ...feed,
      reaction_counts: {...feed.reaction_counts, downvotes: feed.reaction_counts.downvotes - 1},
      own_reactions: {
        ...feed.own_reactions,
        downvotes: Array.isArray(feed.own_reactions.downvotes)
          ? feed.own_reactions.downvotes.filter(
              (react) => react.user_id !== profile.myProfile.user_id
            )
          : []
      }
    };
  };

  const updateListFeed = (response, type, data, name = 'feeds', defaultContext = feedsContext) => {
    const mappingData = defaultContext[name]?.map((feed) => {
      if (feed.id === item.id) {
        if (type === 'upvote') {
          if (response.data) {
            return updateUpvoteTypeHasData(feed, data, response);
          }
          return updateUpvoteTypeNotHaveData(feed);
        }
        if (response.data) {
          return updateDownvoteHasData(feed, data, response);
        }
        return updateDownvoteNotHasData(feed);
      }
      return {...feed};
    });
    return mappingData;
  };
  const findVoteAndUpdate = (response, type) => {
    const data = [];
    data.push(response.data);
    const mappingDataFeed = updateListFeed(response, type, data);
    const mappingDataTopic = updateListFeed(response, type, data, 'topicFeeds');
    updateFeedContext(mappingDataFeed);
    updateTopicContext(mappingDataTopic);
  };

  const updateCachingComment = (comment) => {
    const mappingData = feedsContext.feeds.map((feed) => {
      if (feed.id === item.id) {
        let joinComment = [];
        if (Array.isArray(feed?.latest_reactions?.comment)) {
          joinComment = [...feed?.latest_reactions?.comment, comment].sort(
            (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
          );
        } else {
          joinComment.push(comment);
        }
        return {...feed, latest_reactions: {...feed.latest_reactions, comment: joinComment}};
      }
      return {...feed};
    });
    updateFeedContext(mappingData);
  };
  const findCommentAndUpdate = (id, newData, level) => {
    let newCommenList = [];
    if (level > 0) {
      const updatedComment = comments.map((comment) => {
        if (comment.id === newData.parent) {
          const findComment = comment?.latest_children?.comment.map((comment1) => {
            if (comment1.id === newData.id) {
              return {...comment1, ...newData};
            }
            return {...comment1};
          });
          return {
            ...comment,
            latest_children: {...comment.latest_children, comment: findComment}
          };
        }
        return {...comment};
      });
      newCommenList = updatedComment;
    } else {
      const updatedComment = comments.map((comment) => {
        if (comment.id === id) {
          return {...comment, ...newData};
        }
        return {...comment};
      });
      newCommenList = updatedComment;
    }
    saveComment(newCommenList, dispatchComment);
    findReduxCommentAndUpdate(newCommenList);
  };

  const findReduxCommentAndUpdate = (comment) => {
    const mappingData = feedsContext.feeds.map((feed) => {
      if (feed.id === item.id) {
        return {...feed, latest_reactions: {...feed.latest_reactions, comment}};
      }
      return {...feed};
    });
    updateFeedContext(mappingData);
  };

  const setUpVote = async (status) => {
    const data = {
      activity_id: item.id,
      status,
      feed_group: 'main_feed'
    };
    const processData = await upVote(data);
    findVoteAndUpdate(processData, 'upvote');
  };
  const setDownVote = async (status) => {
    const data = {
      activity_id: item.id,
      status,
      feed_group: 'main_feed'
    };
    const processData = await downVote(data);
    findVoteAndUpdate(processData, 'downvote');
  };

  const onNewPollFetched = (newPolls, index) => {
    setFeedByIndex(
      {
        index,
        singleFeed: newPolls
      },
      dispatch
    );
  };

  const onPressDownVoteHandle = async () => {
    setStatusDowvote((prev) => !prev);
    if (voteStatus === 'upvote') {
      setTotalVote((prevState) => prevState - 2);
      setVoteStatus('downvote');
    }
    if (voteStatus === 'downvote') {
      setTotalVote((prevState) => prevState + 1);
      setVoteStatus('none');
    }
    if (voteStatus === 'none') {
      setTotalVote((prevState) => prevState - 1);
      setVoteStatus('downvote');
    }
    setDownVote(!statusDownvote);
    const isDownvoteInsertedEventTrackEligible = voteStatus === 'upvote' || voteStatus === 'none';

    const isDownvoteRemovedEventTrackEligible = voteStatus === 'downvote';

    if (isDownvoteInsertedEventTrackEligible)
      AnalyticsEventTracking.eventTrack(BetterSocialEventTracking.PDP_POST_DOWNVOTE_INSERTED);

    if (isDownvoteRemovedEventTrackEligible)
      AnalyticsEventTracking.eventTrack(BetterSocialEventTracking.PDP_POST_DOWNVOTE_REMOVED);
  };

  const onPressUpvoteHandle = async () => {
    setStatusUpvote((prev) => !prev);
    if (voteStatus === 'upvote') {
      setTotalVote((prevState) => prevState - 1);
      setVoteStatus('none');
    }
    if (voteStatus === 'downvote') {
      setTotalVote((prevState) => prevState + 2);
      setVoteStatus('upvote');
    }
    if (voteStatus === 'none') {
      setTotalVote((prevState) => prevState + 1);
      setVoteStatus('upvote');
    }
    setUpVote(!statusUpvote);

    const isUpvoteInsertedEventTrackEligible = voteStatus === 'downvote' || voteStatus === 'none';

    const isUpvoteRemovedEventTrackEligible = voteStatus === 'upvote';

    if (isUpvoteInsertedEventTrackEligible)
      AnalyticsEventTracking.eventTrack(BetterSocialEventTracking.PDP_POST_UPVOTE_INSERTED);

    if (isUpvoteRemovedEventTrackEligible)
      AnalyticsEventTracking.eventTrack(BetterSocialEventTracking.PDP_POST_UPVOTE_REMOVED);
  };

  const handleRefreshComment = async () => {
    await getComment(false, true);
  };

  const handleRefreshChildComment = async () => {
    await getComment(false, true);
  };

  const checkVotes = () => {
    const findUpvote =
      item &&
      item.own_reactions &&
      item.own_reactions.upvotes &&
      Array.isArray(item.own_reactions.upvotes) &&
      item.own_reactions.upvotes.find((reaction) => reaction.user_id === profile.myProfile.user_id);
    const findDownvote =
      item &&
      item.own_reactions &&
      item.own_reactions.downvotes &&
      Array.isArray(item.own_reactions.downvotes) &&
      item.own_reactions.downvotes.find(
        (reaction) => reaction.user_id === profile.myProfile.user_id
      );
    if (findUpvote) {
      setVoteStatus('upvote');
      setStatusUpvote(true);
    }
    if (findDownvote) {
      setVoteStatus('downvote');
      setStatusDowvote(true);
    }
    if (!findDownvote && !findUpvote) {
      setVoteStatus('none');
    }
  };

  React.useEffect(() => {
    checkVotes();
  }, [item]);

  React.useEffect(
    () => () => {
      updateFeed(true);
    },
    []
  );

  const handleOnPressScore = () => {
    showScoreAlertDialog(item);
  };

  const handleUpdateVote = () => {
    getComment(false, true);
  };

  const {followUnfollow} = usePostHook();

  const isShortText =
    item && item.images_url.length <= 0 && item.post_type === POST_TYPE_STANDARD && !haveSeeMore;

  return (
    <View style={styles.container}>
      {loading && !route.params.isCaching ? <LoadingWithoutModal /> : null}
      <StatusBar translucent={false} barStyle={'light-content'} />
      {item ? (
        <React.Fragment>
          <Header
            isPostDetail={true}
            hideThreeDot={false}
            props={item}
            item={item}
            isBackButton={true}
            source={SOURCE_PDP}
            height={getHeightHeader()}
            isFollow={item?.is_following_target}
            onPressFollUnFoll={() => {
              followUnfollow(item);
              setItem({...item, is_following_target: !item?.is_following_target});
            }}
            isFromFeeds={fromFeeds}
            isShortText={isShortText}
          />

          <ScrollView
            ref={scrollViewRef}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
            nestedScrollEnabled={true}>
            <ScrollView nestedScrollEnabled>
              <Content
                message={item.message}
                images_url={item.images_url}
                style={styles.additionalContentStyle(item?.images_url?.length, height)}
                topics={item?.topics}
                item={item}
                onnewpollfetched={onNewPollFetched}
                isPostDetail={true}
                haveSeeMore={haveSeeMore}
                parentData={parentData || item}
              />
              <Footer
                item={item}
                disableComment={false}
                totalComment={getTotalReaction(item)}
                totalVote={totalVote}
                onPressDownVote={onPressDownVoteHandle}
                onPressUpvote={onPressUpvoteHandle}
                statusVote={voteStatus}
                onPressShare={() =>
                  ShareUtils.shareFeeds(
                    item,
                    ANALYTICS_SHARE_POST_PDP_SCREEN,
                    ANALYTICS_SHARE_POST_FEED_ID
                  )
                }
                onPressComment={onCommentButtonClicked}
                showScoreButton={profile?.myProfile?.is_backdoor_user}
                onPressScore={handleOnPressScore}
                onPressBlock={() => refBlockComponent.current.openBlockComponent(item)}
                isSelf={profile.myProfile.user_id === item.actor?.id}
                isShowDM
                isShortText={isShortText}
              />
            </ScrollView>
            {loadingGetComment ? (
              <View>
                {Array.from(Array(10).keys()).map((_, index) => (
                  <View key={index} style={{marginVertical: normalize(10)}}>
                    <Shimmer height={20} width={displayWidth} />
                  </View>
                ))}
              </View>
            ) : (
              comments.length > 0 && (
                <ContainerComment
                  feedId={feedId}
                  itemParent={item}
                  comments={comments}
                  isLoading={loadingPost}
                  refreshComment={handleRefreshComment}
                  refreshChildComment={handleRefreshChildComment}
                  findCommentAndUpdate={findCommentAndUpdate}
                  contextSource={contextSource}
                  updateVote={handleUpdateVote}
                  isShortText={isShortText}
                  onReplyButtonClick={(reactiondId, username, level) => {
                    if (level === 0 || level === 1) {
                      setTypeComment('child');
                    }
                    setReactionId(reactiondId);
                    setReplyUsername(username);
                    AnalyticsEventTracking.eventTrack(
                      BetterSocialEventTracking.PDP_COMMENT_REPLY_BUTTON_CLICKED
                    );
                  }}
                  eventTrackName={{
                    confirmDelete: BetterSocialEventTracking.PDP_COMMENT_DELETE_ALERT_CONFIRM,
                    cancelDelete: BetterSocialEventTracking.PDP_COMMENT_DELETE_ALERT_CANCEL,
                    upvoteInserted: BetterSocialEventTracking.PDP_COMMENT_UPVOTE_INSERTED,
                    upvoteRemoved: BetterSocialEventTracking.PDP_COMMENT_UPVOTE_REMOVED,
                    downvoteInserted: BetterSocialEventTracking.PDP_COMMENT_DOWNVOTE_INSERTED,
                    downvoteRemoved: BetterSocialEventTracking.PDP_COMMENT_DOWNVOTE_REMOVED
                  }}
                />
              )
            )}
          </ScrollView>

          <WriteComment
            postId={feedId}
            username={replyUsername || handleUserName(item)}
            value={textComment}
            onChangeText={(value) => setTextComment(value)}
            onPress={onComment}
            loadingPost={loadingPost}
            isKeyboardOpen={isKeyboardOpen}
            onClear={() => {
              setTextComment('');
              setTypeComment('parent');
              setReplyUsername('');
            }}
            isReply={typeComment === 'child' && replyUsername}
            eventTrackName={{
              anonimityChangedToOn: BetterSocialEventTracking.PDP_COMMENT_INPUT_ANON_ON,
              anonimityChangedToOff: BetterSocialEventTracking.PDP_COMMENT_INPUT_ANON_OFF
            }}
          />

          <BlockComponent ref={refBlockComponent} refresh={updateFeed} screen="post_detail_page" />
        </React.Fragment>
      ) : null}
    </View>
  );
};

export default PostPageDetailIdComponent;

const styles = StyleSheet.create({
  container: {
    width: FULL_WIDTH,
    backgroundColor: COLORS.gray110,
    flex: 1
  },
  additionalContentStyle: (imageLength, h) => {
    if (imageLength > 0) {
      return {
        height: h * 0.5
      };
    }
    return {};
  }
});
