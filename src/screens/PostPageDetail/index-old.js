import * as React from 'react';
import SimpleToast from 'react-native-simple-toast';
import Toast from 'react-native-simple-toast';
import moment from 'moment';
import {
  Dimensions,
  ScrollView,
  StatusBar,
  StyleSheet,
  View,
} from 'react-native';
import { useNavigation } from '@react-navigation/core';

import BlockDomain from '../../components/Blocking/BlockDomain';
import BlockUser from '../../components/Blocking/BlockUser';
import ContainerComment from '../../components/Comments/ContainerComment';
import Content from './elements/Content';
import ContentLink from '../FeedScreen/ContentLink';
import ContentPoll from '../FeedScreen/ContentPoll';
import Header from '../FeedScreen/Header';
import ReportDomain from '../../components/Blocking/ReportDomain';
import ReportUser from '../../components/Blocking/ReportUser';
import SpecificIssue from '../../components/Blocking/SpecificIssue';
import StringConstant from '../../utils/string/StringConstant';
import WriteComment from '../../components/Comments/WriteComment';
import {Context} from '../../context';
import {Footer, Gap} from '../../components';
import {
  POST_TYPE_LINK,
  POST_TYPE_POLL,
  POST_TYPE_STANDARD,
} from '../../utils/constants';
import {blockUser} from '../../service/blocking';
import {createCommentParent} from '../../service/comment';
import {downVote, upVote} from '../../service/vote';
import {fonts} from '../../utils/fonts';
import {getCountCommentWithChildInDetailPage} from '../../utils/getstream';
import {getFeedDetail} from '../../service/post';
import {getMyProfile} from '../../service/profile';
import {getUserId} from '../../utils/users';
import {linkContextScreenParamBuilder} from '../../utils/navigation/paramBuilder';
import {setFeedByIndex} from '../../context/actions/feeds';

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
  const [commentList, setCommentList] = React.useState([]);
  const navigation = useNavigation();
  
  const [feeds, dispatch] = React.useContext(Context).feeds;

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

  const {index} = props.route.params;

  const [item, setItem] = React.useState(feeds.feeds[index]);

  React.useEffect(() => {
    setItem(feeds.feeds[index]);
    if(feeds.feeds[index] && feeds.feeds[index].latest_reactions && feeds.feeds[index].latest_reactions.comment) {
      setCommentList(feeds.feeds[index].latest_reactions.comment.sort((a, b) => moment(a.updated_at).unix() - moment(b.updated_at).unix()))
    }
  }, [JSON.stringify(feeds)]);

  const navigateToReplyView = (data) => {
    navigation.navigate('ReplyComment', data);
}

  const handleVote = (data = {}) => {
    const upvote = data.upvotes ? data.upvotes : 0
    const downvotes = data.downvotes ? data.downvotes : 0
    setTotalVote(upvote - downvotes)
  };
  const initial = () => {
    const reactionCount = item.reaction_counts;
    if (JSON.stringify(reactionCount) !== '{}') {
      let count = 0;
      const {comment} = reactionCount;
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
      userId,
      postId,
      source: 'screen_post_detail',
      reason: reportOption,
      message: messageReport,
    };
    const result = await blockUser(data);
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
    const id = await getUserId();
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
      setUserId(`${value.actor.id  }-anonymous`);
    } else {
      setUsername(value.actor.data.username);
      setPostId(value.id);
      setUserId(value.actor.id);
    }
  };

  const updateFeed = async (isSort) => {
    try {
      const data = await getFeedDetail(item.id);
      let oldData = data.data
      if(isSort) {
        oldData = {...oldData, latest_reactions: {...oldData.latest_reactions, comment: oldData.latest_reactions.comment.sort((a, b) => moment(a.updated_at).unix() - moment(b.updated_at).unix())} }
      }
      console.log(oldData, 'sunat')
      setLoadingPost(false)
      if (data) {
        setItem(oldData);
        setFeedByIndex(
          {
            singleFeed: oldData,
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
        const data = await createCommentParent(textComment, item.id);
        if (data.code === 200) {
          setTextComment('');
          updateFeed(true);
          // Toast.show('Comment successful', Toast.LONG);
          
        } else {
          Toast.show(StringConstant.generalCommentFailed, Toast.LONG);
          setLoadingPost(false)
        }
      } else {
        Toast.show('Comments are empty', Toast.LONG);
        setLoadingPost(false)
      }
    } catch (e) {
      setLoadingPost(false)
      Toast.show(StringConstant.generalCommentFailed, Toast.LONG);
    }
  };

  const onPressDomain = () => {
    const param = linkContextScreenParamBuilder(
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
      status,
      feed_group: 'main_feed',
    };
    const processData = await upVote(data);
    if (processData.code == 200) {
      updateFeed()    
      return setLoadingVote(false);
    }
    setLoadingVote(false);
  };
  const setDownVote = async (status) => {
    const data = {
      activity_id: item.id,
      status,
      feed_group: 'main_feed',
    };
    const processData = await downVote(data);
    if (processData.code == 200) {
      updateFeed()
      return setLoadingVote(false);;
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
    const param = linkContextScreenParamBuilder(
      item,
      item.og.domain,
      item.og.domainImage,
      item.og.domain_page_id,
    );
    props.navigation.push('LinkContextScreen', param);
  };

  const onPressDownVoteHandle = async () => {
    setLoadingVote(true);
    setStatusDowvote((prev) => !prev);
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
    await setDownVote(!statusDownvote);
  };

  const onPressUpvoteHandle = async () => {
    setLoadingVote(true);
    setStatusUpvote((prev) => !prev);
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
    await setUpVote(!statusUpvote);
  };


  const handleRefreshComment = ({data}) => {
    updateFeed()
  }

  const handleRefreshChildComment = ({parent, children}) => {
    updateFeed()
  }

  const checkVotes = () => {
    const findUpvote = item && item.own_reactions && item.own_reactions.upvotes && item.own_reactions.upvotes.find((vote) => vote.user_id === yourselfId)
    const findDownvote = item && item.own_reactions && item.own_reactions.downvotes && item.own_reactions.downvotes.find((vote) => vote.user_id === yourselfId)
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
  }, [item, yourselfId])

  React.useEffect(() => () => {
      updateFeed(true)
    }, [])


  return (
    <View style={styles.container}>
      <StatusBar translucent={false} />
      <ScrollView
        ref={scrollViewRef}
        showsVerticalScrollIndicator={false}
        style={styles.contentScrollView(totalComment)}>
        <View style={styles.content(height)}>
          <Header props={item} isBackButton={true} />
          {item && item.post_type === POST_TYPE_POLL && (
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

          {item && item.post_type === POST_TYPE_LINK && (
            <ContentLink
              og={item.og}
              onCardPress={onPressDomain}
              onHeaderPress={onPressDomain}
              onCardContentPress={() => navigateToLinkContextPage(item)}
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
              isSelf={yourselfId === item.actor.id}
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
            navigateToReplyView={navigateToReplyView}
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
        ref={refReportUser}
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
      height: h - 120,
    }),
  gap: {height: 16},
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
