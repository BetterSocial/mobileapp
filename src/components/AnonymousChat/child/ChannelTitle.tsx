import * as React from 'react';
import {StyleSheet, Text, View} from 'react-native';

import baseStyles from '../BaseChannelItemStyles';
import {BaseChannelItemType} from '../BaseChannelItem';
import {colors} from '../../../utils/colors';
import {fonts} from '../../../utils/fonts';

const ChannelTitle = ({type, name, time, message, unreadCount}) => {
  const styles = StyleSheet.create({
    chatContentName: {
      fontFamily: fonts.inter[700],
      fontSize: 14.05,
      lineHeight: 22,
      alignSelf: 'center',
      flex: 1
    },
    chatContentTime: {
      fontFamily: fonts.poppins[400],
      fontSize: 14,
      lineHeight: 22,
      marginLeft: 20,
      alignSelf: 'center'
    },
    chatContentMessage: {
      fontFamily: fonts.inter[400],
      fontSize: 14.05,
      lineHeight: 22,
      alignSelf: 'center',
      flex: 1,
      marginRight: 4
    },
    chatContentUnreadCountContainer: {
      backgroundColor: colors.bondi_blue,
      width: 20,
      height: 20,
      borderRadius: 10,
      textAlign: 'center',
      alignItems: 'center',
      justifyContent: 'center'
    },
    chatContentUnreadCount: {
      fontFamily: fonts.inter[400],
      fontSize: 12,
      lineHeight: 14.52,
      color: colors.white
    },
    chatContentUnreadCountPostNotificationContainer: {
      display: 'flex',
      alignItems: 'flex-end',
      justifyContent: 'flex-end'
    },
    postNotificationMessage: {
      fontFamily: fonts.inter[400],
      alignSelf: 'flex-start'
    },
    postNotificationMessageBold: {
      fontFamily: fonts.inter[700]
    }
  });

  if (type === BaseChannelItemType.ANON_PM)
    return (
      <>
        <View style={baseStyles.chatContentSection}>
          {/* Username */}
          <Text numberOfLines={1} ellipsizeMode="tail" style={styles.chatContentName}>
            {name}
          </Text>
          {/* Time */}
          <Text style={styles.chatContentTime}>{time}</Text>
        </View>
        <View style={baseStyles.chatContentSection}>
          {/* Message */}
          <Text numberOfLines={1} ellipsizeMode="tail" style={styles.chatContentMessage}>
            {message}
          </Text>
          {/* Unread Count */}
          <View style={styles.chatContentUnreadCountContainer}>
            <Text style={styles.chatContentUnreadCount}>{unreadCount}</Text>
          </View>
        </View>
      </>
    );

  const title =
    type === BaseChannelItemType.MY_ANON_POST_NOTIFICATION ? 'Your post: ' : `${name}'s post: `;

  return (
    <View style={baseStyles.chatContentSection}>
      <Text
        numberOfLines={2}
        ellipsizeMode="tail"
        style={[styles.chatContentName, styles.postNotificationMessage]}>
        <Text style={styles.postNotificationMessageBold}>{title}</Text>
        {message}
      </Text>
      <View style={styles.chatContentUnreadCountPostNotificationContainer}>
        <Text style={styles.chatContentTime}>{time}</Text>
        <View style={styles.chatContentUnreadCountContainer}>
          <Text style={styles.chatContentUnreadCount}>{unreadCount}</Text>
        </View>
      </View>
    </View>
  );
};

export default ChannelTitle;
