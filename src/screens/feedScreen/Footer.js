import * as React from 'react';
import {
  View,
  StyleSheet,
  Text,
  Dimensions,
  TouchableOpacity,
  Image,
} from 'react-native';

import {fonts} from '../../utils/fonts';
import PropTypes from 'prop-types';

import MemoIc_block_inactive from '../../assets/block/Ic_block_inactive';
import MemoIc_arrow_upvote_off from '../../assets/arrow/Ic_arrow_upvote_off';
import MemoIc_arrow_down_vote_off from '../../assets/arrow/Ic_arrow_down_vote_off';
import MemoIc_share from '../../assets/icons/Ic_share';
import MemoIc_comment from '../../assets/icons/Ic_comment';
import MemoIc_arrow_down_vote_on from '../../assets/arrow/Ic_arrow_down_vote_on';
import MemoIc_arrow_upvote_on from '../../assets/arrow/Ic_arrow_upvote_on';
import {colors} from '../../utils/colors';

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
  statusVote = 'none',
  isSelf = false,
}) => {
  return (
    <View style={[styles.rowSpaceBeetwen, styles.container]}>
      <View style={[styles.rowSpaceBeetwen, styles.width(0.25)]}>
        <TouchableOpacity onPress={onPressShare} style={styles.widthFlex}>
          <MemoIc_share height={20} width={20} />
        </TouchableOpacity>
        <TouchableOpacity onPress={onPressComment} style={styles.widthFlex}>
          <MemoIc_comment height={20} width={20} />
        </TouchableOpacity>
        <TouchableOpacity onPress={onPressComment} style={styles.widthFlex}>
          <Text style={styles.textCount(0)}>{totalComment}</Text>
        </TouchableOpacity>
      </View>
      <View style={[styles.rowSpaceBeetwen, styles.width(0.25)]}>
        <TouchableOpacity onPress={() => onPressBlock(item)}>
          <MemoIc_block_inactive height={18} width={18} />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => onPressDownVote(item)}>
          {statusVote === 'downvote' ? (
            <MemoIc_arrow_down_vote_on width={18} height={18} />
          ) : (
            <MemoIc_arrow_down_vote_off width={18} height={18} />
          )}
        </TouchableOpacity>

        <Text style={styles.textCount(totalVote)}>{totalVote}</Text>

        <TouchableOpacity onPress={() => onPressUpvote(item)}>
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
    marginBottom: 8,
    marginHorizontal: -16,
    paddingBottom: 16.12,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: colors.gray1,
  },
  rowSpaceBeetwen: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  textCount: (totalVote) => ({
    fontFamily: fonts.inter[400],
    fontSize: 18,
    lineHeight: 24,
    color: totalVote > 0 ? '#00ADB5' : totalVote < 0 ? '#FF2E63' : '#C4C4C4',
  }),
  width: (count) => ({
    width: screenWidth * count,
  }),
  widthFlex: {
    flex: 1,
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
