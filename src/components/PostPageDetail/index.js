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

import BlockComponent from '../../components/BlockComponent';
import ContainerComment from '../../components/Comments/ContainerComment';
import Content from './elements/Content';
import ContentLink from '../../screens/FeedScreen/ContentLink';
import ContentPoll from '../../screens/FeedScreen/ContentPoll';
import Header from '../../screens/FeedScreen/Header';
import StringConstant from '../../utils/string/StringConstant';
import WriteComment from '../../components/Comments/WriteComment';
import dimen from '../../utils/dimen';
import {Footer, Gap} from '../../components';
import {
  POST_TYPE_LINK,
  POST_TYPE_POLL,
  POST_TYPE_STANDARD,
} from '../../utils/constants';
import {createCommentParent} from '../../service/comment';
import {downVote, upVote} from '../../service/vote';
import {fonts} from '../../utils/fonts';
import {getCountCommentWithChildInDetailPage} from '../../utils/getstream';
import {getFeedDetail} from '../../service/post';
import {getMyProfile} from '../../service/profile';
import {getUserId} from '../../utils/users';
import {linkContextScreenParamBuilder} from '../../utils/navigation/paramBuilder';

const {width, height} = Dimensions.get('window');

const PostPageDetailComponent = (props) => {
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
  const [loadingVote, setLoadingVote] = React.useState(false);
  const [loadingPost, setLoadingPost] = React.useState(false)
  const [commentList, setCommentList] = React.useState([])
  let navigation = useNavigation()
  
  const refBlockComponent = React.useRef();

  // let [feeds, dispatch] = React.useContext(Context).feeds;
  let {feeds, dispatch, setFeedByIndexProps, 
    navigateToReplyView = () => {}} = props

  React.useEffect(() => {
    const parseToken = async () => {
      const id = await getUserId();
      if (id) {
        setYourselfId(id);
      }
    };

    const unsubscribe = () => {
      parseToken();
    }

    return unsubscribe;
  }, []);

  React.useEffect(() => {
    const unsubscribe = () => {
      fetchMyProfile();
    }

    return unsubscribe;
  }, [yourselfId]);

  const scrollViewRef = React.useRef(null);

  let {index} = props;

  const [item, setItem] = React.useState(feeds[index]);

  React.useEffect(() => {
    setItem(feeds[index]);
    if(feeds[index] && feeds[index].latest_reactions && feeds[index].latest_reactions.comment) {
      setCommentList(feeds[index].latest_reactions.comment.sort((a, b) => moment(a.updated_at).unix() - moment(b.updated_at).unix()))
    }
  }, [JSON.stringify(feeds)]);

  const handleVote = (data = {}) => {
    const upvote = data.upvotes ? data.upvotes : 0
    const downvotes = data.downvotes ? data.downvotes : 0
    setTotalVote(upvote - downvotes)
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

  const fetchMyProfile = async () => {
    let id = await getUserId();
    if (id) {
      const result = await getMyProfile(id);
      if (result.code === 200) {
        setDataProfile(result.data);
      }
    }
  };

  const updateFeed = async (isSort) => {
    try {
      let data = await getFeedDetail(item.id);
      let oldData = data.data
      if(isSort) {
        oldData = {...oldData, latest_reactions: {...oldData.latest_reactions, comment: oldData.latest_reactions.comment.sort((a, b) => moment(a.updated_at).unix() - moment(b.updated_at).unix())} }
      }
      setLoadingPost(false)
      if (data) {
        setItem(oldData);
        setFeedByIndexProps(
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
        let data = await createCommentParent(textComment, item.id);
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
    let param = linkContextScreenParamBuilder(
      item,
      item.og.domain,
      item.og.domainImage,
      item.og.domain_page_id,
    );
    navigation.navigate('DomainScreen', param);
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
    if (processData.code == 200) {
      updateFeed()    
      return setLoadingVote(false);
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
    if (processData.code == 200) {
      updateFeed()
      return setLoadingVote(false);;
    }
    setLoadingVote(false);
  };

  const onNewPollFetched = (newPolls, index) => {
    setFeedByIndexProps(
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
    navigation.push('LinkContextScreen', param);
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

  React.useEffect(() => {
    return () => {
      updateFeed(true)
    }
  }, [])


  return (
    <View style={styles.container}>
      <StatusBar translucent={false} />
      <Header props={item} isBackButton={true} />

      <ScrollView
        ref={scrollViewRef}
        showsVerticalScrollIndicator={false}
        style={styles.contentScrollView(totalComment)}>
        <View style={styles.content(height)}>
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
          <View style={{height: 52, paddingHorizontal: 0, position: 'absolute', bottom : 0, width: '100%'}}>
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
              onPressBlock={() => refBlockComponent.current.openBlockComponent(item)}
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

      <BlockComponent ref={refBlockComponent} refresh={updateFeed} screen="post_detail_page"/>
    </View>
  );
};

export default PostPageDetailComponent;

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
      height: h - 145,
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
