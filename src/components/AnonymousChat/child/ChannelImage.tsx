import * as React from 'react';
import FastImage from 'react-native-fast-image';
import {StyleSheet, View} from 'react-native';

import AnonymousProfile from '../../../assets/images/AnonymousProfile.png';
import ChatIcon from '../../../assets/chat-icon.png';
import FeedIcon from '../../../assets/images/feed-icon.png';
import {BaseChannelItemType} from '../BaseChannelItem';
import {colors} from '../../../utils/colors';

const ChannelImage = ({
  mainPicture,
  postNotificationPicture,
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
        <FastImage source={{uri: postNotificationPicture}} style={styles.postNotificationImage} />
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
        <View style={[styles.postNotificationImage, styles.myPostNotificationImageContainer]}>
          <FastImage source={FeedIcon} style={styles.postNotificationIcon} />
        </View>
      </View>
    );

  return <></>;
};

export default ChannelImage;
