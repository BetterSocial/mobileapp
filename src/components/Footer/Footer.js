import * as React from 'react';
import PropTypes from 'prop-types';
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';

import MemoIcCreatePoll from '../../assets/icons/ic_create_poll';
import MemoIc_arrow_down_vote_off from '../../assets/arrow/Ic_downvote_off';
import MemoIc_arrow_down_vote_on from '../../assets/arrow/Ic_downvote_on';
import MemoIc_arrow_upvote_off from '../../assets/arrow/Ic_upvote_off';
import MemoIc_arrow_upvote_on from '../../assets/arrow/Ic_upvote_on';
import MemoIc_block_inactive from '../../assets/block/Ic_block_inactive';
import MemoIc_comment from '../../assets/icons/Ic_comment';
import MemoIc_share from '../../assets/icons/Ic_share';
import MemoPollWinnerBadge from '../../assets/icon/IconPollWinnerBadge';
import { ENABLE_DEV_ONLY_FEATURE } from '../../utils/constants';
import {FONTS, SIZES} from '../../utils/theme';
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
  onPressScore,
  totalVote,
  disableComment = false,
  blockStatus,
  loadingVote,
  showScoreButton = false,
}) => {
  const handleBlockUi = () => {
    if (isSelf) {
      return null;
    } 
      if (blockStatus && blockStatus.blocker) {
        return null;
      } 
        return (
          <TouchableOpacity testID='onPressBlock' style={styles.btn} onPress={onPressBlock}>
            <View style={styles.btnBlock}>
              <MemoIc_block_inactive height={22} width={22} />
            </View>
          </TouchableOpacity>
        );
      
    
  };

  // const __renderShowScoreUI = () => {
  //   if(false && showScoreButton) {
  //     return <TouchableOpacity style={styles.btn} onPress={onPressScore}>
  //       <View style={styles.btnComment}>
  //         <MemoIcCreatePoll height={24} width={25}/>
  //       </View>
  //     </TouchableOpacity>
  //   } return <></>
  // }

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
        <TouchableOpacity style={{ flex: 1 }} onPress={onPressComment}>
          <View style={styles.totalCommentContainer}>
            <Text style={styles.text}>{totalComment}</Text>
          </View>
        </TouchableOpacity>
      )}
      {/* {__renderShowScoreUI()} */}
      <View style={styles.rightGroupContainer}>
        {handleBlockUi()}
        <TouchableOpacity
          testID='downVoteBtn'
          disabled={loadingVote}
          style={styles.btn}
          onPress={onPressDownVote}>
          <View style={styles.btnDownvote}>
            {statusVote === 'downvote' ? (
              <MemoIc_arrow_down_vote_on width={20} height={18} />
            ) : (
              <MemoIc_arrow_down_vote_off width={20} height={18} />
            )}
          </View>
        </TouchableOpacity>

        <Text style={styles.vote(totalVote)}>{totalVote}</Text>

        <TouchableOpacity
          disabled={loadingVote}
          style={styles.btn}
          onPress={onPressUpvote}>
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
    // height: '100%',
  },
  leftGroupContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    // marginLeft: 8,
  },
  rightGroupContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    // marginRight: 8,
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
    paddingLeft: 18,
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
    paddingLeft: 11,
    paddingRight: 22,
    // backgroundColor: 'brown',
  },
  totalCommentContainer: {
    flex: 1,
    // backgroundColor: 'blue',
    height: '100%',
    justifyContent: 'center',
  },
  buttonFollowing: {
    width: 88,
    height: 36,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.bondi_blue,
    borderRadius: 8,
  },
  textButtonFollowing: {
    fontFamily: fonts.inter[600],
    fontWeight: 'bold',
    fontSize: 12,
    color: colors.bondi_blue,
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
