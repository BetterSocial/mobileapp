import * as React from 'react';
import IconEn from 'react-native-vector-icons/Entypo';
import Toast from 'react-native-simple-toast';
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
/* eslint-disable global-require */
import {useNavigation} from '@react-navigation/native';

import BlockComponent from '../BlockComponent';
import BottomSheetMenu from '../BottomSheet/BottomSheetMenu';
import ButtonHightlight from '../ButtonHighlight';
import CommentUserName from '../CommentUsername/CommentUsername';
import MemoCommentReply from '../../assets/icon/CommentReply';
import MemoIc_arrow_down_vote_off from '../../assets/arrow/Ic_downvote_off';
import MemoIc_arrow_upvote_off from '../../assets/arrow/Ic_upvote_off';
import MemoIc_downvote_on from '../../assets/arrow/Ic_downvote_on';
import MemoIc_upvote_on from '../../assets/arrow/Ic_upvote_on';
import MemoSendDM from '../../assets/icon/SendDM';
import ProfilePicture from '../../screens/ProfileScreen/elements/ProfilePicture';
import SendDMBlack from '../../assets/icons/images/send-dm-black.svg';
import useCreateChat from '../../hooks/screen/useCreateChat';
import useDMMessage from '../../hooks/core/chat/useDMMessage';
import useUpdateComment from './hooks/useUpdateComment';
import {COLORS, FONTS} from '../../utils/theme';
import {Context} from '../../context';
import {DEFAULT_PROFILE_PIC_PATH} from '../../utils/constants';
import {IcDmAnon} from '../../assets/icons/ic_dm_anon';
import {calculateTime} from '../../utils/time';
import {fonts, normalizeFontSize} from '../../utils/fonts';
import {getAllowAnonDmStatus} from '../../service/chat';
import {getCaptionWithLinkStyle} from '../../utils/string/StringUtils';
import {getUserId} from '../../utils/users';
import {iVoteComment, voteCommentV2} from '../../service/vote';
import {removeWhiteSpace} from '../../utils/Utils';

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
  onLongPress,
  feedId
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
  const [userAllowDm, setUserAllowDm] = React.useState(false);

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
      return COLORS.anon_primary;
    }
    if (totalVote < 0) {
      return COLORS.redalert;
    }
    return COLORS.balance_gray;
  };

  const handleLongPress = () => {
    if (onLongPress && typeof onLongPress === 'function') {
      onLongPress();
    }
  };
  const username = comment?.data?.anon_user_info_color_name
    ? `${comment.data.anon_user_info_color_name} ${comment.data?.anon_user_info_emoji_name}`
    : user?.data?.username;

  const onPressDm = async () => {
    try {
      refSheet.current.open();
      setLoading({...loading, loadingGetAllowAnonDmStatus: true});
      const data = await getAllowAnonDmStatus('comment', comment?.id);
      setUserAllowDm(data?.user.allow_anon_dm);
    } catch (e) {
      console.log(e);
    } finally {
      setLoading({...loading, loadingGetAllowAnonDmStatus: false});
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
      name:
        loading.loadingGetAllowAnonDmStatus || loading.loadingDmAnon
          ? 'Loading...'
          : 'Message using Incognito Mode',
      icon: (
        <IcDmAnon
          color={
            !userAllowDm || loading.loadingGetAllowAnonDmStatus || loading.loadingDmAnon
              ? COLORS.gray
              : 'black'
          }
        />
      ),
      onPress: userAllowDm
        ? onPressDMAnon
        : () => {
            Toast.show('This user does not allow messages in Incognito Mode.', Toast.SHORT);
          },
      style: (!userAllowDm || loading.loadingGetAllowAnonDmStatus || loading.loadingDmAnon) && {
        color: COLORS.gray300
      }
    }
  ];

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
              <ProfilePicture
                karmaScore={comment.karmaScores}
                size={25}
                width={6}
                withKarma
                isAnon={true}
                anonBackgroundColor={comment.data?.anon_user_info_color_code}
                anonEmojiCode={comment.data?.anon_user_info_emoji_code}
              />
            ) : (
              <ProfilePicture
                karmaScore={comment.karmaScores}
                profilePicPath={
                  photo
                    ? removeWhiteSpace(photo)
                    : require('../../assets/images/ProfileDefault.png')
                }
                size={25}
                width={6}
                withKarma
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
          <>
            <TouchableOpacity testID="replyBtn" activeOpacity={1} onPress={onPress}>
              <ButtonHightlight
                onLongPress={handleLongPress}
                style={[
                  styles.btnReply,
                  {
                    marginRight: 8,
                    paddingRight: 0
                  }
                ]}
                onPress={onPress}>
                <MemoCommentReply />
              </ButtonHightlight>
            </TouchableOpacity>
            {!comment.is_you && (
              <TouchableOpacity onPress={onPressDm} testID="sendDMbtn" activeOpacity={1}>
                <ButtonHightlight
                  onLongPress={handleLongPress}
                  onPress={onPressDm}
                  style={[
                    styles.btnBlock(comment.user.id === yourselfId),
                    styles.btn,
                    {
                      marginRight: 8,
                      paddingRight: 0
                    }
                  ]}>
                  <MemoSendDM />
                </ButtonHightlight>
              </TouchableOpacity>
            )}
          </>
        )}
        <TouchableOpacity onPress={() => onBlock(comment)} testID="btnBlock" activeOpacity={1}>
          <ButtonHightlight
            onLongPress={handleLongPress}
            onPress={() => onBlock(comment)}
            style={[
              styles.btnBlock(comment.user.id === yourselfId),
              styles.btn,
              {
                marginRight: 24,
                paddingRight: 0
              }
            ]}>
            <IconEn name="block" size={15.02} color={COLORS.balance_gray} />
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
            style={[
              styles.arrowup,
              styles.btn,
              {
                paddingLeft: 0,
                marginLeft: 0,
                marginRight: 8,
                paddingRight: 0
              }
            ]}
            onPress={onDownVote}>
            {statusVote === 'downvote' ? (
              <MemoIc_downvote_on width={20} height={18} />
            ) : (
              <MemoIc_arrow_down_vote_off width={20} height={18} />
            )}
          </ButtonHightlight>
        </TouchableOpacity>
        {<Text style={styles.vote(voteStyle())}>{totalVote}</Text>}
        <TouchableOpacity onPress={onUpVote} testID="upvotebtn" activeOpacity={1}>
          <ButtonHightlight
            onLongPress={handleLongPress}
            style={[
              styles.arrowdown,
              styles.btn,
              {
                paddingLeft: 0,
                marginLeft: 8
              }
            ]}
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
    borderLeftColor: isLast ? COLORS.transparent : COLORS.balance_gray,
    ...style
  }),
  username: {
    fontFamily: fonts.inter[700],
    fontSize: normalizeFontSize(12),
    color: COLORS.blackgrey,
    lineHeight: 14,
    marginLeft: 16
  },
  post: {
    fontFamily: fonts.inter[400],
    fontSize: normalizeFontSize(16),
    color: COLORS.mine_shaft,
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
    color: COLORS.balance_gray,
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
    color: COLORS.blackgrey,
    lineHeight: 12
  },
  containerUsername: {
    flexDirection: 'row',
    alignItems: 'center'
  }
});
