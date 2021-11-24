import * as React from 'react';
import IconEn from 'react-native-vector-icons/Entypo';
import Toast from 'react-native-simple-toast';
import {Image, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {useNavigation} from '@react-navigation/native';

import BlockUser from '../Blocking/BlockUser';
import MemoCommentReply from '../../assets/icon/CommentReply';
import MemoIc_arrow_down_vote_off from '../../assets/arrow/Ic_downvote_off';
import MemoIc_arrow_upvote_off from '../../assets/arrow/Ic_upvote_off';
import MemoIc_downvote_on from '../../assets/arrow/Ic_downvote_on';
import MemoIc_upvote_on from '../../assets/arrow/Ic_upvote_on';
import ReportUser from '../Blocking/ReportUser';
import SpecificIssue from '../Blocking/SpecificIssue';
import {FONTS} from '../../utils/theme';
import {blockUser} from '../../service/blocking';
import {calculateTime} from '../../utils/time';
import {colors} from '../../utils/colors';
import {downVote, iVoteComment, voteComment} from '../../service/vote';
import {fonts} from '../../utils/fonts';
import {getUserId} from '../../utils/users';
import { removeWhiteSpace } from '../../utils/Utils';

const ReplyCommentItem = ({
  user,
  comment,
  onPress,
  isLast = false,
  isLastInParent = false,
  time,
  style,
  photo,
  level,
  showLeftConnector = true,
  disableOnTextPress = false,
  refreshComment
}) => {
  const navigation = useNavigation();
  const refBlockUser = React.useRef();
  const refSpecificIssue = React.useRef();
  const refReportUser = React.useRef();
  const [userId, setUserId] = React.useState('');
  const [username, setUsername] = React.useState('');
  const [postId, setPostId] = React.useState('');
  const [reportOption, setReportOption] = React.useState([]);
  const [messageReport, setMessageReport] = React.useState('');
  const [yourselfId, setYourselfId] = React.useState('');
  const [vote, setVote] = React.useState(0)

  const [totalVote, setTotalVote] = React.useState(
    comment.data.count_upvote - comment.data.count_downvote,
  );
  const [statusVote, setStatusVote] = React.useState('');
  const [upvote, setUpVote] = React.useState(comment.data.count_upvote);
  const [downvote, setDownVote] = React.useState(comment.data.count_downvote);

  let onTextPress = () => {
    if (level >= 2 || disableOnTextPress) {
      return;
    }
    return onPress();
  };

  let openProfile = async () => {
    let selfUserId = await getUserId();
    if (selfUserId === user.id) {
      return navigation.navigate('ProfileScreen');
    }
    return navigation.navigate('OtherProfile', {
      data: {
        user_id: selfUserId,
        other_id: user.id,
        username: user.data.username,
      },
    });
  };

  const setDataToState = (value) => {
    setUsername(value.user.data.username);
    setPostId(value.id);
    setUserId(value.user.id);
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

  const onUpVote = async () => {
    let dataVote = {
      activity_id: comment.id,
      text: comment.data.text,
      status: 'upvote',
    };
    onVote(dataVote);
  };
  const onDownVote = async () => {
    let dataVote = {
      activity_id: comment.id,
      text: comment.data.text,
      status: 'downvote',
    };
    onVote(dataVote);
  };
  const onVote = async (dataVote) => {
    let result = await voteComment(dataVote);
    console.log(result.data.data.count_upvote - result.data.data.count_downvote, 'sanam')
    setTotalVote(result.data.data.count_upvote - result.data.data.count_downvote)
    iVote()
    if(refreshComment) refreshComment(result)
  };
  const iVote = async () => {
    let result = await iVoteComment(comment.id);
    if (result.code === 200) {
      setStatusVote(result.data.action);
    }
  };

  React.useEffect(() => {
    const parseToken = async () => {
      const id = await getUserId();
      if (id) {
        setYourselfId(id);
      }
    };
    parseToken();
    iVote()
  }, []);

  React.useEffect(() => {
    setTotalVote(comment.data.count_upvote  - comment.data.count_downvote)
  }, [JSON.stringify(comment)])

  return (
    <View
      style={styles.container({
        isLast,
        style,
        level,
        isLastInParent,
        showLeftConnector,
      })}>
      <TouchableOpacity onPress={openProfile}>
        <View style={styles.profile}>
          <Image
            source={
              photo
                ? {uri: removeWhiteSpace(photo)}
                : require('../../assets/images/ProfileDefault.png')
            }
            style={styles.image}
          />
          <View style={styles.containerUsername}>
            <Text style={styles.username}>{user.data.username} •</Text>
            <Text style={styles.time}> {calculateTime(time)}</Text>
          </View>
        </View>
      </TouchableOpacity>
      <TouchableOpacity onPress={onTextPress}>
        <Text style={styles.post}>{comment.data.text}</Text>
      </TouchableOpacity>
      <View style={styles.constainerFooter}>
        {isLast && level >= 2 ? (
          <View style={styles.gap} />
        ) : (
          <TouchableOpacity style={styles.btnReply} onPress={onPress}>
            <MemoCommentReply />
            <Text style={styles.btnReplyText}>Reply</Text>
          </TouchableOpacity>
        )}
        <TouchableOpacity
          style={[styles.btnBlock(comment.user.id === yourselfId), styles.btn]}
          onPress={() => {
            if (comment.user.id === yourselfId) {
              Toast.show("Can't Block yourself", Toast.LONG);
            } else {
              setDataToState(comment);
              refBlockUser.current.open();
            }
          }}>
          <IconEn name="block" size={15.02} color={colors.gray1} />
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.arrowup, styles.btn]}
          onPress={onDownVote}>
          {statusVote === 'downvote' ? (
            <MemoIc_downvote_on width={20} height={18} />
          ) : (
            <MemoIc_arrow_down_vote_off width={20} height={18} />
          )}
        </TouchableOpacity>
        <Text style={styles.vote(totalVote)}>{totalVote}</Text>
        <TouchableOpacity
          style={[styles.arrowdown, styles.btn]}
          onPress={onUpVote}>
          {statusVote === 'upvote' ? (
            <MemoIc_upvote_on width={20} height={18} />
          ) : (
            <MemoIc_arrow_upvote_off width={20} height={18} />
          )}
        </TouchableOpacity>
      </View>

      <BlockUser
        refBlockUser={refBlockUser}
        onSelect={(v) => onSelectBlocking(v)}
        username={username}
      />
      <ReportUser
        refReportUser={refReportUser}
        onSelect={onNextQuestion}
        onSkip={onSkipOnlyBlock}
      />
      <SpecificIssue
        refSpecificIssue={refSpecificIssue}
        onPress={onIssue}
        onSkip={onSkipOnlyBlock}
      />
    </View>
  );
};

export default React.memo (ReplyCommentItem, (prevProps, nextProps) => {
  return prevProps === nextProps
});

const styles = StyleSheet.create({
  vote: (count) => ({
    ...FONTS.body3,
    textAlign: 'center',
    width: 26,
    color: count > 0 ? '#00ADB5' : count < 0 ? '#FF2E63' : '#C4C4C4',
  }),
  btn: {
    // width: 30,
    height: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    width: 24,
    height: 24,
    borderRadius: 12,
  },
  container: ({isLast, style, level, isLastInParent, showLeftConnector}) => ({
    width: '100%',
    borderLeftWidth: showLeftConnector ? 1 : 0,
    borderLeftColor: isLast ? 'transparent' : colors.gray1,
    ...style,
  }),
  username: {
    fontFamily: fonts.inter[700],
    fontSize: 12,
    color: '#828282',
    lineHeight: 14,
    marginLeft: 16,
  },
  post: {
    fontFamily: fonts.inter[400],
    fontSize: 16,
    color: '#333333',
    marginLeft: 28,
  },
  profile: {
    flexDirection: 'row',
    marginLeft: -13,
  },
  constainerFooter: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 11.13,
    marginBottom: 12,
    marginLeft: 30,
  },
  btnReply: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    flex: 1,
  },
  btnReplyText: {
    fontFamily: fonts.inter[400],
    fontSize: 13,
    color: '#C4C4C4',
    marginLeft: 8.98,
    marginRight: 14,
  },
  btnBlock: (isMySelf) => ({
    paddingHorizontal: 14,
    display: isMySelf ? 'none' : 'flex',
  }),
  arrowup: {
    paddingHorizontal: 14,
  },
  arrowdown: {
    paddingHorizontal: 14,
  },
  gap: {marginBottom: 8},
  time: {
    fontFamily: fonts.inter[400],
    fontSize: 10,
    color: '#828282',
    lineHeight: 12,
  },
  containerUsername: {
    flexDirection: 'row',
    alignItems: 'center',
  },
});
