import React, {useEffect, useRef, useState} from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Dimensions,
  Alert,
} from 'react-native';
import JWTDecode from 'jwt-decode';
import {getAccessToken} from '../../data/local/accessToken';
import Comment from '../../elements/PostDetail/Comment';
import ContainerComment from '../../elements/PostDetail/ContainerComment';
import Profile from '../../elements/PostDetail/Profile';
import WriteComment from '../../elements/PostDetail/WriteComment';
import {fonts} from '../../utils/fonts';
import {getMyProfile} from '../../service/profile';
import BlockUser from '../../elements/Blocking/BlockUser';
import BlockDomain from '../../elements/Blocking/BlockDomain';
import ReportUser from '../../elements/Blocking/ReportUser';
import ReportDomain from '../../elements/Blocking/ReportDomain';
import SpecificIssue from '../../elements/Blocking/SpecificIssue';
import Toast from 'react-native-simple-toast';
import {blockUser} from '../../service/blocking';
import {showMessage} from 'react-native-flash-message';
import Header from '../feedScreen/Header';
import Content from '../feedScreen/Content';
import Footer from '../feedScreen/Footer';
import Gap from '../../components/Gap';
import {POST_VERB_POLL} from '../../utils/constants';
import ContentPoll from '../feedScreen/ContentPoll';
import {createCommentParent} from '../../service/comment';

const {width, height} = Dimensions.get('window');

const PostDetailPage = (props) => {
  const [more, setMore] = useState(10);
  const [totalLine, setTotalLine] = useState(0);
  const [loading, setLoading] = useState(false);
  const [dataProfile, setDataProfile] = useState({});
  const [reportOption, setReportOption] = useState([]);
  const [messageReport, setMessageReport] = useState('');
  const refBlockUser = useRef();
  const refBlockDomain = useRef();
  const refReportUser = useRef();
  const refReportDomain = useRef();
  const refSpecificIssue = useRef();
  const [item, setItem] = useState(props.route.params.item);
  const [isReaction, setReaction] = useState(false);
  const [textComment, setTextComment] = useState('');
  const [typeComment, setTypeComment] = useState('parent');
  const [totalComment, setTotalComment] = useState(0);
  const [totalVote, setTotalVote] = useState(0);

  useEffect(() => {
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

  useEffect(() => {
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

  const userBlock = async () => {
    const data = {
      userId: '118d5679-6c68-cdws-be83-7f15a4e82d3d',
      postId: '228d5679-6c68-54sd-be83-7f15a4e82d3d',
      source: 'screen_post_detail',
      reason: reportOption,
      message: messageReport,
    };
    let result = await blockUser(data);
    if (result.code == 200) {
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
      console.log(data);
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

  return (
    <View style={styles.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        style={{height: height * 0.9}}>
        <View style={styles.content}>
          <Header props={item} isBackButton={true} />
          {item.verb === POST_VERB_POLL ? (
            <ContentPoll
              message={item.message}
              images_url={item.images_url}
              polls={item.pollOptions}
            />
          ) : (
            <Content
              message={item.message}
              images_url={item.images_url}
              style={item.images_url.length > 0 ? {height: height * 0.5} : null}
            />
          )}

          <Gap style={{height: 16}} />
          <Footer totalComment={totalComment} totalVote={totalVote} />
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
        username="ayaka_kaminari_test"
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
});
