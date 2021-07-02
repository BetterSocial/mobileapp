import * as React from 'react';
import {View, Text, StyleSheet, TouchableOpacity} from 'react-native';
import {FONTS, SIZES} from '../../utils/theme';

import MemoIc_block_inactive from '../../assets/block/Ic_block_inactive';
import MemoIc_arrow_upvote_off from '../../assets/arrow/Ic_arrow_upvote_off';
import MemoIc_arrow_down_vote_off from '../../assets/arrow/Ic_arrow_down_vote_off';
import MemoIc_share from '../../assets/icons/Ic_share';
import MemoIc_comment from '../../assets/icons/Ic_comment';
import MemoIc_arrow_down_vote_on from '../../assets/arrow/Ic_arrow_down_vote_on';
import MemoIc_arrow_upvote_on from '../../assets/arrow/Ic_arrow_upvote_on';

const Footer = ({
  onPress,
  onPressShare,
  onPressComment,
  totalComment,
  isSelf,
  onPressBlock,
  statusVote,
  item,
  onPressDownVote,
  onPressUpvote,
  totalVote,
}) => {
  return (
    <View style={{...styles.rowSpaceBeetwen}}>
      <View style={{...styles.rowSpaceBeetwen, width: SIZES.width * 0.25}}>
        <TouchableOpacity onPress={onPressShare}>
          <MemoIc_share height={20} width={20} />
        </TouchableOpacity>
        <TouchableOpacity onPress={onPressComment}>
          <MemoIc_comment height={20} width={20} />
        </TouchableOpacity>
        <Text style={styles.text}>{totalComment}</Text>
      </View>
      <View style={{...styles.rowSpaceBeetwen, width: SIZES.width * 0.3}}>
        {isSelf ? (
          <View />
        ) : (
          <TouchableOpacity onPress={() => onPressBlock(item)}>
            <MemoIc_block_inactive height={18} width={18} />
          </TouchableOpacity>
        )}

        <TouchableOpacity onPress={() => onPressDownVote(item)}>
          {statusVote === 'downvote' ? (
            <MemoIc_arrow_down_vote_on width={18} height={18} />
          ) : (
            <MemoIc_arrow_down_vote_off width={18} height={18} />
          )}
        </TouchableOpacity>

        <Text
          style={{
            ...FONTS.body2,
            color:
              totalVote > 0 ? '#00ADB5' : totalVote < 0 ? '#FF2E63' : '#C4C4C4',
          }}>
          {totalVote}
        </Text>

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
  rowSpaceBeetwen: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginLeft: 10,
    marginRight: 10,
  },
  text: {
    ...FONTS.body2,
    color: '#C4C4C4',
  },
});

export default Footer;
