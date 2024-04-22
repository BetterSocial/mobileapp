/* eslint-disable global-require */
import {useNavigation} from '@react-navigation/native';
import * as React from 'react';
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import Toast from 'react-native-simple-toast';
import IconEn from 'react-native-vector-icons/Entypo';

import moment from 'moment';
import ArrowDownvoteOff from '../../assets/arrow/Ic_downvote_off';
import ArrowDownvoteOn from '../../assets/arrow/Ic_downvote_on';
import ArrowUpvoteOff from '../../assets/arrow/Ic_upvote_off';
import ArrowUpvoteOn from '../../assets/arrow/Ic_upvote_on';
import MemoCommentReply from '../../assets/icon/CommentReply';
import MemoSendDM from '../../assets/icon/SendDM';
import {IcDmAnon} from '../../assets/icons/ic_dm_anon';
import SendDMBlack from '../../assets/icons/images/send-dm-black.svg';
import {Context} from '../../context';
import useDMMessage from '../../hooks/core/chat/useDMMessage';
import useCreateChat from '../../hooks/screen/useCreateChat';
import ProfilePicture from '../../screens/ProfileScreen/elements/ProfilePicture';
import {getAllowAnonDmStatus} from '../../service/chat';
import {removeWhiteSpace} from '../../utils/Utils';
import {DEFAULT_PROFILE_PIC_PATH} from '../../utils/constants';
import {fonts, normalize, normalizeFontSize} from '../../utils/fonts';
import {getCaptionWithLinkStyle, getOfficialAnonUsername} from '../../utils/string/StringUtils';
import {COLORS, FONTS} from '../../utils/theme';
import {calculateTime} from '../../utils/time';
import {getUserId} from '../../utils/users';
import BlockComponent from '../BlockComponent';
import BottomSheetMenu from '../BottomSheet/BottomSheetMenu';
import ButtonHightlight from '../ButtonHighlight';
import CommentUserName from '../CommentUsername/CommentUsername';
import useComment from './hooks/useComment';

const Comment = ({
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
  onLongPress,
  feedId,
  updateVote
}) => {
  const refSheet = React.useRef();
  const navigation = useNavigation();
  const refBlockComponent = React.useRef();
  const [yourselfId, setYourselfId] = React.useState('');
  const {totalVote, setTotalVote, statusVote, onUpVote, onDownVote, iVote} = useComment({
    comment,
    level,
    updateVote
  });
  const [loading, setLoading] = React.useState({
    loadingDm: false,
    loadingDmAnon: false
  });
  const [userAllowDm, setUserAllowDm] = React.useState(false);

  const [profile] = React.useContext(Context).profile;
  const {createSignChat} = useCreateChat();
  const {sendMessageDM} = useDMMessage();

  const userName =
    (comment.data?.anon_user_info_color_name
      ? getOfficialAnonUsername(comment?.data)
      : user?.data?.username) +
    (comment.is_you ? ' (You)' : '') +
    (comment.is_author ? ' (Post Author)' : '');

  const onTextPress = () => {
    if (level >= 2 || disableOnTextPress) {
      return;
    }
    if (onPress && typeof onPress === 'function') {
      onPress(comment.id, userName);
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

  const onBlockComponent = (commentParams) => {
    refBlockComponent.current.openBlockComponent({
      anonimity: false,
      actor: commentParams.user,
      id: commentParams.id
    });
  };

  const handleOnLongPress = () => {
    if (onLongPress && typeof onLongPress === 'function') {
      onLongPress(comment, level);
    }
  };

  React.useEffect(() => {
    iVote();
    const parseToken = async () => {
      const id = await getUserId();
      if (id) {
        setYourselfId(id);
      }
    };
    parseToken();
  }, []);

  React.useEffect(() => {
    setTotalVote(comment.data?.count_upvote - comment.data?.count_downvote);
    iVote();
  }, [JSON.stringify(comment.data)]);

  // TODO: Garry, bisa di improve jadi 1 style aja
  const voteStyle = () => {
    if (totalVote > 0) {
      return COLORS.upvote;
    }
    if (totalVote < 0) {
      return COLORS.downvote;
    }
    return COLORS.gray410;
  };

  const username = comment?.data?.anon_user_info_color_name
    ? `${comment.data.anon_user_info_color_name} ${comment.data?.anon_user_info_emoji_name}`
    : user?.data?.username;

  const onPressDM = async () => {
    try {
      setLoading({...loading, loadingDm: true});
      if (!comment?.data?.anon_user_info_color_name) {
        const channelName = username;
        const selectedUser = {
          user: {
            name: channelName,
            image: comment?.user?.data?.profile_pic_url || DEFAULT_PROFILE_PIC_PATH
          }
        };
        const members = [comment?.user?.id, profile.myProfile.user_id];
        await createSignChat(members, selectedUser);
      } else {
        await sendMessageDM(comment?.id, 'comment', 'SIGNED', feedId);
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
      await sendMessageDM(comment?.id, 'comment', 'ANONYMOUS', feedId);
    } catch (e) {
      console.warn(e);
    } finally {
      refSheet.current.close();
      setLoading({...loading, loadingDmAnon: false});
    }
  };

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
              ? COLORS.gray310
              : COLORS.white
          }
        />
      ),
      onPress: userAllowDm
        ? onPressDMAnon
        : () => {
            Toast.show('This user does not allow messages in Incognito Mode.', Toast.SHORT);
          },
      style: (!userAllowDm || loading.loadingGetAllowAnonDmStatus || loading.loadingDmAnon) && {
        color: COLORS.gray310
      }
    }
  ];

  return (
    <View
      style={styles.container({
        isLast,
        style,
        level,
        isLastInParent,
        showLeftConnector
      })}>
      <View testID="openProfile" style={styles.flexStartContainer}>
        <ButtonHightlight
          onLongPress={handleOnLongPress}
          style={styles.flexStartContainer}
          onPress={openProfile}>
          <View style={styles.profile}>
            {comment.data?.anon_user_info_emoji_name || comment.data?.is_anonymous ? (
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
              <Text style={styles.time}> {calculateTime(time || moment().format())}</Text>
            </View>
          </View>
        </ButtonHightlight>
      </View>
      <TouchableOpacity testID="textPress" onPress={onTextPress} style={styles.flexStartContainer}>
        <ButtonHightlight
          onLongPress={handleOnLongPress}
          onPress={onTextPress}
          style={styles.flexStartContainer}>
          <Text style={styles.post}>{getCaptionWithLinkStyle(comment.data?.text)}</Text>
        </ButtonHightlight>
      </TouchableOpacity>
      <View style={styles.constainerFooter}>
        {isLast && level >= 2 ? (
          <View testID="level2" style={styles.gap} />
        ) : (
          <>
            {!comment.is_you && (
              <TouchableOpacity onPress={onPressDm} testID="sendDMbtn" activeOpacity={1}>
                <ButtonHightlight
                  onPress={onPressDm}
                  style={[
                    styles.btnBlock(comment.user.id === yourselfId),
                    styles.btn,
                    styles.iconContainer
                  ]}>
                  <MemoSendDM height={normalize(14)} />
                </ButtonHightlight>
              </TouchableOpacity>
            )}
            {level !== 2 && (
              <TouchableOpacity
                activeOpacity={1}
                onPress={() => onPress(comment.id, userName)}
                testID="memoComment">
                <ButtonHightlight
                  onLongPress={handleOnLongPress}
                  style={[styles.btnReply, styles.iconContainer]}
                  onPress={() => onPress(comment.id, userName)}>
                  <MemoCommentReply height={normalize(14)} />
                </ButtonHightlight>
              </TouchableOpacity>
            )}
          </>
        )}

        {!comment?.is_you && (
          <ButtonHightlight
            onLongPress={handleOnLongPress}
            style={[
              styles.btnBlock(comment.user.id === yourselfId),
              styles.btn,
              styles.iconContainer
            ]}
            onPress={() => onBlockComponent(comment)}>
            <IconEn name="block" size={normalize(14)} color={COLORS.gray410} />
          </ButtonHightlight>
        )}

        <View style={{flexDirection: 'row', paddingLeft: 10, paddingRight: 12}}>
          <TouchableOpacity activeOpacity={1} onPress={onDownVote} testID="btnDownvote">
            <ButtonHightlight
              onLongPress={handleOnLongPress}
              style={[styles.btn]}
              onPress={onDownVote}>
              {statusVote === 'downvote' ? (
                <ArrowDownvoteOn height={normalize(14)} />
              ) : (
                <ArrowDownvoteOff height={normalize(14)} />
              )}
            </ButtonHightlight>
          </TouchableOpacity>
          <Text style={styles.vote(voteStyle())}>{totalVote}</Text>
          <TouchableOpacity activeOpacity={1} testID="upvoteBtn">
            <ButtonHightlight
              onLongPress={handleOnLongPress}
              style={[styles.btn]}
              onPress={onUpVote}>
              {statusVote === 'upvote' ? (
                <ArrowUpvoteOn height={normalize(14)} />
              ) : (
                <ArrowUpvoteOff height={normalize(14)} />
              )}
            </ButtonHightlight>
          </TouchableOpacity>
        </View>
      </View>

      <BlockComponent ref={refBlockComponent} screen={'feed_comment_item'} />
      <BottomSheetMenu refSheet={refSheet} dataSheet={dataSheet} height={182} />
    </View>
  );
};

export const isEqual = (prevProps, nextProps) => prevProps.comment === nextProps.comment;
export default React.memo(Comment);

const styles = StyleSheet.create({
  vote: (colorBasedVote) => ({
    ...FONTS.body3,
    textAlign: 'center',
    width: 26,
    alignSelf: 'center',
    color: colorBasedVote
  }),
  btn: {
    height: 30,
    justifyContent: 'center',
    alignItems: 'center'
  },
  image: {
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center'
  },
  container: ({isLast, style, level, showLeftConnector}) => ({
    width: '100%',
    borderLeftWidth: showLeftConnector ? 1 : 0,
    borderLeftColor: isLast
      ? level === 0
        ? COLORS.balance_gray
        : COLORS.transparent
      : COLORS.gray210,
    ...style
  }),
  flexStartContainer: {
    alignSelf: 'flex-start'
  },
  username: {
    fontFamily: fonts.inter[700],
    fontSize: normalizeFontSize(12),
    color: COLORS.gray410,
    lineHeight: 14,
    marginLeft: 16
  },
  post: {
    fontFamily: fonts.inter[400],
    fontSize: normalizeFontSize(14),
    color: COLORS.white,
    marginLeft: 20
  },
  profile: {
    flexDirection: 'row',
    marginLeft: -14,
    alignSelf: 'flex-start'
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
    display: isMySelf ? 'none' : 'flex'
  }),
  gap: {marginBottom: 8},
  time: {
    fontFamily: fonts.inter[400],
    fontSize: 10,
    color: COLORS.gray410,
    lineHeight: 12
  },
  containerUsername: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  iconContainer: {
    paddingHorizontal: 10
  }
});
