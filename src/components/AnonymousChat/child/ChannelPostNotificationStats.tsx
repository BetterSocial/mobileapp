import * as React from 'react';
import {Image, StyleSheet, Text, View} from 'react-native';

import Imageblock from '../../../assets/images/block.png';
import MemoIc_arrow_down_vote_on from '../../../assets/arrow/Ic_downvote_on';
import MemoIc_arrow_upvote_on from '../../../assets/arrow/Ic_upvote_on';
import MemoIc_block_inactive from '../../../assets/block/Ic_block_inactive';
import MemoIc_comment from '../../../assets/icons/Ic_comment';
import {BaseChannelItemTypeProps} from '../../../../types/component/AnonymousChat/BaseChannelItem.types';

const ChannelPostNotificationStats = ({
  upvote = 0,
  downvote = 0,
  comments = 0,
  block = 0,
  type = BaseChannelItemTypeProps.MY_ANON_POST_NOTIFICATION,
  shown = false
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
      marginStart: 5
    }
  });

  if (type === BaseChannelItemTypeProps.ANON_PM) return <></>;

  if (!shown) return <View style={{height: 0}}></View>;

  return (
    <View style={styles.descriptionContainer}>
      <View style={styles.iconContainer}>
        <MemoIc_arrow_upvote_on style={styles.iconMargin} width={15} height={15} />
        <Text style={styles.textVoteMargin}>{upvote}</Text>
      </View>
      <View style={styles.iconContainer}>
        <MemoIc_arrow_down_vote_on style={styles.iconMargin} width={15} height={15} />
        <Text style={styles.textVoteMargin}>{downvote}</Text>
      </View>
      <View style={styles.iconContainer}>
        <MemoIc_comment style={styles.iconMargin} width={15} height={15} />
        <Text style={styles.textVoteMargin}>{comments}</Text>
      </View>
      <View style={styles.iconContainer}>
        {Number(block) > 0 ? (
          <Image source={Imageblock} style={styles.iconMargin} width={15} height={15} />
        ) : (
          <MemoIc_block_inactive style={styles.iconMargin} width={15} height={15} />
        )}
        <Text style={styles.textVoteMargin}>{String(block)}</Text>
      </View>
    </View>
  );
};

export default ChannelPostNotificationStats;
