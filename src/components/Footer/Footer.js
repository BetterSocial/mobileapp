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
        <TouchableOpacity style={styles.btn} onPress={onPressShare}>
          <View style={styles.btnShare}>
            <MemoIc_share height={20} width={22} />
          </View>
        </TouchableOpacity>
        {disableComment ? (
          <View style={styles.btn}>
            <View style={styles.btnComment}>
              <MemoIc_comment height={24} width={25} />
            </View>
          </View>
        ) : (
          <TouchableOpacity style={styles.btn} onPress={onPressComment}>
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
        {isSelf ? (
          <View />
        ) : (
          <TouchableOpacity style={styles.btn} onPress={onPressBlock}>
            <View style={styles.btnBlock}>
              <MemoIc_block_inactive height={22} width={22} />
            </View>
          </TouchableOpacity>
        )}

        <TouchableOpacity style={styles.btn} onPress={onPressDownVote}>
          <View style={styles.btnDownvote}>
            {statusVote === 'downvote' ? (
              <MemoIc_arrow_down_vote_on width={20} height={18} />
            ) : (
              <MemoIc_arrow_down_vote_off width={20} height={18} />
            )}
          </View>
        </TouchableOpacity>

        <Text style={styles.vote(totalVote)}>{totalVote}</Text>

        <TouchableOpacity style={styles.btn} onPress={onPressUpvote}>
          <View style={styles.btnUpvote}>
            {statusVote === 'upvote' ? (
              <MemoIc_arrow_upvote_on width={20} height={18} />
            ) : (
              <MemoIc_arrow_upvote_off width={20} height={18} />
            )}
          </View>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    height: '100%',
  },
  leftGroupContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    // marginLeft: 8,
  },
  rightGroupContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 8,
  },
  rowSpaceBeetwen: {
    flexDirection: 'row',
    alignItems: 'center',
    // justifyContent: 'space-between',
    // marginHorizontal: 10,
  },
  text: {
    ...FONTS.body3,
    color: '#C4C4C4',
  },
  vote: (count) => ({
    ...FONTS.body3,
    textAlign: 'center',
    width: 26,
    color: count > 0 ? '#00ADB5' : count < 0 ? '#FF2E63' : '#C4C4C4',
  }),
  btn: {
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    display: 'flex',
  },
  btnShare: {
    height: '100%',
    justifyContent: 'center',
    paddingRight: 13.5,
    paddingLeft: 10,
    // backgroundColor: 'red',
  },
  btnComment: {
    height: '100%',
    justifyContent: 'center',
    paddingLeft: 13.5,
    paddingRight: 10,
    // backgroundColor: 'blue',
  },
  btnBlock: {
    height: '100%',
    justifyContent: 'center',
    paddingHorizontal: 10,
    // backgroundColor: 'gray',
  },
  btnDownvote: {
    height: '100%',
    justifyContent: 'center',
    paddingHorizontal: 11,
    // backgroundColor: 'green',
  },
  btnUpvote: {
    height: '100%',
    justifyContent: 'center',
    paddingHorizontal: 11,
    // backgroundColor: 'brown',
  },
  totalCommentContainer: {
    flex: 1,
    // backgroundColor: 'blue',
    height: '100%',
    justifyContent: 'center',
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
