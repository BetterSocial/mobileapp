import * as React from 'react';
import {StyleSheet, Text, View} from 'react-native';

import ChannelFollowButton from './ChannelFollowButton';
import baseStyles from '../BaseChannelItemStyles';
import dimen from '../../../utils/dimen';
import {BaseChannelItemTypeProps} from '../../../../types/component/AnonymousChat/BaseChannelItem.types';
import {colors} from '../../../utils/colors';
import {fonts, normalize} from '../../../utils/fonts';

const ChannelTitle = ({
  type,
  name,
  time,
  message,
  unreadCount,
  isMe,
  hasFollowButton = false,
  isFollowing,
  handleFollow
}) => {
  const styles = StyleSheet.create({
    chatContentName: {
      fontFamily: fonts.inter[700],
      fontSize: normalize(14),
      lineHeight: 22,
      flex: 1,
      paddingBottom: 2
    },
    chatContentTime: {
      fontFamily: fonts.poppins[400],
      fontSize: normalize(14),
      lineHeight: 22,
      marginLeft: 20,
      color: colors.gray,
      alignSelf: 'flex-start'
    },
    chatContentMessage: {
      fontFamily: fonts.inter[400],
      fontSize: normalize(14),
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
      fontSize: normalize(12),
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
    chatMessage: {
      flexDirection: 'row',
      paddingBottom: dimen.normalizeDimen(6)
    }
  });

  const isSignedDM = type === BaseChannelItemTypeProps.SIGNED_PM;

  if (type?.includes('PM')) {
    return (
      <View style={baseStyles.chatContentSection}>
        <View style={{flex: 1}}>
          <View style={{flexDirection: 'row'}}>
            <Text numberOfLines={1} ellipsizeMode="tail" style={styles.chatContentName}>
              {name}
            </Text>
            {!hasFollowButton && <Text style={styles.chatContentTime}>{time}</Text>}
          </View>

          <View style={styles.chatMessage}>
            <Text numberOfLines={1} ellipsizeMode="tail" style={styles.chatContentMessage}>
              {`${isMe ? 'You: ' : ''}${message}`}
            </Text>
            {!hasFollowButton && unreadCount > 0 && (
              <View style={styles.chatContentUnreadCountContainer}>
                <Text style={styles.chatContentUnreadCount}>{unreadCount}</Text>
              </View>
            )}
          </View>
        </View>

        {isSignedDM && hasFollowButton && (
          <ChannelFollowButton isFollowing={isFollowing} handleFollow={handleFollow} />
        )}
      </View>
    );
  }

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
