/* eslint-disable global-require */
import * as React from 'react';
import IconEn from 'react-native-vector-icons/Entypo';
import {Image, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {useNavigation} from '@react-navigation/native';

import BlockComponent from '../BlockComponent';
import ButtonHightlight from '../ButtonHighlight';
import MemoCommentReply from '../../assets/icon/CommentReply';
import MemoIc_arrow_down_vote_off from '../../assets/arrow/Ic_downvote_off';
import MemoIc_arrow_upvote_off from '../../assets/arrow/Ic_upvote_off';
import MemoIc_downvote_on from '../../assets/arrow/Ic_downvote_on';
import MemoIc_upvote_on from '../../assets/arrow/Ic_upvote_on';
import useUpdateComment from './hooks/useUpdateComment';
import {FONTS} from '../../utils/theme';
import {calculateTime} from '../../utils/time';
import {colors} from '../../utils/colors';
import {fonts, normalizeFontSize} from '../../utils/fonts';
import {getUserId} from '../../utils/users';
import {iVoteComment, voteCommentV2} from '../../service/vote';
import {removeWhiteSpace} from '../../utils/Utils';
import {getCaptionWithLinkStyle} from '../../utils/string/StringUtils';
import CommentUserName from '../CommentUsername/CommentUsername';
import SendDMBlack from '../../assets/icons/images/send-dm-black.svg';
import SendDMAnonBlock from '../../assets/icons/images/send-dm-anon-black.svg';
import MemoSendDM from '../../assets/icon/SendDM';
import BottomSheetMenu from '../BottomSheet/BottomSheetMenu';
import useDMMessage from '../../hooks/core/chat/useDMMessage';
import useCreateChat from '../../hooks/screen/useCreateChat';
import {DEFAULT_PROFILE_PIC_PATH} from '../../utils/constants';
import {Context} from '../../context';

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
  refreshComment,
  updateVoteParent,
  onLongPress
}) => {
  const refSheet = React.useRef();
  const navigation = useNavigation();
  const refBlockComponent = React.useRef();
  const [yourselfId, setYourselfId] = React.useState('');
  const {updateComment} = useUpdateComment();
  const [totalVote, setTotalVote] = React.useState(
    comment.data.count_upvote - comment.data.count_downvote
  );
  const [statusVote, setStatusVote] = React.useState('');
  const [loading, setLoading] = React.useState({
    loadingDm: false,
    loadingDmAnon: false
  });

  const [profile] = React.useContext(Context).profile;
  const {createSignChat} = useCreateChat();
  const {sendMessageDM} = useDMMessage();

  const onTextPress = () => {
    if (level >= 2 || disableOnTextPress) {
      console.log('');
      return;
    }
    if (onPress) {
      onPress();
    }
  };
  const openProfile = async () => {
    const selfUserId = await getUserId();
    if (selfUserId === user.id) {
      return navigation.navigate('ProfileScreen', {
        isNotFromHomeTab: true
      });
    }
    return navigation.navigate('OtherProfile', {
      data: {
        user_id: selfUserId,
        other_id: user.id,
        username: user.data.username
      }
    });
  };

  const onUpVote = async () => {
    const dataVote = {
      reaction_id: comment.id,
      vote: 'upvote'
    };
    onVote(dataVote);
  };

  const onDownVote = async () => {
    const dataVote = {
      reaction_id: comment.id,
      vote: 'downvote'
    };
    onVote(dataVote);
  };
  const onVote = async (dataVote) => {
    const result = await voteCommentV2(dataVote);
    if (updateVoteParent && typeof updateVoteParent === 'function') {
      updateVoteParent();
    }
    setTotalVote(result.data.count_upvote - result.data.count_downvote);
    iVote();
    if (refreshComment) refreshComment(result);
    updateComment(result.data.activity_id);
  };
  const iVote = async () => {
    const result = await iVoteComment(comment.id);
    if (result.code === 200) {
      setStatusVote(result.data.action);
    }
  };

  const onBlock = (commentBlock) => {
    refBlockComponent.current.openBlockComponent({
      anonimity: false,
      actor: commentBlock.user,
      id: commentBlock.id
    });
  };
  React.useEffect(() => {
    const parseToken = async () => {
      const id = await getUserId();
      if (id) {
        setYourselfId(id);
      }
    };
    parseToken();
    iVote();
  }, []);

  React.useEffect(() => {
    setTotalVote(comment.data.count_upvote - comment.data.count_downvote);
  }, [JSON.stringify(comment.data)]);

  const voteStyle = () => {
    if (totalVote > 0) {
      return '#00ADB5';
    }
    if (totalVote < 0) {
      return '#FF2E63';
    }
    return '#C4C4C4';
  };

  const handleLongPress = () => {
    if (onLongPress && typeof onLongPress === 'function') {
      onLongPress();
    }
  };

  const username = comment?.data?.anon_user_info_color_name
    ? `Anonymous ${comment.data?.anon_user_info_emoji_name}`
    : user?.data?.username;

  const onPressDM = async () => {
    try {
      setLoading({...loading, loadingDm: true});
      if (!comment?.data?.anon_user_info_color_name) {
        const channelName = [username, profile?.myProfile?.username].join(',');
        const selectedUser = {
          user: {
            name: channelName,
            image: comment?.user?.data?.profile_pic_url || DEFAULT_PROFILE_PIC_PATH
          }
        };
        const members = [comment?.user?.id, profile.myProfile.user_id];
        await createSignChat(members, selectedUser);
      } else {
        await sendMessageDM(comment?.id, 'comment', 'SIGNED');
      }
    } catch (e) {
      console.warn(e);
    } finally {
      refSheet.current.close();
      setLoading({...loading, loadingDm: false});
    }
  };

  const onPressDMAnon = async () => {
    try {
      setLoading({...loading, loadingDmAnon: true});
      await sendMessageDM(comment?.id, 'comment', 'ANONYMOUS');
    } catch (e) {
      console.warn(e);
    } finally {
      refSheet.current.close();
      setLoading({...loading, loadingDmAnon: false});
    }
  };

  const dataSheet = [
    {
      id: 1,
      name: loading.loadingDm ? 'Loading...' : `Message ${username}`,
      icon: <SendDMBlack />,
      onPress: onPressDM
    },
    {
      id: 2,
      name: loading.loadingDmAnon ? 'Loading...' : `Message ${username} anonymously`,
      icon: <SendDMAnonBlock />,
      onPress: onPressDMAnon
    }
  ];

  return (
    <TouchableOpacity
      onLongPress={handleLongPress}
      activeOpacity={1}
      style={styles.container({
        isLast,
        style,
        level,
        isLastInParent,
        showLeftConnector
      })}>
      <TouchableOpacity activeOpacity={1} onPress={openProfile} testID="profileOpen">
        <ButtonHightlight onLongPress={handleLongPress} onPress={openProfile}>
          <View style={styles.profile}>
            {comment.data.anon_user_info_emoji_name || comment.data.is_anonymous ? (
              <View
                style={[styles.image, {backgroundColor: comment.data.anon_user_info_color_code}]}>
                <Text>{comment.data.anon_user_info_emoji_code}</Text>
              </View>
            ) : (
              <Image
                source={
                  photo
                    ? {uri: removeWhiteSpace(photo)}
                    : require('../../assets/images/ProfileDefault.png')
                }
                style={styles.image}
              />
            )}

            <View style={styles.containerUsername}>
              <CommentUserName comment={comment} user={user} />
              <Text style={styles.time}> {calculateTime(time)}</Text>
            </View>
          </View>
        </ButtonHightlight>
      </TouchableOpacity>

      <TouchableOpacity activeOpacity={1} testID="ontextpress" onPress={onTextPress}>
        <ButtonHightlight onLongPress={handleLongPress} onPress={onTextPress}>
          <Text testID="commentText" style={styles.post}>
            {getCaptionWithLinkStyle(comment?.data?.text)}
          </Text>
        </ButtonHightlight>
      </TouchableOpacity>

      <View style={styles.constainerFooter}>
        {isLast && level >= 2 ? (
          <View style={styles.gap} />
        ) : (
          <TouchableOpacity testID="replyBtn" activeOpacity={1} onPress={onPress}>
            <ButtonHightlight
              onLongPress={handleLongPress}
              style={styles.btnReply}
              onPress={onPress}>
              <MemoCommentReply />
              <Text style={styles.btnReplyText}>Reply</Text>
            </ButtonHightlight>
          </TouchableOpacity>
        )}
        <TouchableOpacity onPress={() => onBlock(comment)} testID="btnBlock" activeOpacity={1}>
          <ButtonHightlight
            onLongPress={handleLongPress}
            onPress={() => onBlock(comment)}
            style={[styles.btnBlock(comment.user.id === yourselfId), styles.btn]}>
            <IconEn name="block" size={15.02} color={colors.gray1} />
          </ButtonHightlight>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => refSheet.current.open()}
          testID="sendDMbtn"
          activeOpacity={1}>
          <ButtonHightlight
            onLongPress={handleLongPress}
            onPress={() => refSheet.current.open()}
            style={[styles.btnBlock(comment.user.id === yourselfId), styles.btn]}>
            <MemoSendDM />
          </ButtonHightlight>
        </TouchableOpacity>

        <TouchableOpacity onPress={onDownVote} testID="downvoteBtn">
          <ButtonHightlight
            onLongPress={handleLongPress}
            style={[styles.arrowup, styles.btn]}
            onPress={onDownVote}>
            {statusVote === 'downvote' ? (
              <MemoIc_downvote_on width={20} height={18} />
            ) : (
              <MemoIc_arrow_down_vote_off width={20} height={18} />
            )}
          </ButtonHightlight>
        </TouchableOpacity>
        {totalVote !== 0 && <Text style={styles.vote(voteStyle())}>{totalVote}</Text>}
        <TouchableOpacity onPress={onUpVote} testID="upvotebtn" activeOpacity={1}>
          <ButtonHightlight
            onLongPress={handleLongPress}
            style={[styles.arrowdown, styles.btn]}
            onPress={onUpVote}>
            {statusVote === 'upvote' ? (
              <MemoIc_upvote_on width={20} height={18} />
            ) : (
              <MemoIc_arrow_upvote_off width={20} height={18} />
            )}
          </ButtonHightlight>
        </TouchableOpacity>
      </View>

      <BottomSheetMenu refSheet={refSheet} dataSheet={dataSheet} height={182} />
      <BlockComponent ref={refBlockComponent} refresh={() => {}} screen="reply_screen" />
    </TouchableOpacity>
  );
};

export default React.memo(ReplyCommentItem, (prevProps, nextProps) => prevProps === nextProps);

const styles = StyleSheet.create({
  vote: (colorBasedCount) => ({
    ...FONTS.body3,
    textAlign: 'center',
    width: 26,
    color: colorBasedCount,
    alignSelf: 'center'
  }),
  btn: {
    // width: 30,
    height: 30,
    justifyContent: 'center',
    alignItems: 'center'
  },
  image: {
    width: 24,
    height: 24,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center'
  },
  container: ({isLast, style, showLeftConnector}) => ({
    width: '100%',
    borderLeftWidth: showLeftConnector ? 1 : 0,
    borderLeftColor: isLast ? 'transparent' : colors.gray1,
    ...style
  }),
  username: {
    fontFamily: fonts.inter[700],
    fontSize: normalizeFontSize(12),
    color: '#828282',
    lineHeight: 14,
    marginLeft: 16
  },
  post: {
    fontFamily: fonts.inter[400],
    fontSize: normalizeFontSize(16),
    color: '#333333',
    marginLeft: 28
  },
  profile: {
    flexDirection: 'row',
    marginLeft: -13
  },
  constainerFooter: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 11.13,
    marginBottom: 12,
    marginLeft: 30
  },
  btnReply: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    flex: 1
  },
  btnReplyText: {
    fontFamily: fonts.inter[400],
    fontSize: 13,
    color: '#C4C4C4',
    marginLeft: 8.98,
    marginRight: 14
  },
  btnBlock: (isMySelf) => ({
    paddingHorizontal: 14,
    display: isMySelf ? 'none' : 'flex'
  }),
  arrowup: {
    paddingHorizontal: 14
  },
  arrowdown: {
    paddingHorizontal: 14
  },
  gap: {marginBottom: 8},
  time: {
    fontFamily: fonts.inter[400],
    fontSize: 10,
    color: '#828282',
    lineHeight: 12
  },
  containerUsername: {
    flexDirection: 'row',
    alignItems: 'center'
  }
});
