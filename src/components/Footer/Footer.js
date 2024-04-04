import PropTypes from 'prop-types';
import * as React from 'react';
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';

import Toast from 'react-native-simple-toast';
import LinearGradient from 'react-native-linear-gradient';
import ArrowDownvoteOff from '../../assets/arrow/Ic_downvote_off';
import ArrowDownvoteOn from '../../assets/arrow/Ic_downvote_on';
import ArrowUpvoteOff from '../../assets/arrow/Ic_upvote_off';
import ArrowUpvoteOn from '../../assets/arrow/Ic_upvote_on';
import MemoIc_block_inactive from '../../assets/block/Ic_block_inactive';
import MemoIc_share from '../../assets/icons/Ic_share';
import MemoIc_senddm from '../../assets/icons/ic_send_dm';
import SendDMBlack from '../../assets/icons/images/send-dm-black.svg';
import {Context} from '../../context';
import useDMMessage from '../../hooks/core/chat/useDMMessage';
import useCreateChat from '../../hooks/screen/useCreateChat';
import BlurredLayer from '../../screens/FeedScreen/elements/BlurredLayer';
import {getAllowAnonDmStatus} from '../../service/chat';
import {DEFAULT_PROFILE_PIC_PATH} from '../../utils/constants';
import {COLORS, FONTS} from '../../utils/theme';
import BottomSheetMenu from '../BottomSheet/BottomSheetMenu';
import {IcDmAnon} from '../../assets/icons/ic_dm_anon';
import IconCommentArrow from '../../assets/icon/IconCommentArrow';

const Footer = ({
  item,
  onPressShare,
  onPressComment,
  totalComment,
  isSelf,
  onPressBlock,
  statusVote = 'none',
  onPressDownVote,
  onPressUpvote,
  totalVote,
  disableComment = false,
  blockStatus,
  loadingVote,
  isShowDM = false,
  isShortText = false
}) => {
  const {sendMessageDM} = useDMMessage();
  const [profile] = React.useContext(Context).profile;
  const [userAllowDm, setUserAllowDm] = React.useState(false);

  const [loading, setLoading] = React.useState({
    loadingDm: false,
    loadingDmAnon: false,
    loadingGetAllowAnonDmStatus: false
  });
  const refSheet = React.useRef();
  const {createSignChat} = useCreateChat();

  const handleBlockUi = () => {
    if (isSelf) {
      return <View testID="isself" />;
    }
    if (blockStatus && blockStatus.blocker) {
      return <View testID="blocker" />;
    }
    return (
      <TouchableOpacity testID="onPressBlock" disabled={item?.isBlurredPost} onPress={onPressBlock}>
        <View style={styles.btnBlock}>
          <MemoIc_block_inactive
            color={item?.isBlurredPost ? COLORS.gray : undefined}
            height={22}
            width={22}
          />
        </View>
      </TouchableOpacity>
    );
  };

  const voteStyle = () => {
    if (totalVote > 0) {
      return COLORS.upvote;
    }
    if (totalVote < 0) {
      return COLORS.downvote;
    }
    return COLORS.gray400;
  };

  const username = item?.anon_user_info_emoji_name
    ? `${item.anon_user_info_color_name} ${item?.anon_user_info_emoji_name}`
    : item?.actor?.data?.username;

  const onPressDM = async () => {
    try {
      setLoading({...loading, loadingDm: true});
      if (!item?.anon_user_info_emoji_name) {
        const channelName = username;
        const selectedUser = {
          user: {
            name: channelName,
            image: item?.actor?.data?.profile_pic_url || DEFAULT_PROFILE_PIC_PATH
          }
        };
        const members = [item?.actor?.id, profile.myProfile.user_id];
        await createSignChat(members, selectedUser);
      } else {
        await sendMessageDM(item.id, 'post', 'SIGNED');
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
      await sendMessageDM(item.id, 'post', 'ANONYMOUS');
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

  const onPressDm = async () => {
    try {
      refSheet.current.open();
      setLoading({...loading, loadingGetAllowAnonDmStatus: true});
      const data = await getAllowAnonDmStatus(item.id);
      setUserAllowDm(data?.user.allow_anon_dm);
    } catch (e) {
      console.log(e);
    } finally {
      setLoading({...loading, loadingGetAllowAnonDmStatus: false});
    }
  };

  return (
    <BlurredLayer toastOnly={true} isVisible={item?.isBlurredPost}>
      {!isShortText && (
        <View
          style={{
            paddingHorizontal: 16,
            backgroundColor: COLORS.almostBlack,
            borderRightWidth: 1,
            borderLeftWidth: 1,
            borderColor: COLORS.darkGray
          }}>
          <View
            style={{
              borderTopColor: COLORS.grey300,
              borderTopWidth: 1,
              opacity: 0.3
            }}
          />
        </View>
      )}
      <View style={styles.container(isShortText)}>
        {isShortText && (
          <LinearGradient
            colors={['#275D8A', '#275D8A']}
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              paddingHorizontal: 16
            }}>
            <View
              style={{
                borderTopColor: COLORS.grey300,
                borderTopWidth: 1,
                opacity: 0.3
              }}
            />
          </LinearGradient>
        )}
        {isShowDM && !isSelf ? (
          <TouchableOpacity testID="sendDM" onPress={onPressDm}>
            <View style={[styles.btnShare, styles.buttonShareContainer]}>
              <MemoIc_senddm height={18} width={18} />
              <Text style={[styles.text, styles.textDM]}>DM</Text>
            </View>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity testID="shareBtn" onPress={onPressShare}>
            <View style={styles.btnShare}>
              <MemoIc_share height={20} width={21} />
            </View>
          </TouchableOpacity>
        )}
        {disableComment ? (
          <View testID="disableComment">
            <View style={styles.btnComment(totalComment || 0)}>
              <IconCommentArrow color={COLORS.grey410} />
            </View>
            <Text style={styles.text}>{totalComment}</Text>
          </View>
        ) : (
          <TouchableOpacity
            testID="availableComment"
            disabled={item?.isBlurredPost}
            onPress={onPressComment}
            style={{flexDirection: 'row', alignItems: 'center'}}>
            <View style={styles.btnComment(totalComment || 0)}>
              <IconCommentArrow color={COLORS.grey410} />
            </View>
            <Text style={styles.text}>{totalComment}</Text>
          </TouchableOpacity>
        )}
        {handleBlockUi()}
        <View style={{flexDirection: 'row', alignItems: 'center'}}>
          <TouchableOpacity
            testID="downVoteBtn"
            disabled={loadingVote || item?.isBlurredPost}
            onPress={onPressDownVote}>
            <View>
              {statusVote === 'downvote' ? (
                <View testID="downvoteOn">
                  <ArrowDownvoteOn color={item?.isBlurredPost ? COLORS.gray : undefined} />
                </View>
              ) : (
                <View testID="downvoteOff">
                  <ArrowDownvoteOff color={item?.isBlurredPost ? COLORS.gray : undefined} />
                </View>
              )}
            </View>
          </TouchableOpacity>

          <Text style={styles.vote(voteStyle())}>{totalVote}</Text>

          <TouchableOpacity
            testID="pressUpvote"
            disabled={loadingVote || item?.isBlurredPost}
            onPress={onPressUpvote}>
            <View>
              {statusVote === 'upvote' ? (
                <View testID="votingUpOn">
                  <ArrowUpvoteOn color={item?.isBlurredPost ? COLORS.gray : undefined} />
                </View>
              ) : (
                <View testID="votingUpOff">
                  <ArrowUpvoteOff color={item?.isBlurredPost ? COLORS.gray : undefined} />
                </View>
              )}
            </View>
          </TouchableOpacity>
        </View>
      </View>
      <BottomSheetMenu height={186} refSheet={refSheet} dataSheet={dataSheet} />
    </BlurredLayer>
  );
};

const styles = StyleSheet.create({
  container: (isShortText) => ({
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    height: 48,
    paddingHorizontal: 16,
    paddingVertical: 10,
    backgroundColor: COLORS.almostBlack,
    borderLeftWidth: 1,
    borderRightWidth: 1,
    borderColor: COLORS.darkGray,
    marginTop: isShortText ? -1 : 0
  }),
  buttonShareContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingLeft: 0,
    paddingRight: 0
  },
  textDM: {
    marginLeft: 4,
    fontWeight: '500'
  },
  text: {
    ...FONTS.body3,
    color: COLORS.grey410
  },
  vote: (colorBasedCount) => ({
    ...FONTS.body3,
    textAlign: 'center',
    marginHorizontal: 10,
    minWidth: 28,
    color: colorBasedCount
  }),
  btnShare: {
    height: '100%',
    justifyContent: 'center'
  },
  btnComment: (commentValue) => ({
    marginRight: commentValue > 9 ? 10 : 6
  }),
  btnBlock: {
    height: '100%',
    justifyContent: 'center',
    paddingHorizontal: 10
  }
});

Footer.propTypes = {
  item: PropTypes.object,
  onPressShare: PropTypes.func,
  onPressComment: PropTypes.func,
  onPressBlock: PropTypes.func,
  onPressUpvote: PropTypes.func,
  onPressDownVote: PropTypes.func,
  totalVote: PropTypes.number,
  totalComment: PropTypes.number,
  statusVote: PropTypes.oneOf(['none', 'upvote', 'downvote']),
  isSelf: PropTypes.bool,
  disableComment: PropTypes.bool,
  blockStatus: PropTypes.any,
  loadingVote: PropTypes.any
};

export default Footer;
