// eslint-disable-next-line no-use-before-define
import * as React from 'react';
import {StyleSheet, Text, View} from 'react-native';

import ChannelFollowButton from './ChannelFollowButton';
import baseStyles from '../BaseChannelItemStyles';
import {BaseChannelItemTypeProps} from '../../../../types/component/AnonymousChat/BaseChannelItem.types';
import {COLORS} from '../../../utils/theme';
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
  handleFollow,
  isAnonymousTab = false
}) => {
  const styles = StyleSheet.create({
    chatContentName: {
      fontFamily: fonts.inter[700],
      fontSize: normalize(14),
      lineHeight: 22,
      flex: 1,
      paddingBottom: 2,
      color: COLORS.white
    },
    chatContentTime: {
      fontFamily: fonts.poppins[400],
      fontSize: normalize(14),
      lineHeight: 22,
      marginLeft: 20,
      color: COLORS.gray510,
      alignSelf: 'flex-start'
    },
    chatContentMessage: {
      fontFamily: fonts.inter[400],
      fontSize: normalize(14),
      lineHeight: 22,
      alignSelf: 'center',
      flex: 1,
      marginRight: 4,
      color: COLORS.gray510
    },
    chatContentUnreadCountContainer: {
      backgroundColor: isAnonymousTab ? COLORS.anon_primary : COLORS.signed_primary,
      width: 20,
      height: 20,
      borderRadius: 10,
      textAlign: 'center',
      alignItems: 'center',
      justifyContent: 'center'
    },
    chatContentUnreadCount: {
      fontFamily: fonts.inter[400],
      fontSize: normalize(10),
      lineHeight: 14.52,
      color: COLORS.white
    },
    chatContentUnreadCountPostNotificationContainer: {
      position: 'absolute',
      top: 24,
      alignSelf: 'flex-end'
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
      marginBottom: 0
    }
  });

  const isSignedDM = type === BaseChannelItemTypeProps.SIGNED_PM;

  if (type?.includes('PM')) {
    const isShowFollowButton = unreadCount <= 0 && hasFollowButton;

    return (
      <View style={baseStyles.chatContentSection}>
        <View style={{flex: 1}}>
          <View style={{flexDirection: 'row'}}>
            <Text numberOfLines={1} ellipsizeMode="tail" style={styles.chatContentName}>
              {name}
            </Text>
            {!isShowFollowButton && <Text style={styles.chatContentTime}>{time}</Text>}
          </View>

          <View style={styles.chatMessage}>
            <Text numberOfLines={1} ellipsizeMode="tail" style={styles.chatContentMessage}>
              {`${isMe ? 'You: ' : ''}${message}`}
            </Text>
            {!isShowFollowButton && unreadCount > 0 && (
              <View style={styles.chatContentUnreadCountContainer}>
                <Text style={styles.chatContentUnreadCount}>{unreadCount}</Text>
              </View>
            )}
          </View>
        </View>

        {isSignedDM && isShowFollowButton && (
          <ChannelFollowButton isFollowing={isFollowing} handleFollow={handleFollow} />
        )}
      </View>
    );
  }

  const getTitle = () => {
    if (isMe) {
      if (message?.length === 0) return 'Your media post 📸 🖼';
      return 'Your post: ';
    }

    if (message?.length === 0) return `${name}'s media post 📸 🖼`;
    return `${name}'s post: `;
  };

  return (
    <View style={baseStyles.chatContentSection}>
      <View style={{display: 'flex', flexDirection: 'row'}}>
        <Text
          numberOfLines={2}
          ellipsizeMode="tail"
          style={[styles.chatContentName, styles.postNotificationMessage]}>
          <Text style={styles.postNotificationMessageBold}>{getTitle()}</Text>
          {message}
        </Text>
        <View style={{position: 'relative'}}>
          <Text style={styles.chatContentTime}>{time}</Text>
          {unreadCount > 0 && (
            <View style={styles.chatContentUnreadCountPostNotificationContainer}>
              <View style={styles.chatContentUnreadCountContainer}>
                <Text style={styles.chatContentUnreadCount}>{unreadCount}</Text>
              </View>
            </View>
          )}
        </View>
      </View>
    </View>
  );
};

export default ChannelTitle;
