import * as React from 'react';
import PropTypes from 'prop-types';
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
  onPressScore
}) => {
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
  return (
    <BlurredLayer toastOnly={true} isVisible={item?.isBlurredPost}>
      <View style={[styles.rowSpaceBetween, styles.container]}>
        <View style={styles.leftGroupContainer}>
          <TouchableOpacity
            testID="shareBtn"
            disabled={item?.isBlurredPost}
            style={styles.btn}
            onPress={onPressShare}>
            <View style={styles.btnShare}>
              <MemoIc_share
                color={item?.isBlurredPost ? COLORS.gray : undefined}
                height={20}
                width={21}
              />
            </View>
          </TouchableOpacity>
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
              <View style={styles.btnComment}>
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
    </BlurredLayer>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: COLORS.gray
  },
  leftGroupContainer: {
    flexDirection: 'row',
    alignItems: 'center'
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
  btnComment: {
    height: '100%',
    justifyContent: 'center',
    paddingLeft: 13.5,
    paddingRight: 10
  },
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
