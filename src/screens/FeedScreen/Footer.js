/* eslint-disable import/no-extraneous-dependencies */
import * as React from 'react';
import {View, StyleSheet, Text, Dimensions, TouchableOpacity} from 'react-native';

import PropTypes from 'prop-types';
import {fonts} from '../../utils/fonts';

import MemoIcBlockInactive from '../../assets/block/Ic_block_inactive';
import MemoIcArrowUpvoteOff from '../../assets/arrow/Ic_upvote_off';
import MemoIcArrowDownvoteOff from '../../assets/arrow/Ic_downvote_off';
import MemoIcShare from '../../assets/icons/Ic_share';
import MemoIcComment from '../../assets/icons/Ic_comment';
import MemoIcArrowDownVoteOn from '../../assets/arrow/Ic_downvote_on';
import MemoIcArrowUpvoteOn from '../../assets/arrow/Ic_upvote_on';
import {COLORS} from '../../utils/theme';

const {width: screenWidth} = Dimensions.get('window');

const Footer = ({
  onPressShare,
  onPressComment,
  onPressBlock,
  onPressUpvote,
  onPressDownVote,
  item,
  totalVote = 0,
  totalComment = 0,
  statusVote = 'none'
}) => (
  <View style={[styles.rowSpaceBeetwen, styles.container]}>
    <View style={[styles.rowSpaceBeetwen, styles.width(0.25)]}>
      <TouchableOpacity testID="onShare" onPress={onPressShare} style={styles.widthFlex}>
        <MemoIcShare height={20} width={20} />
      </TouchableOpacity>
      <TouchableOpacity testID="onComment" onPress={onPressComment} style={styles.widthFlex}>
        <MemoIcComment height={20} width={20} />
      </TouchableOpacity>
      <TouchableOpacity onPress={onPressComment} style={styles.widthFlex}>
        <Text style={styles.textCount(0)}>{totalComment}</Text>
      </TouchableOpacity>
    </View>
    <View style={[styles.rowSpaceBeetwen, styles.width(0.25)]}>
      <TouchableOpacity testID="onBlock" onPress={() => onPressBlock(item)}>
        <MemoIcBlockInactive height={18} width={18} />
      </TouchableOpacity>
      <TouchableOpacity testID="onDownvote" onPress={() => onPressDownVote(item)}>
        {statusVote === 'downvote' ? (
          <View testID="downvoteOn">
            <MemoIcArrowDownVoteOn width={18} height={18} />
          </View>
        ) : (
          <View testID="downvoteOff">
            <MemoIcArrowDownvoteOff width={18} height={18} />
          </View>
        )}
      </TouchableOpacity>

      <Text style={styles.textCount(totalVote)}>{totalVote}</Text>

      <TouchableOpacity testID="onUpvote" onPress={() => onPressUpvote(item)}>
        {statusVote === 'upvote' ? (
          <View testID="upvoteOn">
            <MemoIcArrowUpvoteOn width={18} height={18} />
          </View>
        ) : (
          <View testID="upvoteOff">
            <MemoIcArrowUpvoteOff width={18} height={18} />
          </View>
        )}
      </TouchableOpacity>
    </View>
  </View>
);

const styles = StyleSheet.create({
  container: {
    marginBottom: 8,
    marginHorizontal: -16,
    paddingBottom: 16.12,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.gray100
  },
  rowSpaceBeetwen: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  textCount: (totalVote) => ({
    fontFamily: fonts.inter[400],
    fontSize: 18,
    lineHeight: 24,
    // eslint-disable-next-line no-nested-ternary
    color: handleTextCountColor(totalVote)
  }),
  width: (count) => ({
    width: screenWidth * count
  }),
  widthFlex: {
    flex: 1
  }
});

const handleTextCountColor = (totalVote) => {
  if (totalVote > 0) {
    return COLORS.anon_primary;
  }
  if (totalVote < 0) {
    return COLORS.redalert;
  }
  return COLORS.gray100;
};

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
  isSelf: PropTypes.bool
};

export default Footer;
