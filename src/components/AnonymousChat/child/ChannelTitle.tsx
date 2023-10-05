import * as React from 'react';
import {StyleSheet, Text, View} from 'react-native';

import baseStyles from '../BaseChannelItemStyles';
import {BaseChannelItemTypeProps} from '../../../../types/component/AnonymousChat/BaseChannelItem.types';
import {colors} from '../../../utils/colors';
import {fonts} from '../../../utils/fonts';

const ChannelTitle = ({type, name, time, message, unreadCount, isMe}) => {
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
      color: colors.gray,
      alignSelf: 'flex-start'
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
      position: 'absolute',
      top: 22,
      right: 20,
      alignItems: 'flex-end',
      justifyContent: 'flex-start',
      alignSelf: 'flex-start'
    },
    postNotificationMessage: {
      fontFamily: fonts.inter[400],
      alignSelf: 'flex-start'
    },
    postNotificationMessageBold: {
      fontFamily: fonts.inter[700]
    },
    anonPmMessage: {
      marginBottom: 0
    }
  });

  if (type === BaseChannelItemTypeProps.ANON_PM)
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
        <View style={[baseStyles.chatContentSection, styles.anonPmMessage]}>
          {/* Message */}
          <Text numberOfLines={1} ellipsizeMode="tail" style={styles.chatContentMessage}>
            {`${isMe ? 'You: ' : ''}${message}`}
          </Text>
          {/* Unread Count */}
          {unreadCount > 0 && (
            <View style={styles.chatContentUnreadCountContainer}>
              <Text style={styles.chatContentUnreadCount}>{unreadCount}</Text>
            </View>
          )}
        </View>
      </>
    );

  const getTitle = () => {
    const isMyPost = type?.includes('MY_SIGNED_POST') || type?.includes('MY_ANON_POST');

    if (isMyPost) {
      if (message?.length === 0) return 'Your media post 📸 🖼';
      return 'Your post: ';
    }

    if (message?.length === 0) return `${name}'s media post 📸 🖼`;
    return `${name}'s post: `;
  };

  return (
    <>
      <View style={baseStyles.chatContentSection}>
        <View style={{display: 'flex', flexDirection: 'row'}}>
          <Text
            numberOfLines={2}
            ellipsizeMode="tail"
            style={[styles.chatContentName, styles.postNotificationMessage]}>
            <Text style={styles.postNotificationMessageBold}>{getTitle()}</Text>
            {message}
          </Text>
          <Text style={styles.chatContentTime}>{time}</Text>
        </View>
      </View>
      <View style={styles.chatContentUnreadCountPostNotificationContainer}>
        {unreadCount > 0 && (
          <View style={styles.chatContentUnreadCountContainer}>
            <Text style={styles.chatContentUnreadCount}>{unreadCount}</Text>
          </View>
        )}
      </View>
    </>
  );
};

export default ChannelTitle;
