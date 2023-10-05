import * as React from 'react';
import {StyleSheet, Text} from 'react-native';

import {BaseChannelItemTypeProps} from '../../../../types/component/AnonymousChat/BaseChannelItem.types';
import {colors} from '../../../utils/colors';
import {fonts} from '../../../utils/fonts';

const ChannelPostNotificationMessage = ({
  type = BaseChannelItemTypeProps.ANON_PM,
  commenterName,
  message
}) => {
  const styles = StyleSheet.create({
    chatContentPostNotificationMessage: {
      fontFamily: fonts.inter[400],
      fontSize: 12,
      lineHeight: 20,
      color: colors.gray,
      marginRight: 29
    },
    chatContentPostNotificationMessageBold: {
      fontFamily: fonts.inter[600],
      fontSize: 12,
      lineHeight: 20,
      color: colors.gray
    }
  });

  const isPM = type?.includes('PM');
  const amICommenter = type?.includes('I_COMMENTED');

  if (isPM) return <></>;

  if (!commenterName)
    return (
      <Text
        numberOfLines={2}
        ellipsizeMode="tail"
        style={styles.chatContentPostNotificationMessage}>
        <Text style={styles.chatContentPostNotificationMessageBold}>{'No comments yet'}</Text>
      </Text>
    );

  const commenter = amICommenter ? 'You' : commenterName;

  return (
    <Text numberOfLines={2} ellipsizeMode="tail" style={styles.chatContentPostNotificationMessage}>
      <Text
        style={styles.chatContentPostNotificationMessageBold}>{`${commenter} commented: `}</Text>
      {message}
    </Text>
  );
};

export default ChannelPostNotificationMessage;
