import * as React from 'react';
import {
  ScrollView,
  StyleSheet,
  View,
  Dimensions,
  StatusBar,
} from 'react-native';

import Toast from 'react-native-simple-toast';
import moment from 'moment';

import {Gap, Footer} from '../../components';
import Header from '../FeedScreen/Header';
import Content from './elements/Content';
import BlockUser from '../../components/Blocking/BlockUser';
import BlockDomain from '../../components/Blocking/BlockDomain';
import ReportUser from '../../components/Blocking/ReportUser';
import ReportDomain from '../../components/Blocking/ReportDomain';
import SpecificIssue from '../../components/Blocking/SpecificIssue';
import WriteComment from '../../components/Comments/WriteComment';
import ContainerComment from '../../components/Comments/ContainerComment';
import {fonts} from '../../utils/fonts';
import {getMyProfile} from '../../service/profile';
import {blockUser} from '../../service/blocking';
import {downVote, upVote} from '../../service/vote';
import ContentPoll from '../FeedScreen/ContentPoll';
import {
  POST_TYPE_LINK,
  POST_TYPE_POLL,
  POST_TYPE_STANDARD,
} from '../../utils/constants';
import {createCommentParent} from '../../service/comment';
import ContentLink from '../FeedScreen/ContentLink';
import {getFeedDetail} from '../../service/post';
import {getCountCommentWithChildInDetailPage} from '../../utils/getstream';
import StringConstant from '../../utils/string/StringConstant';
import {setFeedByIndex} from '../../context/actions/feeds';
import {Context} from '../../context';
import {getUserId} from '../../utils/users';
import {linkContextScreenParamBuilder} from '../../utils/navigation/paramBuilder';
import SimpleToast from 'react-native-simple-toast';

const {width, height} = Dimensions.get('window');

const PostPageDetail = (props) => {
  const [dataProfile, setDataProfile] = React.useState({});
  const [reportOption, setReportOption] = React.useState([]);
  const [messageReport, setMessageReport] = React.useState('');
  const refBlockUser = React.useRef();
  const refBlockDomain = React.useRef();
  const refReportUser = React.useRef();
  const refReportDomain = React.useRef();
  const refSpecificIssue = React.useRef();
  const [isReaction, setReaction] = React.useState(false);
  const [textComment, setTextComment] = React.useState('');
  const [typeComment, setTypeComment] = React.useState('parent');
  const [totalComment, setTotalComment] = React.useState(0);
  const [totalVote, setTotalVote] = React.useState(0);
  const [userId, setUserId] = React.useState('');
  const [username, setUsername] = React.useState('');
  const [postId, setPostId] = React.useState('');
  const [yourselfId, setYourselfId] = React.useState('');
  const [voteStatus, setVoteStatus] = React.useState('none');
  const [statusUpvote, setStatusUpvote] = React.useState(false);
  const [statusDownvote, setStatusDowvote] = React.useState(false);
  const [loadingVote, setLoadingVote] = React.useState(false);
  const [loadingPost, setLoadingPost] = React.useState(false)
  const [commentList, setCommentList] = React.useState([])
  
  let [feeds, dispatch] = React.useContext(Context).feeds;

  React.useEffect(() => {
    const parseToken = async () => {
      const id = await getUserId();
      if (id) {
        setYourselfId(id);
      }
    };
    parseToken();
  }, []);

  React.useEffect(() => {
    fetchMyProfile();
  }, [yourselfId]);

  const scrollViewRef = React.useRef(null);

  let {index} = props.route.params;

  const [item, setItem] = React.useState(feeds.feeds[index]);

  React.useEffect(() => {
    const validationStatusVote = () => {
      if (item.reaction_counts !== undefined || null) {
        if (item.latest_reactions.upvotes !== undefined) {
          let upvote = item.latest_reactions.upvotes.filter(
            (vote) => vote.user_id === yourselfId,
          );
          if (upvote !== undefined) {
            setVoteStatus('upvote');
            setStatusUpvote(true);
          }
        }

        if (item.latest_reactions.downvotes !== undefined) {
          let downvotes = item.latest_reactions.downvotes.filter(
            (vote) => vote.user_id === yourselfId,
          );
          if (downvotes !== undefined) {
            setVoteStatus('downvote');
            setStatusDowvote(true);
          }
        }
      }
    };
    validationStatusVote();
  }, [item, yourselfId]);

  React.useEffect(() => {
    setItem(feeds.feeds[index]);
    if(feeds.feeds[index] && feeds.feeds[index].latest_reactions) {
      setCommentList(feeds.feeds[index].latest_reactions.comment)
    }
  }, [JSON.stringify(feeds)]);

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

  const initial = () => {
    let reactionCount = item.reaction_counts;
    if (JSON.stringify(reactionCount) !== '{}') {
      let count = 0;
      let comment = reactionCount.comment;
      handleVote(reactionCount);
      if (comment !== undefined) {
        if (comment > 0) {
          setReaction(true);
          setTotalComment(
            getCountCommentWithChildInDetailPage(item.latest_reactions),
          );
        }
      }
      let upvote = reactionCount.upvotes;
      if (upvote !== undefined) {
        count = count + upvote;
      }
      let downvote = reactionCount.downvotes;
      if (downvote !== undefined) {
        count = count - downvote;
      }
      setTotalVote(count);
    }
  };

  React.useEffect(() => {
    initial();
  }, [props, item]);

  const onSelectBlocking = (v) => {
    if (v !== 1) {
      refReportUser.current.open();
    } else {
      userBlock();
    }
    refBlockUser.current.close();
  };

  const userBlock = async () => {
    const data = {
      userId: userId,
      postId: postId,
      source: 'screen_post_detail',
      reason: reportOption,
      message: messageReport,
    };
    let result = await blockUser(data);
    if (result.code === 200) {
      Toast.show(
        'The user was blocked successfully. \nThanks for making BetterSocial better!',
        Toast.LONG,
      );
    } else {
      Toast.show('Your report was filed & will be investigated', Toast.LONG);
    }
    console.log('result block user ', result);
  };
  const onSkipOnlyBlock = () => {
    refReportUser.current.close();
    userBlock();
  };

  const onNextQuestion = (v) => {
    setReportOption(v);
    refReportUser.current.close();
    refSpecificIssue.current.open();
  };
  const onIssue = (v) => {
    refSpecificIssue.current.close();
    setMessageReport(v);
    setTimeout(() => {
      userBlock();
    }, 500);
  };
  const fetchMyProfile = async () => {
    let id = await getUserId();
    if (id) {
      const result = await getMyProfile(id);
      if (result.code === 200) {
        setDataProfile(result.data);
      }
    }
  };

  const setDataToState = (value) => {
    if (value.anonimity === true) {
      setUsername('Anonymous');
      setPostId(value.id);
      setUserId(value.actor.id + '-anonymous');
    } else {
      setUsername(value.actor.data.username);
      setPostId(value.id);
      setUserId(value.actor.id);
    }
  };

  const updateFeed = async () => {
    try {
      let data = await getFeedDetail(item.id);
      console.log(data, item, 'sunat')
      setLoadingPost(false)
      if (data) {
        setItem(data.data);
        setFeedByIndex(
          {
            singleFeed: data.data,
            index,
          },
          dispatch,
        );
      }
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
        let data = await createCommentParent(textComment, item.id);
        if (data.code === 200) {
          setTextComment('');
          updateFeed();
          Toast.show('Comment successful', Toast.LONG);
          
        } else {
          Toast.show('Failed Comment', Toast.LONG);
          setLoadingPost(false)
        }
      } else {
        Toast.show('Comments are not empty', Toast.LONG);
        setLoadingPost(false)
      }
    } catch (e) {
      setLoadingPost(false)
      Toast.show('Failed Comment', Toast.LONG);
    }
  };

  const onPressDomain = () => {
    let param = linkContextScreenParamBuilder(
      item,
      item.og.domain,
      item.og.domainImage,
      item.og.domain_page_id,
    );
    props.navigation.navigate('DomainScreen', param);
  };

  const onCommentButtonClicked = () => {
    scrollViewRef.current.scrollToEnd();
  };

  const setUpVote = async (status) => {
    const data = {
      activity_id: item.id,
      status: status,
      feed_group: 'main_feed',
    };
    const processData = await upVote(data);
    updateFeed();
    if (processData.code == 200) {
      setLoadingVote(false);
      return SimpleToast.show('Success Vote', SimpleToast.SHORT);
    }
    setLoadingVote(false);
  };
  const setDownVote = async (status) => {
    const data = {
      activity_id: item.id,
      status: status,
      feed_group: 'main_feed',
    };
    const processData = await downVote(data);
    updateFeed();
    if (processData.code == 200) {
      setLoadingVote(false);
      return SimpleToast.show('Success Vote', SimpleToast.SHORT);
    }
    setLoadingVote(false);
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
    let param = linkContextScreenParamBuilder(
      item,
      item.og.domain,
      item.og.domainImage,
      item.og.domain_page_id,
    );
    props.navigation.push('LinkContextScreen', param);
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
      return setDownVote(true);
    }
    await setDownVote(!statusDownvote);
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
      return await setUpVote(true);
    }
    await setUpVote(!statusUpvote);
  };


  const handleRefreshComment = ({data}) => {
    const newCommentList = commentList.map((comment) => {
      if(comment.id === data.id) {
        return {...comment, data: data.data}
      } else {
        return {...comment}
      }
    })
    setCommentList(newCommentList)
  }

  const handleRefreshChildComment = ({parent, children}) => {
    const newCommentList = commentList.map((comment) => {
      if(comment.id === parent.id) {
         const commentMap = comment.latest_children.comment.map((comChild) => {
        if(comChild.id === children.id) {
          return {...comChild, data: children.data, latest_children: children.latest_children}
        } else {
          return {...comChild}
        }
      })
      return {...comment, latest_children: {comment: commentMap}}
      } else {
        return {...comment}
      }
     
    })
    if(newCommentList) {
      setCommentList(newCommentList)
    }
  }


  return (
    <View style={styles.container}>
      <StatusBar translucent={false} />
      <ScrollView
        ref={scrollViewRef}
        showsVerticalScrollIndicator={false}
        style={styles.contentScrollView(totalComment)}>
        <View style={styles.content(height)}>
          <Header props={item} isBackButton={true} />
          {item.post_type === POST_TYPE_POLL && (
            <ContentPoll
              index={index}
              message={item.message}
              images_url={item.images_url}
              polls={item.pollOptions}
              onPress={() => {}}
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
              og={item.og}
              onCardPress={onPressDomain}
              onHeaderPress={onPressDomain}
              onCardContentPress={() => navigateToLinkContextPage(item)}
            />
          )}

          {item.post_type === POST_TYPE_STANDARD && (
            <Content
              message={item.message}
              images_url={item.images_url}
              style={styles.additionalContentStyle(
                item.images_url.length,
                height,
              )}
            />
          )}
          <Gap height={16} />
          <View style={{height: 52, paddingHorizontal: 0}}>
            <Footer
              item={item}
              disableComment={false}
              totalComment={totalComment}
              totalVote={totalVote}
              onPressDownVote={onPressDownVoteHandle}
              onPressUpvote={onPressUpvoteHandle}
              statusVote={voteStatus}
              onPressShare={() => {}}
              onPressComment={onCommentButtonClicked}
              loadingVote={loadingVote}
              onPressBlock={() => {
                // console.log(item);
                if (item.actor.id === yourselfId) {
                  Toast.show("Can't Block yourself", Toast.LONG);
                } else {
                  setDataToState(item);
                  refBlockUser.current.open();
                }
              }}
              isSelf={yourselfId === item.actor.id ? true : false}
            />
          </View>
        </View>
        {isReaction && commentList && (
          <ContainerComment
            comments={commentList}
            indexFeed={index}
            isLoading={loadingPost}
            refreshComment={handleRefreshComment}
            refreshChildComment={handleRefreshChildComment}
          />
        )}
      </ScrollView>
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
      <BlockUser
        refBlockUser={refBlockUser}
        onSelect={(v) => onSelectBlocking(v)}
        username={username}
      />
      <BlockDomain
        refBlockDomain={refBlockDomain}
        domain="guardian.com"
        onSelect={() => {}}
      />
      <ReportUser
        refReportUser={refReportUser}
        onSelect={onNextQuestion}
        onSkip={onSkipOnlyBlock}
      />
      <ReportDomain refReportDomain={refReportDomain} />
      <SpecificIssue
        refSpecificIssue={refSpecificIssue}
        onPress={onIssue}
        onSkip={onSkipOnlyBlock}
      />
    </View>
  );
};

export default PostPageDetail;

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
  content: (h) => {
    return {
      width: width,
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
      height: h - 120,
    };
  },
  gap: {height: 16},
  additionalContentStyle: (imageLength, h) => {
    if (imageLength > 0) {
      return {
        height: h * 0.5,
      };
    } else {
      return {};
    }
  },
  contentScrollView: (totalComment) => ({
    height: height,
    marginBottom: totalComment > 0 ? 82 : 0,
  }),
});
