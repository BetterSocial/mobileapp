import * as React from 'react';
import {ScrollView, StyleSheet, View, Dimensions} from 'react-native';

import JWTDecode from 'jwt-decode';
import {getAccessToken} from '../../utils/token';
import Toast from 'react-native-simple-toast';

import {DomainHeader, Gap, Footer} from '../../components';
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
import {createCommentParent} from '../../service/comment';
import {SIZES} from '../../utils/theme';
import ContentLink from '../FeedScreen/ContentLink';

const {width, height} = Dimensions.get('window');

const DetailDomainScreen = (props) => {
  const [more, setMore] = React.useState(10);
  const [totalLine, setTotalLine] = React.useState(0);
  const [loading, setLoading] = React.useState(false);
  const [dataProfile, setDataProfile] = React.useState({});
  const [reportOption, setReportOption] = React.useState([]);
  const [messageReport, setMessageReport] = React.useState('');
  const refBlockUser = React.useRef();
  const refBlockDomain = React.useRef();
  const refReportUser = React.useRef();
  const refReportDomain = React.useRef();
  const refSpecificIssue = React.useRef();
  const [item, setItem] = React.useState(props.route.params.item);
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
    fetchMyProfile();
    // refBlockUser.current.open();
    // refBlockDomain.current.open();
    // refReportUser.current.open();
  }, []);
  const onSelectBlocking = (v) => {
    if (v !== 1) {
      // refBlockDomain.current.open();
      refReportUser.current.open();
    } else {
      userBlock();
    }
    refBlockUser.current.close();
  };

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
        setLoading(false);
      }
      setLoading(false);
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
  const setUpVote = async (post) => {
    upVote(post);
  };
  const setDownVote = async (post) => {
    downVote(post);
  };

  const onPressDomain = () => {
    props.navigation.navigate('DomainScreen', {
      item: item,
    });
  };

  return (
    <View style={styles.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        style={{height: height * 0.9}}>
        <View style={styles.content}>
          <View style={{paddingHorizontal: 16}}>
            <DomainHeader
              domain={item.domain.name}
              time={item.content.created_at}
              image={item.domain.image}
            />
          </View>

          <Gap height={16} />
          <View style={{marginHorizontal: SIZES.base}}>
            <ContentLink
              og={{
                date: item.content.created_at,
                description: item.content.description,
                domain: item.domain.name,
                domainImage: item.domain.image,
                image: item.content.image,
                title: item.content.title,
                url: item.content.url,
              }}
            />
            <Gap height={SIZES.base} />
            <Footer
              disableComment={true}
              statusVote={voteStatus}
              totalComment={totalComment}
              totalVote={totalVote}
              onPressDownVote={() => {
                setStatusDowvote((prev) => {
                  prev = !prev;
                  setDownVote({
                    activity_id: item.id,
                    status: prev,
                    feed_group: 'domain',
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
                    feed_group: 'domain',
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
            />
          </View>
        </View>
        {isReaction && (
          <ContainerComment comments={item.latest_reactions.comment} />
        )}
      </ScrollView>
      <WriteComment
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

export default DetailDomainScreen;

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    flex: 1,
    paddingBottom: 75,
    paddingTop: 8,
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
  content: {
    width: width,
    borderRadius: 5,
    shadowColor: 'rgba(0,0,0,0.5)',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.5,
    backgroundColor: 'white',
    marginBottom: 16,
  },
  gap: {height: 16},
});
