import React from 'react';
import {
  View,
  StyleSheet,
  Text,
  Platform,
  Dimensions,
  TouchableOpacity,
} from 'react-native';

import {colors} from '../../utils/colors';
import {fonts} from '../../utils/fonts';

import MemoIc_block_inactive from '../../assets/block/Ic_block_inactive';
import MemoIc_arrow_upvote_off from '../../assets/arrow/Ic_arrow_upvote_off';
import MemoIc_arrow_down_vote_off from '../../assets/arrow/Ic_arrow_down_vote_off';
import MemoIc_share from '../../assets/icons/Ic_share';
import MemoIc_comment from '../../assets/icons/Ic_comment';

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
}) => {
  return (
    <View style={{...styles.rowSpaceBeetwen, marginBottom: 8}}>
      <View style={{...styles.rowSpaceBeetwen, width: screenWidth * 0.25}}>
        <TouchableOpacity onPress={onPressShare}>
          <MemoIc_share height={20} width={20} />
        </TouchableOpacity>
        <TouchableOpacity onPress={onPressComment}>
          <MemoIc_comment height={20} width={20} />
        </TouchableOpacity>
        <Text style={styles.textCount}>{totalComment}</Text>
      </View>
      <View style={{...styles.rowSpaceBeetwen, width: screenWidth * 0.3}}>
        <TouchableOpacity onPress={() => onPressBlock(item)}>
          <MemoIc_block_inactive height={18} width={18} />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => onPressDownVote(item)}>
          <MemoIc_arrow_down_vote_off width={18} height={18} />
        </TouchableOpacity>
        {totalVote > 0 && (
          <Text
            style={[
              styles.textCount,
              {
                color:
                  totalVote > 0
                    ? '#00ADB5'
                    : totalVote < 0
                    ? '#FF2E63'
                    : 'black',
              },
            ]}>
            {totalVote}
          </Text>
        )}
        <TouchableOpacity onPress={() => onPressUpvote(item)}>
          <MemoIc_arrow_upvote_off width={18} height={18} />
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default Footer;

const styles = StyleSheet.create({
  rowSpaceBeetwen: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  textCount: {
    fontFamily: fonts.inter[400],
    fontSize: 18,
    lineHeight: 24,
    color: '#C4C4C4',
  },
});
