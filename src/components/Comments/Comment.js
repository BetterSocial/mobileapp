/* eslint-disable global-require */
import * as React from 'react';
import IconEn from 'react-native-vector-icons/Entypo';
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {useNavigation} from '@react-navigation/native';

import moment from 'moment';
import ButtonHightlight from '../ButtonHighlight';
import Image from '../Image';
import MemoCommentReply from '../../assets/icon/CommentReply';
import MemoIc_arrow_down_vote_off from '../../assets/arrow/Ic_downvote_off';
import MemoIc_arrow_upvote_off from '../../assets/arrow/Ic_upvote_off';
import MemoIc_downvote_on from '../../assets/arrow/Ic_downvote_on';
import MemoIc_upvote_on from '../../assets/arrow/Ic_upvote_on';
import useComment from './hooks/useComment';
import {COLORS, FONTS} from '../../utils/theme';
import {calculateTime} from '../../utils/time';
import {fonts, normalizeFontSize} from '../../utils/fonts';
import {getUserId} from '../../utils/users';
import {removeWhiteSpace} from '../../utils/Utils';
import BlockComponent from '../BlockComponent';
import {getCaptionWithLinkStyle} from '../../utils/string/StringUtils';
import CommentUserName from '../CommentUsername/CommentUsername';
import SendDMBlack from '../../assets/icons/images/send-dm-black.svg';
import SendDMAnonBlock from '../../assets/icons/images/send-dm-anon-black.svg';
import MemoSendDM from '../../assets/icon/SendDM';
import BottomSheetMenu from '../BottomSheet/BottomSheetMenu';
import useDMMessage from '../../hooks/core/chat/useDMMessage';
import useCreateChat from '../../hooks/screen/useCreateChat';
import {Context} from '../../context';
import {DEFAULT_PROFILE_PIC_PATH} from '../../utils/constants';
import ProfilePicture from '../../screens/ProfileScreen/elements/ProfilePicture';

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

  const [profile] = React.useContext(Context).profile;
  const {createSignChat} = useCreateChat();
  const {sendMessageDM} = useDMMessage();

  const onTextPress = () => {
    if (level >= 2 || disableOnTextPress) {
      return;
    }
    if (onPress && typeof onPress === 'function') {
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

  const voteStyle = () => {
    if (totalVote > 0) {
      return COLORS.anon_primary;
    }
    if (totalVote < 0) {
      return COLORS.redalert;
    }
    return COLORS.balance_gray;
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
          style={styles.flexStartContainer}
          onPress={onTextPress}>
          <Text style={styles.post}>{getCaptionWithLinkStyle(comment.data?.text)}</Text>
        </ButtonHightlight>
      </TouchableOpacity>
      <View style={styles.constainerFooter}>
        {isLast && level >= 2 ? (
          <View testID="level2" style={styles.gap} />
        ) : (
          <TouchableOpacity activeOpacity={1} onPress={onPress} testID="memoComment">
            <ButtonHightlight
              onLongPress={handleOnLongPress}
              style={styles.btnReply}
              onPress={onPress}>
              <MemoCommentReply />
              <Text style={styles.btnReplyText}>Reply</Text>
            </ButtonHightlight>
          </TouchableOpacity>
        )}
        <ButtonHightlight
          onLongPress={handleOnLongPress}
          style={[styles.btnBlock(comment.user.id === yourselfId), styles.btn]}
          onPress={() => refSheet.current.open()}>
          <MemoSendDM width={20} height={18} />
        </ButtonHightlight>

        <ButtonHightlight
          onLongPress={handleOnLongPress}
          style={[styles.btnBlock(comment.user.id === yourselfId), styles.btn]}
          onPress={() => onBlockComponent(comment)}>
          <IconEn name="block" size={15.02} color={COLORS.balance_gray} />
        </ButtonHightlight>

        <TouchableOpacity activeOpacity={1} onPress={onDownVote} testID="btnDownvote">
          <ButtonHightlight
            onLongPress={handleOnLongPress}
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
        <TouchableOpacity activeOpacity={1} testID="upvoteBtn">
          <ButtonHightlight
            onLongPress={handleOnLongPress}
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
    // width: 30,
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
      : COLORS.balance_gray,
    ...style
  }),
  flexStartContainer: {
    alignSelf: 'flex-start'
  },
  username: {
    fontFamily: fonts.inter[700],
    fontSize: normalizeFontSize(12),
    color: COLORS.blackgrey,
    lineHeight: 14,
    marginLeft: 16
  },
  post: {
    fontFamily: fonts.inter[400],
    fontSize: normalizeFontSize(14),
    color: COLORS.mine_shaft,
    marginLeft: 28
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
