import * as React from 'react';
import FastImage from 'react-native-fast-image';
import {StyleSheet, View} from 'react-native';

import AnonymousProfile from '../../../assets/images/AnonymousProfile.png';
import ChannelAnonymousImage from './ChannelAnonymousImage';
import ChannelAnonymousSubImage from './ChannelAnonymousSubImage';
import ChatIcon from '../../../assets/chat-icon.png';
import FeedIcon from '../../../assets/images/feed-icon.png';
import {BaseChannelItemTypeProps} from '../../../../types/component/AnonymousChat/BaseChannelItem.types';
import {colors} from '../../../utils/colors';

const ChannelImage = ({
  mainPicture,
  postNotificationPicture,
  anonPostNotificationUserInfo = null,
  postMaker = null,
  isCommentExists = false,
  isOwnSignedPost = false,
  type = BaseChannelItemTypeProps.ANON_PM
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

  const isPostMakerAnonymous =
    postMaker?.anon_user_info_emoji_code !== null &&
    postMaker?.anon_user_info_emoji_code !== undefined;

  const isOldPostMakerAnonymous =
    postMaker?.emoji_code !== null && postMaker?.emoji_code !== undefined;

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

  const renderMainImage = () => {
    if (isPostMakerAnonymous)
      return (
        <ChannelAnonymousImage anonPostNotificationUserInfo={postMaker} imageStyle={styles.image} />
      );

    if (isOldPostMakerAnonymous)
      return (
        <ChannelAnonymousImage
          anonPostNotificationUserInfo={{
            anon_user_info_emoji_code: postMaker.emoji_code,
            anon_user_info_color_code: postMaker.color_code
          }}
          imageStyle={styles.image}
        />
      );

    return <FastImage source={{uri: mainPicture}} style={styles.image} />;
  };

  // ANON PM CHANNEL IMAGE
  if (type === BaseChannelItemTypeProps.ANON_PM)
    return (
      <View>
        <FastImage source={{uri: mainPicture}} style={styles.image} />
        <View style={[styles.postNotificationImage, styles.anonPmNotificationImageContainer]}>
          <FastImage source={ChatIcon} style={styles.postNotificationIcon} />
        </View>
      </View>
    );

  // ANON POST NOTIFICATION CHANNEL IMAGE
  if (type === BaseChannelItemTypeProps.ANON_POST_NOTIFICATION)
    return (
      <View>
        <FastImage source={{uri: mainPicture}} style={styles.image} />
        {renderMyPostNotificationSubImage()}
      </View>
    );

  // ANON POST NOTIFICATION I COMMENTED CHANNEL IMAGE
  if (type === BaseChannelItemTypeProps.ANON_POST_NOTIFICATION_I_COMMENTED)
    return (
      <View>
        {/* <FastImage source={{uri: mainPicture}} style={styles.image} /> */}
        {renderMainImage()}
        <FastImage source={AnonymousProfile} style={styles.postNotificationImage} />
      </View>
    );

  // MY POST NOTIFICATION I COMMENTED CHANNEL IMAGE
  if (type === BaseChannelItemTypeProps.MY_ANON_POST_NOTIFICATION_I_COMMENTED && isOwnSignedPost)
    return (
      <View>
        {/* Chat Image */}
        <FastImage source={{uri: mainPicture}} style={styles.image} />
        {/* Post Notification Image */}
        <FastImage source={AnonymousProfile} style={styles.postNotificationImage} />
      </View>
    );

  // MY POST NOTIFICATION I COMMENTED CHANNEL IMAGE
  if (type === BaseChannelItemTypeProps.MY_ANON_POST_NOTIFICATION_I_COMMENTED)
    return (
      <View>
        {/* Chat Image */}
        <FastImage source={AnonymousProfile} style={styles.image} />
        {/* Post Notification Image */}
        <FastImage source={AnonymousProfile} style={styles.postNotificationImage} />
      </View>
    );

  // MY POST NOTIFICATION CHANNEL IMAGE
  if (type === BaseChannelItemTypeProps.MY_ANON_POST_NOTIFICATION)
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
