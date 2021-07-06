import * as React from 'react';
import {View, Text, StyleSheet, TouchableOpacity} from 'react-native';
import PropTypes from 'prop-types';

import {FONTS, SIZES} from '../../utils/theme';
import MemoIc_block_inactive from '../../assets/block/Ic_block_inactive';
import MemoIc_arrow_upvote_off from '../../assets/arrow/Ic_arrow_upvote_off';
import MemoIc_arrow_down_vote_off from '../../assets/arrow/Ic_arrow_down_vote_off';
import MemoIc_share from '../../assets/icons/Ic_share';
import MemoIc_comment from '../../assets/icons/Ic_comment';
import MemoIc_arrow_down_vote_on from '../../assets/arrow/Ic_arrow_down_vote_on';
import MemoIc_arrow_upvote_on from '../../assets/arrow/Ic_arrow_upvote_on';

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
      <View style={{...styles.rowSpaceBeetwen, width: SIZES.width * 0.25}}>
        <TouchableOpacity onPress={onPressShare}>
          <MemoIc_share height={20} width={20} />
        </TouchableOpacity>
        {disableComment ? (
          <View onPress={onPressComment}>
            <MemoIc_comment height={20} width={20} />
          </View>
        ) : (
          <TouchableOpacity onPress={onPressComment}>
            <MemoIc_comment height={20} width={20} />
          </TouchableOpacity>
        )}
        <Text style={styles.text}>{totalComment}</Text>
      </View>
      <View style={{...styles.rowSpaceBeetwen, width: SIZES.width * 0.3}}>
        {isSelf ? (
          <View />
        ) : (
          <TouchableOpacity onPress={onPressBlock}>
            <MemoIc_block_inactive height={18} width={18} />
          </TouchableOpacity>
        )}

        <TouchableOpacity onPress={onPressDownVote}>
          {statusVote === 'downvote' ? (
            <MemoIc_arrow_down_vote_on width={18} height={18} />
          ) : (
            <MemoIc_arrow_down_vote_off width={18} height={18} />
          )}
        </TouchableOpacity>

        <Text style={styles.vote(totalVote)}>{totalVote}</Text>

        <TouchableOpacity onPress={onPressUpvote}>
          {statusVote === 'upvote' ? (
            <MemoIc_arrow_upvote_on width={18} height={18} />
          ) : (
            <MemoIc_arrow_upvote_off width={18} height={18} />
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    borderBottomWidth: 1,
    borderBottomColor: '#C4C4C4',
    marginHorizontal: -16,
    paddingHorizontal: 26,
    paddingVertical: 16.83,
  },
  rowSpaceBeetwen: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginHorizontal: 10,
  },
  text: {
    ...FONTS.body2,
    color: '#C4C4C4',
  },
  vote: (count) => ({
    ...FONTS.body2,
    color: count > 0 ? '#00ADB5' : count < 0 ? '#FF2E63' : '#C4C4C4',
  }),
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
