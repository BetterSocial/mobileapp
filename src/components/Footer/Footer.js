import * as React from 'react';
import {View, Text, StyleSheet, TouchableOpacity} from 'react-native';
import PropTypes from 'prop-types';

import {FONTS, SIZES} from '../../utils/theme';
import MemoIc_block_inactive from '../../assets/block/Ic_block_inactive';
import MemoIc_arrow_upvote_off from '../../assets/arrow/Ic_upvote_off';
import MemoIc_arrow_down_vote_off from '../../assets/arrow/Ic_downvote_off';
import MemoIc_share from '../../assets/icons/Ic_share';
import MemoIc_comment from '../../assets/icons/Ic_comment';
import MemoIc_arrow_down_vote_on from '../../assets/arrow/Ic_downvote_on';
import MemoIc_arrow_upvote_on from '../../assets/arrow/Ic_upvote_on';

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
}) => {
  return (
    <View style={[styles.rowSpaceBeetwen, styles.container]}>
      <View style={styles.leftGroupContainer}>
        <TouchableOpacity
          style={{...styles.btn, ...styles.btnShare}}
          onPress={onPressShare}>
          <MemoIc_share height={20} width={22} />
        </TouchableOpacity>
        {disableComment ? (
          <View
            onPress={onPressComment}
            style={{...styles.btn, ...styles.btnComment}}>
            <MemoIc_comment height={20} width={20} />
          </View>
        ) : (
          <TouchableOpacity
            style={{...styles.btn, ...styles.btnComment}}
            onPress={onPressComment}>
            <MemoIc_comment height={24} width={25} />
          </TouchableOpacity>
        )}
        <Text style={styles.text}>{totalComment}</Text>
      </View>
      <View style={{flex: 1}} />
      <View style={styles.rightGroupContainer}>
        {isSelf ? (
          <View />
        ) : (
          <TouchableOpacity
            style={{...styles.btn, ...styles.btnBlock}}
            onPress={onPressBlock}>
            <MemoIc_block_inactive height={22} width={22} />
          </TouchableOpacity>
        )}

        <TouchableOpacity
          style={{...styles.btn, ...styles.btnDownvote}}
          onPress={onPressDownVote}>
          {statusVote === 'downvote' ? (
            <MemoIc_arrow_down_vote_on width={20} height={18} />
          ) : (
            <MemoIc_arrow_down_vote_off width={20} height={18} />
          )}
        </TouchableOpacity>

        <Text style={styles.vote(totalVote)}>{totalVote}</Text>

        <TouchableOpacity
          style={{...styles.btn, ...styles.btnUpvote}}
          onPress={onPressUpvote}>
          {statusVote === 'upvote' ? (
            <MemoIc_arrow_upvote_on width={20} height={18} />
          ) : (
            <MemoIc_arrow_upvote_off width={20} height={18} />
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingVertical: 16.83,
  },
  leftGroupContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 8,
  },
  rightGroupContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 14,
  },
  rowSpaceBeetwen: {
    flexDirection: 'row',
    alignItems: 'center',
    // justifyContent: 'space-between',
    marginHorizontal: 10,
  },
  text: {
    ...FONTS.body3,
    color: '#C4C4C4',
  },
  vote: (count) => ({
    ...FONTS.body3,
    width: 26,
    textAlign: 'center',
    color: count > 0 ? '#00ADB5' : count < 0 ? '#FF2E63' : '#C4C4C4',
  }),
  btn: {
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  btnShare: {
    width: 22,
    marginRight: 27,
  },
  btnComment: {
    width: 25,
    marginRight: 10,
  },
  btnBlock: {
    width: 20,
    marginRight: 21,
  },
  btnDownvote: {
    width: 22,
    marginRight: 11,
  },
  btnUpvote: {
    width: 22,
    marginLeft: 11,
  },
});

Footer.propTypes = {
  onPressShare: PropTypes.func,
  onPressComment: PropTypes.func,
  onPressBlock: PropTypes.func,
  onPressUpvote: PropTypes.func,
  onPressDownVote: PropTypes.func,
  item: PropTypes.object.isRequired,
  totalVote: PropTypes.number,
  totalComment: PropTypes.number,
  statusVote: PropTypes.oneOf(['none', 'upvote', 'downvote']),
  isSelf: PropTypes.bool,
};

export default Footer;
