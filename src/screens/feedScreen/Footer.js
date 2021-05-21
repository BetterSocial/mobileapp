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
  count = 0,
}) => {
  return (
    <View style={{...styles.rowSpaceBeetwen}}>
      <View style={{...styles.rowSpaceBeetwen, width: 70}}>
        <TouchableOpacity onPress={onPressShare}>
          <MemoIc_share height={20} width={20} />
        </TouchableOpacity>
        <TouchableOpacity onPress={onPressComment}>
          <MemoIc_comment height={20} width={20} />
        </TouchableOpacity>
      </View>
      <View style={{...styles.rowSpaceBeetwen, width: 90}}>
        <TouchableOpacity onPress={() => onPressBlock(item)}>
          <MemoIc_block_inactive height={18} width={18} />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => onPressDownVote(item)}>
          <MemoIc_arrow_down_vote_off width={18} height={18} />
        </TouchableOpacity>
        {count > 0 && (
          <Text
            style={[
              styles.textCount,
              {color: count > 0 ? '#00ADB5' : count < 0 ? '#FF2E63' : 'black'},
            ]}>
            {count}
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
  rowCenter: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  containerFeedProfile: {
    flexDirection: 'column',
    justifyContent: 'space-between',
    marginLeft: 13,
  },

  feedUsername: {
    fontFamily: fonts.inter[600],
    fontWeight: 'bold',
    fontSize: 14,
    color: colors.black,
  },
  containerFeedText: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 5,
  },
  feedDate: {
    fontFamily: fonts.inter[400],
    fontSize: 12,
    color: colors.black,
    lineHeight: 18,
  },
  point: {
    width: 2,
    height: 2,
    borderRadius: 2,
    backgroundColor: colors.gray,
    marginLeft: 6,
    marginRight: 6,
  },
  contentFeed: {
    marginTop: 12,
    flexDirection: 'column',
  },
  textContentFeed: {
    fontFamily: fonts.inter[400],
    fontSize: 14,
    lineHeight: 24,
    color: colors.black,
  },
  textComment: {
    fontFamily: fonts.inter[400],
    fontSize: 12,
    lineHeight: 18,
    color: colors.gray,
  },
  usernameComment: {
    fontFamily: fonts.inter[500],
    fontWeight: '900',
    fontSize: 12,
    lineHeight: 24,
    color: colors.black,
  },
  usernameTextComment: {
    fontFamily: fonts.inter[500],
    fontSize: 12,
    lineHeight: 24,
    color: colors.gray,
  },
  item: {
    width: screenWidth - 20,
    height: screenWidth - 20,
    marginTop: 10,
    marginLeft: -20,
  },
  imageContainer: {
    flex: 1,
    marginBottom: Platform.select({ios: 0, android: 1}), // Prevent a random Android rendering issue
    backgroundColor: 'white',
    borderRadius: 8,
  },
  image: {
    ...StyleSheet.absoluteFillObject,
    flex: 1,
    aspectRatio: 1.5,
    resizeMode: 'contain',
  },
  imageAnonimity: {
    marginRight: 8,
    width: 32,
    height: 32,
  },
  textCount: {
    fontFamily: fonts.inter[400],
    fontSize: 18,
    lineHeight: 24,
  },
});
