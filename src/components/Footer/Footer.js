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
import {FONTS} from '../../utils/theme';
import {colors} from '../../utils/colors';
import {fonts} from '../../utils/fonts';

const Footer = ({
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
  loadingVote
}) => {
  const handleBlockUi = () => {
    if (isSelf) {
      return <View testID="isself" />;
    }
    if (blockStatus && blockStatus.blocker) {
      return <View testID="blocker" />;
    }
    return (
      <TouchableOpacity testID="onPressBlock" style={styles.btn} onPress={onPressBlock}>
        <View style={styles.btnBlock}>
          <MemoIc_block_inactive height={22} width={22} />
        </View>
      </TouchableOpacity>
    );
  };

  const voteStyle = () => {
    if (totalVote > 0) {
      return '#00ADB5';
    }
    if (totalVote < 0) {
      return '#FF2E63';
    }
    return '#C4C4C4';
  };
  return (
    <View style={[styles.rowSpaceBeetwen, styles.container]}>
      <View style={styles.leftGroupContainer}>
        <TouchableOpacity testID="shareBtn" style={styles.btn} onPress={onPressShare}>
          <View style={styles.btnShare}>
            <MemoIc_share height={20} width={22} />
          </View>
        </TouchableOpacity>
        {disableComment ? (
          <View testID="disableComment" style={styles.btn}>
            <View style={styles.btnComment}>
              <MemoIc_comment height={24} width={25} />
            </View>
          </View>
        ) : (
          <TouchableOpacity testID="availableComment" style={styles.btn} onPress={onPressComment}>
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
        <TouchableOpacity style={{flex: 1}} onPress={onPressComment}>
          <View style={styles.totalCommentContainer}>
            <Text style={styles.text}>{totalComment}</Text>
          </View>
        </TouchableOpacity>
      )}
      <View style={styles.rightGroupContainer}>
        {handleBlockUi()}
        <TouchableOpacity
          testID="downVoteBtn"
          disabled={loadingVote}
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
          disabled={loadingVote}
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
    color: '#C4C4C4'
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
  },
  buttonFollowing: {
    width: 88,
    height: 36,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.bondi_blue,
    borderRadius: 8
  },
  textButtonFollowing: {
    fontFamily: fonts.inter[600],
    fontWeight: 'bold',
    fontSize: 12,
    color: colors.bondi_blue
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
