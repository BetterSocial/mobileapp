import PropTypes from 'prop-types';
import * as React from 'react';
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';

import Toast from 'react-native-simple-toast';
import MemoIc_arrow_down_vote_off from '../../assets/arrow/Ic_downvote_off';
import MemoIc_arrow_down_vote_on from '../../assets/arrow/Ic_downvote_on';
import MemoIc_arrow_upvote_off from '../../assets/arrow/Ic_upvote_off';
import MemoIc_arrow_upvote_on from '../../assets/arrow/Ic_upvote_on';
import MemoIc_block_inactive from '../../assets/block/Ic_block_inactive';
import MemoIc_comment from '../../assets/icons/Ic_comment';
import MemoIc_share from '../../assets/icons/Ic_share';
import Memoic_globe from '../../assets/icons/ic_globe';
import MemoIc_senddm from '../../assets/icons/ic_send_dm';
import SendDMAnonBlock from '../../assets/icons/images/send-dm-anon-black.svg';
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
  showScoreButton = false,
  onPressScore,
  isShowDM = false
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
      <TouchableOpacity
        testID="onPressBlock"
        disabled={item?.isBlurredPost}
        style={styles.btn}
        onPress={onPressBlock}>
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
      return COLORS.anon_primary;
    }
    if (totalVote < 0) {
      return COLORS.redalert;
    }
    return COLORS.balance_gray;
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
      <View style={[styles.rowSpaceBetween, styles.container]}>
        <View style={styles.leftGroupContainer}>
          {isShowDM && !isSelf ? (
            <TouchableOpacity
              testID="sendDM"
              style={[
                {
                  width: 100
                }
              ]}
              onPress={onPressDm}>
              <View style={[styles.btnShare, styles.buttonShareContainer]}>
                <MemoIc_senddm height={20} width={21} />
                <Text style={[styles.text, styles.textDM]}>DM</Text>
              </View>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity testID="shareBtn" style={styles.btn} onPress={onPressShare}>
              <View style={styles.btnShare}>
                <MemoIc_share height={20} width={21} />
              </View>
            </TouchableOpacity>
          )}
          {disableComment ? (
            <View testID="disableComment" style={styles.btn}>
              <View style={styles.btnComment}>
                <MemoIc_comment
                  color={item?.isBlurredPost ? COLORS.gray : undefined}
                  height={24}
                  width={25}
                />
              </View>
            </View>
          ) : (
            <TouchableOpacity
              testID="availableComment"
              disabled={item?.isBlurredPost}
              style={styles.btn}
              onPress={onPressComment}>
              <View style={styles.btnComment(totalComment || 0)}>
                <MemoIc_comment
                  color={item?.isBlurredPost ? COLORS.gray : undefined}
                  height={24}
                  width={25}
                />
              </View>
            </TouchableOpacity>
          )}
        </View>
        {disableComment ? (
          <View style={styles.totalCommentContainer}>
            <Text style={styles.text}>{totalComment}</Text>
          </View>
        ) : (
          <TouchableOpacity
            disabled={item?.isBlurredPost}
            style={{flex: 1}}
            onPress={onPressComment}>
            <View style={styles.totalCommentContainer}>
              <Text style={styles.text}>{totalComment}</Text>
            </View>
          </TouchableOpacity>
        )}
        <View style={styles.rightGroupContainer}>
          {showScoreButton ? (
            <TouchableOpacity disabled={item?.isBlurredPost} onPress={onPressScore}>
              <Memoic_globe
                color={item?.isBlurredPost ? COLORS.gray : undefined}
                height={20}
                width={20}
              />
            </TouchableOpacity>
          ) : (
            <></>
          )}
          {handleBlockUi()}
          <TouchableOpacity
            testID="downVoteBtn"
            disabled={loadingVote || item?.isBlurredPost}
            style={styles.btn}
            onPress={onPressDownVote}>
            <View style={styles.btnDownvote}>
              {statusVote === 'downvote' ? (
                <View testID="downvoteOn">
                  <MemoIc_arrow_down_vote_on
                    color={item?.isBlurredPost ? COLORS.gray : undefined}
                    width={20}
                    height={18}
                  />
                </View>
              ) : (
                <View testID="downvoteOff">
                  <MemoIc_arrow_down_vote_off
                    color={item?.isBlurredPost ? COLORS.gray : undefined}
                    width={20}
                    height={18}
                  />
                </View>
              )}
            </View>
          </TouchableOpacity>

          <Text style={styles.vote(voteStyle())}>{totalVote}</Text>

          <TouchableOpacity
            testID="pressUpvote"
            disabled={loadingVote || item?.isBlurredPost}
            style={styles.btn}
            onPress={onPressUpvote}>
            <View style={styles.btnUpvote}>
              {statusVote === 'upvote' ? (
                <View testID="votingUpOn">
                  <MemoIc_arrow_upvote_on
                    color={item?.isBlurredPost ? COLORS.gray : undefined}
                    width={20}
                    height={18}
                  />
                </View>
              ) : (
                <View testID="votingUpOff">
                  <MemoIc_arrow_upvote_off
                    color={item?.isBlurredPost ? COLORS.gray : undefined}
                    width={20}
                    height={18}
                  />
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
  container: {
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: COLORS.gray
  },
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
  leftGroupContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start'
  },
  rightGroupContainer: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  rowSpaceBetween: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  text: {
    ...FONTS.body3,
    color: COLORS.balance_gray
  },
  vote: (colorBasedCount) => ({
    ...FONTS.body3,
    textAlign: 'center',
    width: 26,
    color: colorBasedCount
  }),
  btn: {
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    display: 'flex'
  },
  btnShare: {
    height: '100%',
    justifyContent: 'center',
    paddingRight: 13.5,
    paddingLeft: 18
  },
  btnComment: (commentValue) => ({
    height: '100%',
    justifyContent: 'center',
    marginLeft: 0,
    paddingRight: commentValue > 9 ? 10 : 4
  }),
  btnBlock: {
    height: '100%',
    justifyContent: 'center',
    paddingHorizontal: 10
  },
  btnDownvote: {
    height: '100%',
    justifyContent: 'center',
    paddingHorizontal: 11
  },
  btnUpvote: {
    height: '100%',
    justifyContent: 'center',
    paddingLeft: 11,
    paddingRight: 22
  },
  totalCommentContainer: {
    flex: 1,
    height: '100%',
    justifyContent: 'center'
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
  loadingVote: PropTypes.any,
  showScoreButton: PropTypes.bool,
  onPressScore: PropTypes.func
};

export default Footer;
