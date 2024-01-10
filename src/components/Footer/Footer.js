import PropTypes from 'prop-types';
import * as React from 'react';
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';

import MemoIc_arrow_down_vote_off from '../../assets/arrow/Ic_downvote_off';
import MemoIc_arrow_down_vote_on from '../../assets/arrow/Ic_downvote_on';
import MemoIc_arrow_upvote_off from '../../assets/arrow/Ic_upvote_off';
import MemoIc_arrow_upvote_on from '../../assets/arrow/Ic_upvote_on';
import MemoIc_block_inactive from '../../assets/block/Ic_block_inactive';
import MemoIc_comment from '../../assets/icons/Ic_comment';
import MemoIc_share from '../../assets/icons/Ic_share';
import Memoic_globe from '../../assets/icons/ic_globe';
import {COLORS, FONTS} from '../../utils/theme';
import MemoIc_senddm from '../../assets/icons/ic_send_dm';
import SendDMAnonBlock from '../../assets/icons/images/send-dm-anon-black.svg';
import SendDMBlack from '../../assets/icons/images/send-dm-black.svg';
import ShareBlack from '../../assets/icons/images/share-black.svg';
import {Context} from '../../context';
import useDMMessage from '../../hooks/core/chat/useDMMessage';
import useCreateChat from '../../hooks/screen/useCreateChat';
import {DEFAULT_PROFILE_PIC_PATH} from '../../utils/constants';
import dimen from '../../utils/dimen';
import {normalizeFontSize} from '../../utils/fonts';
import BottomSheetMenu from '../BottomSheet/BottomSheetMenu';
import BlurredLayer from '../../screens/FeedScreen/elements/BlurredLayer';

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
  const [loading, setLoading] = React.useState({
    loadingDm: false,
    loadingDmAnon: false
  });
  const {createSignChat} = useCreateChat();

  const refSheet = React.useRef();
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
          <MemoIc_block_inactive height={22} width={22} />
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
    ? `Anonymous ${item?.anon_user_info_emoji_name}`
    : item?.actor?.data?.username;

  const onPressDM = async () => {
    try {
      setLoading({...loading, loadingDm: true});
      if (!item?.anon_user_info_emoji_name) {
        const channelName = [username, profile?.myProfile?.username].join(',');
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
      name: loading.loadingDmAnon ? 'Loading...' : `Message ${username} anonymously`,
      icon: <SendDMAnonBlock />,
      onPress: onPressDMAnon
    },
    {
      id: 3,
      name: 'Share link',
      icon: <ShareBlack />,
      onPress: onPressShare
    }
  ];

  return (
    <BlurredLayer toastOnly={true} isVisible={item?.isBlurredPost}>
      <View style={[styles.rowSpaceBeetwen, styles.container]}>
        <View style={styles.leftGroupContainer}>
          {isShowDM && !isSelf ? (
            <TouchableOpacity
              testID="sendDM"
              style={styles.btn}
              onPress={() => refSheet.current.open()}>
              <View style={styles.btnDM}>
                <View style={styles.card}>
                  <MemoIc_senddm height={20} width={21} />
                  <Text style={styles.textDM}>DM</Text>
                </View>
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
                <MemoIc_comment height={24} width={25} />
              </View>
            </View>
          ) : (
            <TouchableOpacity
              testID="availableComment"
              disabled={item?.isBlurredPost}
              style={styles.btn}
              onPress={onPressComment}>
              <View style={styles.btnComment}>
                <MemoIc_comment height={24} width={25} />
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
              <Memoic_globe height={20} width={20} />
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
                  <MemoIc_arrow_down_vote_on width={20} height={18} />
                </View>
              ) : (
                <View testID="downvoteOff">
                  <MemoIc_arrow_down_vote_off width={20} height={18} />
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
                  <MemoIc_arrow_upvote_on width={20} height={18} />
                </View>
              ) : (
                <View testID="votingUpOff">
                  <MemoIc_arrow_upvote_off width={20} height={18} />
                </View>
              )}
            </View>
          </TouchableOpacity>
        </View>
      </View>
      <BottomSheetMenu refSheet={refSheet} dataSheet={dataSheet} />
    </BlurredLayer>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center'
  },
  leftGroupContainer: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  rightGroupContainer: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  rowSpaceBeetwen: {
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
  btnDM: {
    height: '100%',
    paddingLeft: dimen.normalizeDimen(20),
    justifyContent: 'center',
    alignItems: 'center'
  },
  textDM: {
    fontSize: normalizeFontSize(12),
    fontWeight: '600',
    color: COLORS.greySubtile1,
    marginLeft: dimen.normalizeDimen(4),
    textAlignVertical: 'center'
  },
  card: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.white,
    width: dimen.normalizeDimen(50),
    height: dimen.normalizeDimen(26),
    elevation: dimen.normalizeDimen(2),
    borderRadius: dimen.normalizeDimen(13),
    padding: dimen.normalizeDimen(4),
    shadowColor: 'rgba(0, 0, 0, 0.30)',
    shadowOffset: {width: 0, height: 3},
    shadowOpacity: dimen.normalizeDimen(0.7),
    shadowRadius: dimen.normalizeDimen(2)
  },
  btnComment: (isShowDM, isSelf) => ({
    height: '100%',
    justifyContent: 'center',
    paddingLeft: isShowDM && !isSelf ? 20 : 13.5,
    paddingRight: isShowDM && !isSelf ? 6 : 10
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
  onPressShare: PropTypes.func,
  onPressComment: PropTypes.func,
  onPressBlock: PropTypes.func,
  onPressUpvote: PropTypes.func,
  onPressDownVote: PropTypes.func,
  totalVote: PropTypes.number,
  totalComment: PropTypes.number,
  statusVote: PropTypes.oneOf(['none', 'upvote', 'downvote']),
  isSelf: PropTypes.bool
};

export default Footer;
