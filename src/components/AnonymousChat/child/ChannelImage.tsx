import * as React from 'react';
import FastImage from 'react-native-fast-image';
import {StyleSheet, Text, View} from 'react-native';

import AnonymousProfile from '../../../assets/images/AnonymousProfile.png';
import ChannelAnonymousSubImage from './ChannelAnonymousSubImage';
import ChatIcon from '../../../assets/chat-icon.png';
import FeedIcon from '../../../assets/images/feed-icon.png';
import {BaseChannelItemType} from '../BaseChannelItem';
import {colors} from '../../../utils/colors';

const ChannelImage = ({
  mainPicture,
  postNotificationPicture,
  anonPostNotificationUserInfo = null,
  isCommentExists = false,
  type = BaseChannelItemType.ANON_PM
}) => {
  const styles = StyleSheet.create({
    image: {
      width: 48,
      height: 48,
      borderRadius: 24
    },
    postNotificationImage: {
      width: 24,
      height: 24,
      borderRadius: 16,
      position: 'absolute',
      top: 30,
      right: 0,
      borderWidth: 2,
      borderColor: colors.white,
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center'
    },
    myPostNotificationImageContainer: {
      backgroundColor: colors.lightblue
    },
    anonPmNotificationImageContainer: {
      backgroundColor: colors.bondi_blue
    },
    postNotificationIcon: {
      width: 12.5,
      height: 12.5
    }
  });

  const isAnonymous =
    anonPostNotificationUserInfo?.anon_user_info_emoji_code !== null &&
    anonPostNotificationUserInfo?.anon_user_info_emoji_code !== undefined;

  const renderMyPostNotificationSubImage = () => {
    if (!isCommentExists)
      return (
        <View style={[styles.postNotificationImage, styles.myPostNotificationImageContainer]}>
          <FastImage source={FeedIcon} style={styles.postNotificationIcon} />
        </View>
      );

    if (isAnonymous)
      return (
        <ChannelAnonymousSubImage anonPostNotificationUserInfo={anonPostNotificationUserInfo} />
      );

    return (
      <FastImage source={{uri: postNotificationPicture}} style={styles.postNotificationImage} />
    );
  };

  // ANON PM CHANNEL IMAGE
  if (type === BaseChannelItemType.ANON_PM)
    return (
      <View>
        <FastImage source={{uri: mainPicture}} style={styles.image} />
        <View style={[styles.postNotificationImage, styles.anonPmNotificationImageContainer]}>
          <FastImage source={ChatIcon} style={styles.postNotificationIcon} />
        </View>
      </View>
    );

  // ANON POST NOTIFICATION CHANNEL IMAGE
  if (type === BaseChannelItemType.ANON_POST_NOTIFICATION)
    return (
      <View>
        <FastImage source={{uri: mainPicture}} style={styles.image} />
        {isAnonymous ? (
          <ChannelAnonymousSubImage anonPostNotificationUserInfo={anonPostNotificationUserInfo} />
        ) : (
          <FastImage source={{uri: postNotificationPicture}} style={styles.postNotificationImage} />
        )}
      </View>
    );

  // ANON POST NOTIFICATION I COMMENTED CHANNEL IMAGE
  if (type === BaseChannelItemType.ANON_POST_NOTIFICATION_I_COMMENTED)
    return (
      <View>
        <FastImage source={{uri: mainPicture}} style={styles.image} />
        <FastImage source={AnonymousProfile} style={styles.postNotificationImage} />
      </View>
    );

  // MY POST NOTIFICATION CHANNEL IMAGE
  if (type === BaseChannelItemType.MY_ANON_POST_NOTIFICATION)
    return (
      <View>
        {/* Chat Image */}
        <FastImage source={AnonymousProfile} style={styles.image} />
        {/* Post Notification Image */}
        {renderMyPostNotificationSubImage()}
      </View>
    );

  return <></>;
};

export default ChannelImage;
