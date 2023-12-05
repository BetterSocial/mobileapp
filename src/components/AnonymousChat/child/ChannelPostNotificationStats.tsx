import * as React from 'react';
import {Image, StyleSheet, Text, View} from 'react-native';

import IcBlockInactive from '../../../assets/block/Ic_block_inactive';
import IcComment from '../../../assets/icons/Ic_comment';
import IcDownvoteOn from '../../../assets/arrow/Ic_downvote_on';
import IcUpvoteOn from '../../../assets/arrow/Ic_upvote_on';
import Imageblock from '../../../assets/images/block.png';
import {BaseChannelItemTypeProps} from '../../../../types/component/AnonymousChat/BaseChannelItem.types';
import {colors} from '../../../utils/colors';

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
      marginStart: 5
    }
  });

  const isMyPost = type?.includes('MY_SIGNED_POST') || type?.includes('MY_ANON_POST');

  if (!isMyPost) return <View style={{height: 0}} />;

  return (
    <View style={styles.descriptionContainer}>
      <View style={styles.iconContainer}>
        <IcUpvoteOn color={colors.darkBlue} width={15} height={15} />
        <Text style={styles.textVoteMargin}>{upvote}</Text>
      </View>
      <View style={styles.iconContainer}>
        <IcDownvoteOn style={styles.iconMargin} width={15} height={15} />
        <Text style={styles.textVoteMargin}>{downvote}</Text>
      </View>
      <View style={styles.iconContainer}>
        <IcComment style={styles.iconMargin} width={15} height={15} />
        <Text style={styles.textVoteMargin}>{comments}</Text>
      </View>
      <View style={styles.iconContainer}>
        {Number(block) > 0 ? (
          <Image source={Imageblock} style={styles.iconMargin} width={15} height={15} />
        ) : (
          <IcBlockInactive style={styles.iconMargin} width={15} height={15} />
        )}
        <Text style={styles.textVoteMargin}>{String(block)}</Text>
      </View>
    </View>
  );
};

export default ChannelPostNotificationStats;
