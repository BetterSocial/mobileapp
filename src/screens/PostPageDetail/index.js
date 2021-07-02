import * as React from 'react';
import {ScrollView, StyleSheet, View, Dimensions} from 'react-native';
import JWTDecode from 'jwt-decode';
import Toast from 'react-native-simple-toast';
import {useNavigation} from '@react-navigation/native';
import moment from 'moment';

import {Gap, Footer} from '../../components';
import Header from '../FeedScreen/Header';
import Content from '../FeedScreen/Content';
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
  POST_VERB_POLL,
  POST_TYPE_LINK,
  POST_TYPE_POLL,
  POST_TYPE_STANDARD,
} from '../../utils/constants';
import {createCommentParent} from '../../service/comment';
import ContentLink from '../FeedScreen/ContentLink';
import {getFeedDetail} from '../../service/post';

const {width, height} = Dimensions.get('window');

const PostPageDetail = (props) => {
  const navigation = useNavigation();
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

  React.useEffect(() => {
    const parseToken = async () => {
      const value = await getAccessToken();
      if (value) {
        const decoded = await JWTDecode(value);
        setYourselfId(decoded.user_id);
      }
    };
    parseToken();
  }, []);

  const scrollViewRef = React.useRef(null);

  let itemProp = props.route.params.item;
  let comments = itemProp.latest_reactions.comment || [];
  let sortedComment = comments.sort((current, next) => {
    let currentMoment = moment(current.updated_at);
    let nextMoment = moment(next.updated_at);
    return currentMoment.diff(nextMoment);
  });

  let newItemProp = {...itemProp};
  newItemProp.latest_reactions.comment = sortedComment;

  const [item, setItem] = React.useState(newItemProp);

  // console.log(item.latest_reactions.comment);

  React.useEffect(() => {
    const initial = () => {
      let reactionCount = props.route.params.item.reaction_counts;
      if (JSON.stringify(reactionCount) !== '{}') {
        let count = 0;
        let comment = reactionCount.comment;
        if (comment !== undefined) {
          if (comment > 0) {
            setReaction(true);
            setTotalComment(comment);
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
    initial();
  }, [props]);

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
    navigation.addListener('focus', () => {
      if (item) {
        updateFeed();
      }
    });
    fetchMyProfile();
  }, []);
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
    let token = await getAccessToken();
    if (token) {
      var decoded = await JWTDecode(token);
      const result = await getMyProfile(decoded.user_id);
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
    console.log('update feed');
    try {
      let data = await getFeedDetail(item.id);
      if (data) {
        console.log('reed', data.results[0]);
        setItem(data.results[0]);
      } else {
        console.log('else if');
      }
    } catch (e) {
      console.log('error updating feed');
      console.log(e);
    }
  };

  const onComment = () => {
    if (typeComment === 'parent') {
      commentParent();
    }
  };

  const commentParent = async () => {
    try {
      if (textComment.trim() !== '') {
        let data = await createCommentParent(textComment, item.id);
        if (data.code === 200) {
          setTextComment('');
          // updateFeed();
          Toast.show('Comment successful', Toast.LONG);
        } else {
          Toast.show('Failed Comment', Toast.LONG);
        }
      } else {
        Toast.show('Comments are not empty', Toast.LONG);
      }
    } catch (e) {
      console.log(e);
      Toast.show('Failed Comment', Toast.LONG);
    }
  };

  const onPressDomain = () => {
    props.navigation.navigate('DomainScreen', {
      item: item,
    });
    // scrollViewRef.current.scrollTo
  };

  const onCommentButtonClicked = () => {
    console.log('Comment Button Clicked');
    scrollViewRef.current.scrollToEnd();
  };

  const setUpVote = async (post) => {
    upVote(post);
  };
  const setDownVote = async (post) => {
    downVote(post);
  };

  return (
    <View style={styles.container}>
      <ScrollView
        ref={scrollViewRef}
        showsVerticalScrollIndicator={false}
        style={styles.contentScrollView(totalComment)}>
        <View style={styles.content(height)}>
          <Header props={item} isBackButton={true} />
          {item.post_type === POST_TYPE_POLL && (
            <ContentPoll
              index={0}
              message={item.message}
              images_url={item.images_url}
              polls={item.pollOptions}
              onPress={() => {}}
              item={item}
              pollexpiredat={item.polls_expired_at}
              multiplechoice={item.multiplechoice}
              isalreadypolling={item.isalreadypolling}
              onnewpollfetched={() => {}}
            />
          )}

          {item.post_type === POST_TYPE_LINK && (
            <ContentLink og={item.og} onPress={onPressDomain} />
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
          <Footer
            item={item}
            disableComment={false}
            totalComment={totalComment}
            totalVote={totalVote}
            onPressDownVote={() => {
              setStatusDowvote((prev) => {
                prev = !prev;
                setDownVote({
                  activity_id: item.id,
                  status: prev,
                  feed_group: 'main_feed',
                });
                if (prev) {
                  setVoteStatus('downvote');
                  if (statusUpvote === true) {
                    setTotalVote((p) => p - 2);
                  } else {
                    setTotalVote((p) => p - 1);
                  }
                  setStatusUpvote(false);
                } else {
                  setVoteStatus('none');
                  setTotalVote((p) => p + 1);
                }
                return prev;
              });
            }}
            onPressUpvote={() => {
              setStatusUpvote((prev) => {
                prev = !prev;
                setUpVote({
                  activity_id: item.id,
                  status: prev,
                  feed_group: 'main_feed',
                });
                if (prev) {
                  setVoteStatus('upvote');
                  if (statusDownvote === true) {
                    setTotalVote((p) => p + 2);
                  } else {
                    setTotalVote((p) => p + 1);
                  }
                  setStatusDowvote(false);
                } else {
                  setVoteStatus('none');
                  setTotalVote((p) => p - 1);
                }
                return prev;
              });
            }}
            statusVote={voteStatus}
            onPressShare={() => {}}
            onPressComment={onCommentButtonClicked}
            onPressBlock={(value) => {
              if (value.actor.id === yourselfId) {
                Toast.show("Can't Block yourself", Toast.LONG);
              } else {
                setDataToState(value);
                refBlockUser.current.open();
              }
            }}
            isSelf={yourselfId === item.actor.id ? true : false}
          />
        </View>
        {isReaction && (
          <ContainerComment comments={item.latest_reactions.comment} />
        )}
      </ScrollView>
      <WriteComment
        username={item.actor.data.username}
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
        refBlockUser={refBlockDomain}
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
    // marginBottom: 86,
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
  content: (height) => {
    return {
      width: width,
      borderRadius: 5,
      shadowColor: 'rgba(0,0,0,0.5)',
      shadowOffset: {
        width: 0,
        height: 1,
      },
      shadowOpacity: 0.5,
      backgroundColor: 'white',
      paddingHorizontal: 16,
      marginBottom: 16,
      height: height - 120,
    };
  },
  gap: {height: 16},
  additionalContentStyle: (imageLength, height) => {
    if (imageLength > 0) {
      return {
        height: height * 0.5,
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
