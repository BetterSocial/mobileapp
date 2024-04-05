import * as React from 'react';
import {StyleSheet, Text, View} from 'react-native';

import MemoIc_arrow_down_vote_on from '../../../assets/arrow/Ic_downvote_on';
import MemoIc_arrow_upvote_on from '../../../assets/arrow/Ic_upvote_on';
import MemoIc_block_active from '../../../assets/block/Ic_block_active';
import MemoIc_block_inactive from '../../../assets/block/Ic_block_inactive';
import MemoIc_comment from '../../../assets/icons/Ic_comment';
import {BaseChannelItemTypeProps} from '../../../../types/component/AnonymousChat/BaseChannelItem.types';
import {fonts, normalizeFontSize} from '../../../utils/fonts';
import {COLORS} from '../../../utils/theme';

const ChannelPostNotificationStats = ({
  type = BaseChannelItemTypeProps.ANON_PM,
  upvote = 0,
  downvote = 0,
  comments = 0,
  block = 0
}) => {
  const styles = StyleSheet.create({
    descriptionContainer: {
      display: 'flex',
      flex: 1,
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginRight: 45,
      marginTop: 7,
      minHeight: 24
    },
    avatarContainer: {},
    avatarNoHeight: {},
    iconContainer: {
      display: 'flex',
      flexDirection: 'row',
      alignItems: 'center',
      marginEnd: 15
    },
    iconMargin: {},
    textVoteMargin: {
      marginStart: 5,
      fontFamily: fonts.inter[400],
      fontSize: normalizeFontSize(14),
      color: COLORS.gray510
    }
  });

  const isMyPost = type?.includes('MY_SIGNED_POST') || type?.includes('MY_ANON_POST');

  if (!isMyPost) return <View style={{height: 0}} />;

  return (
    <View style={styles.descriptionContainer}>
      <View style={styles.iconContainer}>
        <MemoIc_arrow_upvote_on style={styles.iconMargin} width={16} height={16} />
        <Text style={styles.textVoteMargin}>{upvote}</Text>
      </View>
      <View style={styles.iconContainer}>
        <MemoIc_arrow_down_vote_on style={styles.iconMargin} width={16} height={16} />
        <Text style={styles.textVoteMargin}>{downvote}</Text>
      </View>
      <View style={styles.iconContainer}>
        <MemoIc_comment style={styles.iconMargin} width={16} height={16} />
        <Text style={styles.textVoteMargin}>{comments}</Text>
      </View>
      <View style={styles.iconContainer}>
        {Number(block) > 0 ? (
          <MemoIc_block_active style={styles.iconMargin} width={16} height={16} />
        ) : (
          <MemoIc_block_inactive style={styles.iconMargin} width={16} height={16} />
        )}
        <Text style={styles.textVoteMargin}>{String(block)}</Text>
      </View>
    </View>
  );
};

export default ChannelPostNotificationStats;
