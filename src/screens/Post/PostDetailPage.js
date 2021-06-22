import * as React from 'react';
import {ScrollView, StyleSheet, View, Dimensions} from 'react-native';

import JWTDecode from 'jwt-decode';
import {getAccessToken} from '../../utils/token';
import Toast from 'react-native-simple-toast';

import Gap from '../../components/Gap';
import Footer from '../feedScreen/Footer';
import Header from '../feedScreen/Header';
import Content from '../feedScreen/Content';
import BlockUser from '../../elements/Blocking/BlockUser';
import BlockDomain from '../../elements/Blocking/BlockDomain';
import ReportUser from '../../elements/Blocking/ReportUser';
import ReportDomain from '../../elements/Blocking/ReportDomain';
import SpecificIssue from '../../elements/Blocking/SpecificIssue';
import WriteComment from '../../elements/PostDetail/WriteComment';
import ContainerComment from '../../elements/PostDetail/ContainerComment';
import {fonts} from '../../utils/fonts';
import {getMyProfile} from '../../service/profile';
import {blockUser} from '../../service/blocking';
import {downVote, upVote} from '../../service/vote';
import ContentPoll from '../feedScreen/ContentPoll';
import {
  POST_VERB_POLL,
  POST_TYPE_LINK,
  POST_TYPE_POLL,
  POST_TYPE_STANDARD,
} from '../../utils/constants';
import {createCommentParent} from '../../service/comment';
import ContentLink from '../feedScreen/ContentLink';

const {width, height} = Dimensions.get('window');

const PostDetailPage = (props) => {
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

  console.log("item in content");
  console.log(item);

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

  const onTextLayout = (e) => {
    setTotalLine(e.nativeEvent.lines.length);
  };
  const onMore = () => {
    if (more < totalLine) {
      setMore(more + 10);
    }
  };

  const onComment = () => {
    if (typeComment === 'parent') {
      commentParent();
    }
  };

  const commentParent = async () => {
    try {
      let data = await createCommentParent(textComment, item.id);
      if (data.code === 200) {
        setTextComment('');
        Toast.show('Successfully Comment', Toast.LONG);
      } else {
        Toast.show('Failed Comment', Toast.LONG);
      }
    } catch (e) {
      console.log(e);
      Toast.show('Failed Comment', Toast.LONG);
    }
  };
  const setUpVote = async (id) => {
    let result = await upVote({activity_id: id});
    if (result.code === 200) {
      Toast.show('up vote was successful', Toast.LONG);
    } else {
      Toast.show('up vote failed', Toast.LONG);
    }
  };
  const setDownVote = async (id) => {
    let result = await downVote({activity_id: id});
    if (result.code === 200) {
      Toast.show('down vote success', Toast.LONG);
    } else {
      Toast.show('down vote failed', Toast.LONG);
    }
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
              style={item.images_url.length > 0 ? {height: height * 0.5} : null}
            />
          )}

          <Gap style={styles.gap} />
          <Footer
            item={item}
            totalComment={totalComment}
            totalVote={totalVote}
            onPressUpvote={(v) => {
              setUpVote(v.id);
            }}
            onPressDownVote={(v) => {
              setDownVote(v.id);
            }}
            onPressShare={() => {}}
            onPressComment={() => {}}
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

export default PostDetailPage;

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
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  gap: {height: 16},
});
