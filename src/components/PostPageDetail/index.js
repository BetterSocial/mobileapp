import * as React from 'react';
import Toast from 'react-native-simple-toast';
import moment from 'moment';
import {Dimensions, Keyboard, ScrollView, StatusBar, StyleSheet, View} from 'react-native';
import {useNavigation} from '@react-navigation/core';
import {useRoute} from '@react-navigation/native';

import BlockComponent from '../BlockComponent';
import ContainerComment from '../Comments/ContainerComment';
import Content from './elements/Content';
import ContentLink from './elements/ContentLink';
import Header from '../../screens/FeedScreen/Header';
import LoadingWithoutModal from '../LoadingWithoutModal';
import ShareUtils from '../../utils/share';
import StringConstant from '../../utils/string/StringConstant';
import WriteComment from '../Comments/WriteComment';
import usePostDetail from './hooks/usePostDetail';
import usePostContextHook, {CONTEXT_SOURCE} from '../../hooks/usePostContextHooks';
import {
  ANALYTICS_SHARE_POST_FEED_ID,
  ANALYTICS_SHARE_POST_PDP_SCREEN,
  POST_TYPE_LINK,
  SOURCE_PDP
} from '../../utils/constants';
import {Context} from '../../context';
import {Footer, Gap} from '..';
import {createCommentParentV2, getCommentList} from '../../service/comment';
import {downVote, upVote} from '../../service/vote';
import {fonts} from '../../utils/fonts';
import {getCountCommentWithChildInDetailPage} from '../../utils/getstream';
import {getFeedDetail, viewTimePost} from '../../service/post';
import {linkContextScreenParamBuilder} from '../../utils/navigation/paramBuilder';
import {setFeedByIndex, setTimer} from '../../context/actions/feeds';
import {showScoreAlertDialog} from '../../utils/Utils';
import {useFeedDataContext} from '../../hooks/useFeedDataContext';
import {withInteractionsManaged} from '../WithInteractionManaged';
import {saveComment} from '../../context/actions/comment';

const {width, height} = Dimensions.get('window');

const PostPageDetailIdComponent = (props) => {
  const {feedId, navigateToReplyView, contextSource = CONTEXT_SOURCE.FEEDS} = props;
  const [profile] = React.useContext(Context).profile;
  const [loading, setLoading] = React.useState(true);
  const [isReaction, setReaction] = React.useState(false);
  const [textComment, setTextComment] = React.useState('');
  const [typeComment] = React.useState('parent');
  const [totalComment, setTotalComment] = React.useState(0);
  const [totalVote, setTotalVote] = React.useState(0);
  const [voteStatus, setVoteStatus] = React.useState('none');
  const [statusUpvote, setStatusUpvote] = React.useState(false);
  const [statusDownvote, setStatusDowvote] = React.useState(false);
  const [loadingPost, setLoadingPost] = React.useState(false);
  const [commentList, setCommentList] = React.useState([]);
  const [time, setTime] = React.useState(new Date().getTime());
  const [item, setItem] = React.useState(null);
  const navigation = useNavigation();
  const route = useRoute();
  const scrollViewRef = React.useRef(null);
  const refBlockComponent = React.useRef();
  const [feedsContext, dispatch] = useFeedDataContext(contextSource);
  const [isInitial, setIsInitial] = React.useState(true);
  const {timer} = feedsContext;
  const [commenListParam] = React.useState({
    limit: 20
  });
  const [commentContext, dispatchComment] = React.useContext(Context).comments;
  const {comments} = commentContext;
  const {updateVoteLatestChildrenLevel3, updateVoteChildrenLevel1} = usePostDetail();
  const {updateFeedContext} = usePostContextHook(contextSource);
  // React.useEffect(() => {
  //   if (!isInitial) {
  //     if (item && item?.latest_reactions) {
  //       if (!item?.latest_reactions?.comment) setCommentList([]);
  //       else
  //         setCommentList(
  //           item.latest_reactions.comment.sort(
  //             (a, b) => moment(a.updated_at).unix() - moment(b.updated_at).unix()
  //           )
  //         );

  //       setTotalComment(getCountCommentWithChildInDetailPage(item.latest_reactions));
  //     }
  //   }
  // }, [item]);
  // console.log(commentContext.comments, 'buset 1');

  const getComment = async () => {
    const queryParam = new URLSearchParams(commenListParam).toString();
    const response = await getCommentList(feedId, queryParam);
    saveComment(response.data.data, dispatchComment);
    // setCommentList(response.data.data);
    setIsInitial(false);
  };

  React.useEffect(() => {
    getComment();
  }, []);
  console.log(comments, 'sunan')
  const handleVote = (data = {}) => {
    const upvote = data.upvotes ? data.upvotes : 0;
    const downvotes = data.downvotes ? data.downvotes : 0;
    setTotalVote(upvote - downvotes);
  };
  const initial = async () => {
    const reactionCount = item?.reaction_counts;
    if (JSON.stringify(reactionCount) !== '{}') {
      let count = 0;
      const {comment} = reactionCount;
      handleVote(reactionCount);
      if (comment !== undefined) {
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
  };

  const onBottomPage = () => {
    if (scrollViewRef && scrollViewRef.current) {
      scrollViewRef.current.scrollTo({y: Dimensions.get('screen').height + 30, x: 0});
    }
  };

  const getDetailFeed = async () => {
    if (!route.params.isCaching) {
      setLoading(true);
      const data = await getFeedDetail(feedId);
      setItem(data?.data);
      setLoading(false);
      if (route.params.is_from_pn) {
        setTimeout(() => {
          onBottomPage();
        }, 500);
      }
    } else {
      setItem(route.params.data);
    }
  };

  const updateParentPost = (data) => {
    setItem(data);
    updateAllContent(data);
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
      console.log(data, 'nanamoa');
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
        getComment();
      }
      updateAllContent(oldData);
      Keyboard.dismiss();
      setTimeout(() => {
        onBottomPage();
      }, 300);
    } catch (e) {
      if (__DEV__) {
        console.log(e);
      }
    }
  };

  const onComment = (isAnonimity, anonimityData) => {
    if (typeComment === 'parent') {
      commentParent(isAnonimity, anonimityData);
    }
  };
  const commentParent = async (isAnonimity, anonimityData) => {
    setLoadingPost(true);
    try {
      if (textComment.trim() !== '') {
        let sendData = {
          activity_id: item.id,
          message: textComment,
          // useridFeed: item.actor.id,
          sendPostNotif: true,
          anonimity: isAnonimity
        };

        const anonUser = {
          emoji_name: anonimityData.emojiName,
          color_name: anonimityData.colorName,
          emoji_code: anonimityData.emojiCode,
          color_code: anonimityData.colorCode,
          is_anonymous: isAnonimity
        };
        if (isAnonimity) {
          sendData = {...sendData, anon_user_info: anonUser};
        }
        const data = await createCommentParentV2(sendData);
        updateCachingComment(data?.data);
        if (data.code === 200) {
          setTextComment('');
          updateFeed(true);
          // Toast.show('Comment successful', Toast.LONG);
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

  const onPressDomain = () => {
    const param = linkContextScreenParamBuilder(
      item,
      item.og.domain,
      item.og.domainImage,
      item.og.domain_page_id
    );

    const currentTime = new Date();
    const feedDiffTime = currentTime.getTime() - timer.getTime();
    const pdpDiffTime = currentTime.getTime() - time;

    if (feedId) {
      // viewTimePost(feedId, feedDiffTime, SOURCE_FEED_TAB);
      viewTimePost(feedId, pdpDiffTime + feedDiffTime, SOURCE_PDP);
    }

    setTime(new Date().getTime());
    setTimer(new Date(), dispatch);
    navigation.navigate('DomainScreen', param);
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
      // setMainFeeds(mappingData, dispatch)
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

  const findVoteAndUpdate = (response, type) => {
    const data = [];
    data.push(response.data);
    const mappingData = feedsContext.feeds.map((feed) => {
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
    // setMainFeeds(mappingData, dispatch)
    updateFeedContext(mappingData);
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
    // setMainFeeds(mappingData, dispatch)
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
          return {...comment, latest_children: {...comment.latest_children, comment: findComment}};
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
    // setCommentList(newCommenList)
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
    // setMainFeeds(mappingData, dispatch)
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

  const navigateToLinkContextPage = (itemParams) => {
    const param = linkContextScreenParamBuilder(
      itemParams,
      itemParams.og.domain,
      itemParams.og.domainImage,
      itemParams.og.domain_page_id
    );

    const currentTime = new Date();
    const feedDiffTime = currentTime.getTime() - timer.getTime();
    const pdpDiffTime = currentTime.getTime() - time;

    if (feedId) {
      viewTimePost(feedId, pdpDiffTime + feedDiffTime, SOURCE_PDP);
    }

    setTime(new Date().getTime());
    setTimer(new Date(), dispatch);

    navigation.push('LinkContextScreen', param);
  };

  const onPressDownVoteHandle = async () => {
    // setLoadingVote(true);
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
    await setDownVote(!statusDownvote);
  };

  const onPressUpvoteHandle = async () => {
    // setLoadingVote(true);
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
    await setUpVote(!statusUpvote);
  };

  const handleRefreshComment = () => {
    updateFeed();
  };

  const handleRefreshChildComment = () => {
    updateFeed();
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
  const updateVoteLatestChildren = async (dataUpdated, data, level) => {
    if (level === 3) {
      const newComment = await updateVoteLatestChildrenLevel3(comments, dataUpdated);
      // setCommentList(newComment);
      saveComment(newComment, dispatchComment)
    }
    if (level === 1) {
      const newComment = await updateVoteChildrenLevel1(comments, dataUpdated);
      // setCommentList(newComment);
      saveComment(newComment, dispatchComment)
    }
  };
  return (
    <View style={styles.container}>
      {loading && !route.params.isCaching ? <LoadingWithoutModal /> : null}
      <StatusBar translucent={false} />
      {item ? (
        <React.Fragment>
          <Header hideThreeDot={true} props={item} isBackButton={true} source={SOURCE_PDP} />

          <ScrollView
            ref={scrollViewRef}
            showsVerticalScrollIndicator={false}
            style={styles.contentScrollView(comments.length)}
            nestedScrollEnabled={true}>
            <View style={styles.content(height)}>
              {item.post_type === POST_TYPE_LINK ? (
                <ContentLink
                  og={item.og}
                  onHeaderPress={onPressDomain}
                  onCardContentPress={() => navigateToLinkContextPage(item)}
                  score={item.credderScore}
                  message={item?.message}
                  topics={item?.topics}
                  item={item}
                  isPostDetail={true}
                />
              ) : (
                <Content
                  message={item.message}
                  images_url={item.images_url}
                  style={styles.additionalContentStyle(item?.images_url?.length, height)}
                  topics={item?.topics}
                  item={item}
                  onnewpollfetched={onNewPollFetched}
                />
              )}

              <Gap height={16} />
              <View style={{height: 52, paddingHorizontal: 0, width: '100%'}}>
                <Footer
                  item={item}
                  disableComment={false}
                  totalComment={totalComment}
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
                  // loadingVote={loadingVote}
                  showScoreButton={true}
                  onPressScore={handleOnPressScore}
                  onPressBlock={() => refBlockComponent.current.openBlockComponent(item)}
                  isSelf={profile.myProfile.user_id === item.actor.id}
                />
              </View>
            </View>
            {comments.length > 0 && (
              <ContainerComment
                feedId={feedId}
                comments={comments}
                isLoading={loadingPost}
                refreshComment={handleRefreshComment}
                refreshChildComment={handleRefreshChildComment}
                navigateToReplyView={(data) =>
                  navigateToReplyView(
                    data,
                    updateParentPost,
                    findCommentAndUpdate,
                    item,
                    updateVoteLatestChildren
                  )
                }
                findCommentAndUpdate={findCommentAndUpdate}
                updateParentPost={updateParentPost}
                contextSource={contextSource}
              />
            )}
          </ScrollView>

          <WriteComment
            postId={feedId}
            username={
              item.anonimity ? StringConstant.generalAnonymousText : item.actor.data.username
            }
            value={textComment}
            onChangeText={(value) => setTextComment(value)}
            onPress={onComment}
            loadingPost={loadingPost}
          />

          <BlockComponent ref={refBlockComponent} refresh={updateFeed} screen="post_detail_page" />
        </React.Fragment>
      ) : null}
    </View>
  );
};

export default withInteractionsManaged(PostPageDetailIdComponent);

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    flex: 1
  },
  containerText: {
    marginTop: 20,
    marginHorizontal: 22
  },
  textDesc: {
    fontFamily: fonts.inter[400],
    fontSize: 16,
    color: '#000'
  },
  more: {
    color: '#0e24b3',
    fontFamily: fonts.inter[400],
    fontSize: 14
  },
  content: (h) => ({
    width,
    shadowColor: 'rgba(0,0,0,0.5)',
    shadowOffset: {
      width: 0,
      height: 1
    },
    shadowOpacity: 0.5,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#C4C4C4',
    marginBottom: -1,
    height: h - 170
  }),
  gap: {height: 16},
  additionalContentStyle: (imageLength, h) => {
    if (imageLength > 0) {
      return {
        height: h * 0.5
      };
    }
    return {};
  },
  contentScrollView: (totalComment) => ({
    height,
    marginBottom: totalComment > 0 ? 82 : 0
  })
});
