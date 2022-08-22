import * as React from 'react';
import SimpleToast from 'react-native-simple-toast';
import Toast from 'react-native-simple-toast';
import moment from 'moment';
import {
  Dimensions,
  InteractionManager,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  View
} from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import { useNavigation } from '@react-navigation/core';
import { useRoute } from '@react-navigation/native'

import BlockComponent from "../BlockComponent";
import ContainerComment from "../Comments/ContainerComment";
import Content from './elements/Content';
import ContentLink from '../../screens/FeedScreen/ContentLink';
import ContentPoll from '../../screens/FeedScreen/ContentPoll';
import Header from '../../screens/FeedScreen/Header';
import LoadingWithoutModal from "../LoadingWithoutModal";
import Log from '../../utils/log/Log';
import StringConstant from '../../utils/string/StringConstant';
import WriteComment from "../Comments/WriteComment";
import dimen from '../../utils/dimen';
import { Context } from '../../context';
import { FEEDS_CACHE } from '../../utils/cache/constant';
import { Footer, Gap } from "..";
import {
  POST_TYPE_LINK,
  POST_TYPE_POLL,
  POST_TYPE_STANDARD,
  SOURCE_FEED_TAB,
  SOURCE_PDP,
} from '../../utils/constants';
import { createCommentParent } from '../../service/comment';
import { downVote, upVote } from '../../service/vote';
import { fonts } from '../../utils/fonts';
import { getCountCommentWithChildInDetailPage } from '../../utils/getstream';
import { getFeedDetail, viewTimePost } from '../../service/post';
import { getMyProfile } from '../../service/profile';
import { getSpecificCache } from '../../utils/cache';
import { getUserId } from '../../utils/users';
import { linkContextScreenParamBuilder } from '../../utils/navigation/paramBuilder';
import { setFeedByIndex, setMainFeeds, setTimer } from '../../context/actions/feeds';
import { showScoreAlertDialog } from '../../utils/Utils';

const { width, height } = Dimensions.get('window');

const PostPageDetailIdComponent = (props) => {
  const [user] = React.useContext(Context).users;
  const [profile] = React.useContext(Context).profile;
  const [loading, setLoading] = React.useState(true)
  const [dataProfile, setDataProfile] = React.useState({});
  const [isReaction, setReaction] = React.useState(false);
  const [textComment, setTextComment] = React.useState('');
  const [typeComment, setTypeComment] = React.useState('parent');
  const [totalComment, setTotalComment] = React.useState(0);
  const [totalVote, setTotalVote] = React.useState(0);
  const [yourselfId, setYourselfId] = React.useState('');
  const [voteStatus, setVoteStatus] = React.useState('none');
  const [statusUpvote, setStatusUpvote] = React.useState(false);
  const [statusDownvote, setStatusDowvote] = React.useState(false);
  const [loadingPost, setLoadingPost] = React.useState(false)
  const [commentList, setCommentList] = React.useState([])
  const [time, setTime] = React.useState(new Date().getTime())
  const [item, setItem] = React.useState(null);
  const navigation = useNavigation()
  const route = useRoute()
  const scrollViewRef = React.useRef(null);
  const refBlockComponent = React.useRef();
  const [feedsContext, dispatch] = React.useContext(Context).feeds;
  const { timer } = feedsContext

  const { feedId, refreshParent,
    navigateToReplyView = () => { } } = props
  React.useEffect(() => {
    if (item && item.latest_reactions && item.latest_reactions.comment) {
      setCommentList(item.latest_reactions.comment.sort((a, b) => moment(a.updated_at).unix() - moment(b.updated_at).unix()))
    }
  }, [item]);

  const handleVote = (data = {}) => {
    const upvote = data.upvotes ? data.upvotes : 0
    const downvotes = data.downvotes ? data.downvotes : 0
    setTotalVote(upvote - downvotes)
  };
  const initial = async () => {
    const reactionCount = item.reaction_counts;
    if (JSON.stringify(reactionCount) !== '{}') {
      let count = 0;
      const { comment } = reactionCount;
      handleVote(reactionCount);
      if (comment !== undefined) {
        if (comment > 0) {
          setReaction(true);
          setTotalComment(
            getCountCommentWithChildInDetailPage(item.latest_reactions),
          );
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

  const getDetailFeed = async () => {
    if (!route.params.isCaching) {
      setLoading(true)
      const data = await getFeedDetail(feedId);
      setItem(data.data)
      setLoading(false)

    } else {
      setItem(route.params.data)
    }

  }


  const updateParentPost = (data) => {
    setItem(data)
    updateAllContent(data)
  }

  React.useEffect(() => {
    initial()
  }, [item]);

  React.useEffect(() => {
    getDetailFeed()
  }, [])


  const updateFeed = async (isSort) => {
    try {
      const data = await getFeedDetail(feedId);
      let oldData = data.data
      if (isSort) {
        oldData = { ...oldData, latest_reactions: { ...oldData.latest_reactions, comment: oldData.latest_reactions.comment.sort((a, b) => moment(a.updated_at).unix() - moment(b.updated_at).unix()) } }
      }
      setLoadingPost(false)
      if (data) {
        setItem(oldData);

      }
      updateAllContent(oldData)
      Keyboard.dismiss()
      setTimeout(() => {
        if (scrollViewRef && scrollViewRef.current) {
          scrollViewRef.current.scrollTo({ y: Dimensions.get('screen').height + 30, x: 0 })
        }
      }, 300)

    } catch (e) {
      console.log(e);
    }
  };


  const onComment = () => {
    if (typeComment === 'parent') {
      commentParent();
    }
  };

  const commentParent = async () => {
    setLoadingPost(true)
    try {
      if (textComment.trim() !== '') {

        const data = await createCommentParent(textComment, item.id, item.actor.id, true);
        updateCachingComment(data.data)
        if (data.code === 200) {
          setTextComment('');
          updateFeed(true);
          // Toast.show('Comment successful', Toast.LONG);

        } else {
          Toast.show('Failed Comment', Toast.LONG);
          setLoadingPost(false)
        }
      } else {
        Toast.show('Comments are empty', Toast.LONG);
        setLoadingPost(false)
      }
    } catch (e) {
      setLoadingPost(false)
      Toast.show('Failed Comment', Toast.LONG);
    }
  };

  const onPressDomain = () => {
    const param = linkContextScreenParamBuilder(
      item,
      item.og.domain,
      item.og.domainImage,
      item.og.domain_page_id,
    );

    const currentTime = new Date()
    const feedDiffTime = currentTime.getTime() - timer.getTime()
    const pdpDiffTime = currentTime.getTime() - time;

    if (feedId) {
      // viewTimePost(feedId, feedDiffTime, SOURCE_FEED_TAB);
      viewTimePost(feedId, pdpDiffTime + feedDiffTime, SOURCE_PDP);
    }

    setTime(new Date().getTime())
    setTimer(new Date(), dispatch)
    navigation.navigate('DomainScreen', param);
  };

  const onCommentButtonClicked = () => {
    scrollViewRef.current.scrollToEnd();
  };


  const updateAllContent = (newFeed) => {
    if (item && item.id) {
      const mappingData = feedsContext.feeds.map((feed) => {
        if (feed.id === item.id) {
          return { ...feed, ...newFeed }
        }
        return { ...feed }
      })
      setMainFeeds(mappingData, dispatch)
    }

  }



  const findVoteAndUpdate = (response, type) => {
    const data = []
    data.push(response.data)
    const mappingData = feedsContext.feeds.map((feed) => {
      if (feed.id === item.id) {
        if (type === 'upvote') {
          if (response.data) {
            return { ...feed, reaction_counts: { ...feed.reaction_counts, upvotes: feed.reaction_counts.upvotes + 1, downvotes: voteStatus === 'downvote' ? feed.reaction_counts.downvotes - 1 : feed.reaction_counts.downvotes }, own_reactions: { ...feed.own_reactions, upvotes: typeof feed.own_reactions === 'object' ? data : feed.own_reactions.push(response.data), downvotes: voteStatus === 'downvote' ? feed.own_reactions.downvotes.filter((react) => react.user_id !== profile.myProfile.user_id) : feed.own_reactions.downvotes } }
          }
          return { ...feed, reaction_counts: { ...feed.reaction_counts, upvotes: feed.reaction_counts.upvotes - 1 }, own_reactions: { ...feed.own_reactions, upvotes: Array.isArray(feed.own_reactions.upvotes) ? feed.own_reactions.upvotes.filter((react) => react.user_id !== profile.myProfile.user_id) : [] } }

        }
        if (response.data) {
          return { ...feed, reaction_counts: { ...feed.reaction_counts, downvotes: feed.reaction_counts.downvotes + 1, upvotes: voteStatus === 'upvote' ? feed.reaction_counts.upvotes - 1 : feed.reaction_counts.upvotes }, own_reactions: { ...feed.own_reactions, downvotes: typeof feed.own_reactions === 'object' ? data : feed.own_reactions.push(response.data), upvotes: voteStatus === 'upvote' ? feed.own_reactions.upvotes.filter((react) => react.user_id !== profile.myProfile.user_id) : feed.own_reactions.upvotes } }
        }
        return { ...feed, reaction_counts: { ...feed.reaction_counts, downvotes: feed.reaction_counts.downvotes - 1 }, own_reactions: { ...feed.own_reactions, downvotes: Array.isArray(feed.own_reactions.downvotes) ? feed.own_reactions.downvotes.filter((react) => react.user_id !== profile.myProfile.user_id) : [] } }



      }
      return { ...feed }
    })
    setMainFeeds(mappingData, dispatch)
  }

  const updateCachingComment = (comment) => {
    const mappingData = feedsContext.feeds.map((feed) => {
      if (feed.id === item.id) {
        let joinComment = []
        if (Array.isArray(feed.latest_reactions.comment)) {
          joinComment = [...feed.latest_reactions.comment, comment].sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
        } else {
          joinComment.push(comment)
        }
        return { ...feed, latest_reactions: { ...feed.latest_reactions, comment: joinComment } }
      }
      return { ...feed }
    })
    setMainFeeds(mappingData, dispatch)
  }
  const findCommentAndUpdate = (id, newData, level) => {
    let newCommenList = []
    if (level > 0) {
      const updatedComment = commentList.map((comment) => {
        if (comment.id === newData.parent) {
          const findComment = comment.latest_children.comment.map((comment1) => {
            if (comment1.id === newData.id) {
              return { ...comment1, ...newData }
            }
            return { ...comment1 }

          })
          return { ...comment, latest_children: { ...comment.latest_children, comment: findComment } }
        }
        return { ...comment }
      })
      newCommenList = updatedComment
    } else {
      const updatedComment = commentList.map((comment) => {
        if (comment.id === id) {
          return { ...comment, ...newData }
        }
        return { ...comment }
      })
      newCommenList = updatedComment
    }

    setCommentList(newCommenList)
    findReduxCommentAndUpdate(newCommenList)
  }

  const findReduxCommentAndUpdate = (comment) => {
    const mappingData = feedsContext.feeds.map((feed) => {
      if (feed.id === item.id) {
        return { ...feed, latest_reactions: { ...feed.latest_reactions, comment } }
      }
      return { ...feed }
    })
    setMainFeeds(mappingData, dispatch)
  }


  const setUpVote = async (status) => {
    const data = {
      activity_id: item.id,
      status,
      feed_group: 'main_feed',
    };
    const processData = await upVote(data);
    findVoteAndUpdate(processData, 'upvote')
  };
  const setDownVote = async (status) => {
    const data = {
      activity_id: item.id,
      status,
      feed_group: 'main_feed',
    };
    const processData = await downVote(data);
    findVoteAndUpdate(processData, 'downvote')

  };

  const onNewPollFetched = (newPolls, index) => {
    setFeedByIndex(
      {
        index,
        singleFeed: newPolls,
      },
      dispatch,
    );
  };

  const navigateToLinkContextPage = (item) => {
    const param = linkContextScreenParamBuilder(
      item,
      item.og.domain,
      item.og.domainImage,
      item.og.domain_page_id,
    );

    const currentTime = new Date()
    const feedDiffTime = currentTime.getTime() - timer.getTime()
    const pdpDiffTime = currentTime.getTime() - time;

    if (feedId) {
      viewTimePost(feedId, pdpDiffTime + feedDiffTime, SOURCE_PDP);
    }

    setTime(new Date().getTime())
    setTimer(new Date(), dispatch)

    navigation.push('LinkContextScreen', param);
  };

  const onPressDownVoteHandle = async () => {
    // setLoadingVote(true);
    setStatusDowvote((prev) => !prev);
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
    await setDownVote(!statusDownvote);
  };

  const onPressUpvoteHandle = async () => {
    // setLoadingVote(true);
    setStatusUpvote((prev) => !prev);
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
    await setUpVote(!statusUpvote);
  };


  const handleRefreshComment = ({ data }) => {
    updateFeed()
  }

  const handleRefreshChildComment = ({ parent, children }) => {
    updateFeed()
  }


  const checkVotes = () => {
    const findUpvote = item && item.own_reactions && item.own_reactions.upvotes && Array.isArray(item.own_reactions.upvotes) && item.own_reactions.upvotes.find((reaction) => reaction.user_id === profile.myProfile.user_id)
    const findDownvote = item && item.own_reactions && item.own_reactions.downvotes && Array.isArray(item.own_reactions.downvotes) && item.own_reactions.downvotes.find((reaction) => reaction.user_id === profile.myProfile.user_id)
    if (findUpvote) {
      setVoteStatus('upvote')
      setStatusUpvote(true)
    }
    if (findDownvote) {
      setVoteStatus('downvote')
      setStatusDowvote(true)
    }
    if (!findDownvote && !findUpvote) {
      setVoteStatus('none')
    }
  }

  React.useEffect(() => {
    checkVotes()
  }, [item])

  React.useEffect(() => () => {
    updateFeed(true)
  }, [])

  const __handleOnPressScore = () => {
    showScoreAlertDialog(item)
  }
  return (
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'height' : null} enabled style={styles.container}>
      {loading && !route.params.isCaching ? <LoadingWithoutModal /> : null}
      <StatusBar translucent={false} />
      {item ? <React.Fragment>
        <Header props={item} isBackButton={true} source={SOURCE_PDP} />

        <ScrollView
          ref={scrollViewRef}
          showsVerticalScrollIndicator={false}
          style={styles.contentScrollView(totalComment)}
          nestedScrollEnabled={true}>
          <View style={styles.content(height)}>
            {item && item.post_type === POST_TYPE_POLL && (
              <ContentPoll
                message={item.message}
                images_url={item.images_url}
                polls={item.pollOptions}
                // onPress={() => { }}
                item={item}
                pollexpiredat={item.polls_expired_at}
                multiplechoice={item.multiplechoice}
                isalreadypolling={item.isalreadypolling}
                // onnewpollfetched={() => {}}
                onnewpollfetched={onNewPollFetched}
                voteCount={item.voteCount}
                topics={item?.topics}
              />
            )}

            {item && item.post_type === POST_TYPE_LINK && (
              <ContentLink
                og={item.og}
                onCardPress={onPressDomain}
                onHeaderPress={onPressDomain}
                onCardContentPress={() => navigateToLinkContextPage(item)}
                message={item?.message}
                score={item?.credderScore}
                topics={item?.topics}
              />
            )}

            {item && item.post_type === POST_TYPE_STANDARD && (
              <Content
                message={item.message}
                images_url={item.images_url}
                style={styles.additionalContentStyle(
                  item.images_url.length,
                  height,
                )}
                topics={item?.topics}
              />
            )}
            <Gap height={16} />
            <View style={{ height: 52, paddingHorizontal: 0, width: '100%' }}>
              <Footer
                item={item}
                disableComment={false}
                totalComment={totalComment}
                totalVote={totalVote}
                onPressDownVote={onPressDownVoteHandle}
                onPressUpvote={onPressUpvoteHandle}
                statusVote={voteStatus}
                onPressShare={() => { }}
                onPressComment={onCommentButtonClicked}
                // loadingVote={loadingVote}
                showScoreButton={true}
                onPressScore={__handleOnPressScore}
                onPressBlock={() => refBlockComponent.current.openBlockComponent(item)}
                isSelf={profile.myProfile.user_id === item.actor.id}
              />
            </View>
          </View>
          {isReaction && commentList && (
            <ContainerComment
              comments={commentList}
              isLoading={loadingPost}
              refreshComment={handleRefreshComment}
              refreshChildComment={handleRefreshChildComment}
              navigateToReplyView={(data) => navigateToReplyView(data, updateParentPost, findCommentAndUpdate, item)}
              findCommentAndUpdate={findCommentAndUpdate}
            />
          )}
        </ScrollView >

        <WriteComment
          username={
            item.anonimity
              ? StringConstant.generalAnonymousText
              : item.actor.data.username
          }
          value={textComment}
          onChangeText={(value) => setTextComment(value)}
          onPress={() => {
            onComment();
          }}
        />

        <BlockComponent ref={refBlockComponent} refresh={updateFeed} screen="post_detail_page" />
      </React.Fragment> : null}

    </KeyboardAvoidingView>
  );
};

export default PostPageDetailIdComponent;

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    flex: 1,
  },
  containerText: {
    marginTop: 20,
    marginHorizontal: 22,
  },
  textDesc: {
    fontFamily: fonts.inter[400],
    fontSize: 16,
    color: '#000',
  },
  more: {
    color: '#0e24b3',
    fontFamily: fonts.inter[400],
    fontSize: 14,
  },
  content: (h) => ({
    width,
    shadowColor: 'rgba(0,0,0,0.5)',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.5,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#C4C4C4',
    marginBottom: -1,
    height: h - 170,
  }),
  gap: { height: 16 },
  additionalContentStyle: (imageLength, h) => {
    if (imageLength > 0) {
      return {
        height: h * 0.5,
      };
    }
    return {};

  },
  contentScrollView: (totalComment) => ({
    height,
    marginBottom: totalComment > 0 ? 82 : 0,
  }),
});
