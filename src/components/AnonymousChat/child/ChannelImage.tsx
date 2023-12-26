import * as React from 'react';
import FastImage from 'react-native-fast-image';
import {StyleSheet, View} from 'react-native';

import AnonymousProfile from '../../../assets/images/AnonymousProfile.png';
import ChannelAnonymousImage from './ChannelAnonymousImage';
import ChannelAnonymousSubImage from './ChannelAnonymousSubImage';
import ChatIcon from '../../../assets/chat-icon.png';
import FeedIcon from '../../../assets/images/feed-icon.png';
import dimen from '../../../utils/dimen';
import {BaseChannelItemTypeProps} from '../../../../types/component/AnonymousChat/BaseChannelItem.types';
import {COLORS} from '../../../utils/theme';
import useProfileHook from '../../../hooks/core/profile/useProfileHook';

const ChannelImage = ({
  mainPicture,
  postNotificationPicture,
  anonPostNotificationUserInfo = null,
  postMaker = null,
  isCommentExists = false,
  type = BaseChannelItemTypeProps.ANON_PM,
  isAnonymousTab = false
}) => {
  const styles = StyleSheet.create({
    image: {
      position: 'relative',
      width: dimen.normalizeDimen(48),
      height: dimen.normalizeDimen(48),
      marginTop: dimen.normalizeDimen(12),
      marginBottom: dimen.normalizeDimen(12),
      borderRadius: dimen.normalizeDimen(24)
    },
    postNotificationImage: {
      position: 'absolute',
      top: dimen.normalizeDimen(30 + 12),
      right: 0,
      width: dimen.normalizeDimen(24),
      height: dimen.normalizeDimen(24),
      borderRadius: dimen.normalizeDimen(12),
      borderWidth: 2,
      borderColor: COLORS.white,
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center'
    },
    myPostNotificationImageContainer: {
      backgroundColor: isAnonymousTab ? COLORS.anon_primary : COLORS.signed_primary
    },
    anonPmNotificationImageContainer: {
      backgroundColor: COLORS.anon_primary
    },
    postNotificationIcon: {
      width: dimen.normalizeDimen(12.5),
      height: dimen.normalizeDimen(12.5)
    },
    chatIcon: {
      width: dimen.normalizeDimen(12),
      height: dimen.normalizeDimen(12)
    },
    backgroundsigned_primary: {
      backgroundColor: COLORS.signed_primary
    }
  });

  const isAnonymousCommenter = Boolean(anonPostNotificationUserInfo?.anon_user_info_emoji_code);
  const isAnonymousPostMaker = Boolean(postMaker?.anon_user_info_emoji_code);
  const isAnonymousOldPostMaker = Boolean(postMaker?.emoji_code);
  const {anonProfileId} = useProfileHook();

  const renderChatMainImage = () => {
    const isAnonymousChannel = type === BaseChannelItemTypeProps.ANON_PM;
    const memberChat = postMaker?.members?.find((item: any) => item.user_id !== anonProfileId);
    const betterSocialMember = postMaker?.better_channel_member;

    if (
      isAnonymousChannel &&
      isAnonymousPostMaker &&
      betterSocialMember &&
      betterSocialMember?.[memberChat?.user_id]?.anon_user_info_emoji_code &&
      betterSocialMember?.[memberChat?.user_id]?.anon_user_info_color_code
    ) {
      return (
        <ChannelAnonymousImage
          anonPostNotificationUserInfo={{
            anon_user_info_emoji_code:
              betterSocialMember[memberChat?.user_id].anon_user_info_emoji_code,
            anon_user_info_color_code:
              betterSocialMember[memberChat?.user_id].anon_user_info_color_code
          }}
          imageStyle={styles.image}
        />
      );
    }

    if (!isAnonymousChannel && isAnonymousPostMaker) {
      return (
        <ChannelAnonymousImage
          anonPostNotificationUserInfo={{
            anon_user_info_emoji_code: postMaker?.anon_user_info_emoji_code,
            anon_user_info_color_code: postMaker?.anon_user_info_color_code
          }}
          imageStyle={styles.image}
        />
      );
    }
    if (!isAnonymousChannel && isAnonymousOldPostMaker)
      return (
        <ChannelAnonymousImage
          anonPostNotificationUserInfo={{
            anon_user_info_emoji_code: postMaker?.emoji_code,
            anon_user_info_color_code: postMaker?.color_code
          }}
          imageStyle={styles.image}
        />
      );

    return <FastImage source={{uri: mainPicture}} style={styles.image} />;
  };

  const renderMainImage = () => {
    if (isAnonymousPostMaker)
      return (
        <ChannelAnonymousImage anonPostNotificationUserInfo={postMaker} imageStyle={styles.image} />
      );

    if (isAnonymousOldPostMaker)
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

  const renderMyPostNotificationSubImage = () => {
    if (!isCommentExists)
      return (
        <View style={[styles.postNotificationImage, styles.myPostNotificationImageContainer]}>
          <FastImage source={FeedIcon} style={styles.postNotificationIcon} />
        </View>
      );

    if (isAnonymousCommenter)
      return (
        <ChannelAnonymousSubImage anonPostNotificationUserInfo={anonPostNotificationUserInfo} />
      );

    return (
      <FastImage source={{uri: postNotificationPicture}} style={styles.postNotificationImage} />
    );
  };

  // SIGNED OR ANON PM CHANNEL IMAGE
  if (type?.includes('PM')) {
    return (
      <View>
        {renderChatMainImage()}
        <View
          style={[
            styles.postNotificationImage,
            isAnonymousTab
              ? styles.anonPmNotificationImageContainer
              : styles.backgroundsigned_primary
          ]}>
          <FastImage source={ChatIcon} style={styles.chatIcon} />
        </View>
      </View>
    );
  }

  // POST NOTIFICATION IMAGE FOR ANONYMOUS TAB
  if (type === BaseChannelItemTypeProps.MY_ANON_POST_NOTIFICATION_I_COMMENTED_ANONYMOUSLY) {
    return (
      <View>
        <FastImage
          source={AnonymousProfile}
          style={[styles.image, styles.anonPmNotificationImageContainer]}
        />
        <FastImage
          source={AnonymousProfile}
          style={[styles.postNotificationImage, styles.anonPmNotificationImageContainer]}
        />
      </View>
    );
  }

  if (type === BaseChannelItemTypeProps.MY_ANON_POST_NOTIFICATION_COMMENTED_ANONYMOUSLY) {
    return (
      <View>
        <FastImage
          source={AnonymousProfile}
          style={[styles.image, styles.anonPmNotificationImageContainer]}
        />
        <ChannelAnonymousSubImage
          anonPostNotificationUserInfo={{
            anon_user_info_emoji_code: anonPostNotificationUserInfo?.anon_user_info_emoji_code,
            anon_user_info_color_code: anonPostNotificationUserInfo?.anon_user_info_color_code
          }}
        />
      </View>
    );
  }

  if (
    type === BaseChannelItemTypeProps.MY_ANON_POST_NOTIFICATION_I_COMMENTED ||
    type === BaseChannelItemTypeProps.MY_ANON_POST_NOTIFICATION_COMMENTED
  ) {
    return (
      <View>
        <FastImage
          source={AnonymousProfile}
          style={[styles.image, styles.anonPmNotificationImageContainer]}
        />
        {renderMyPostNotificationSubImage()}
      </View>
    );
  }

  if (type === BaseChannelItemTypeProps.MY_ANON_POST_NOTIFICATION) {
    return (
      <View>
        <FastImage
          source={AnonymousProfile}
          style={[styles.image, styles.anonPmNotificationImageContainer]}
        />
        <View style={[styles.postNotificationImage, styles.myPostNotificationImageContainer]}>
          <FastImage source={FeedIcon} style={styles.postNotificationIcon} />
        </View>
      </View>
    );
  }

  if (
    type === BaseChannelItemTypeProps.ANON_POST_NOTIFICATION_I_COMMENTED_ANONYMOUSLY ||
    type === BaseChannelItemTypeProps.SIGNED_POST_NOTIFICATION_I_COMMENTED_ANONYMOUSLY
  ) {
    return (
      <View>
        {renderMainImage()}
        <FastImage
          source={AnonymousProfile}
          style={[styles.postNotificationImage, styles.anonPmNotificationImageContainer]}
        />
      </View>
    );
  }

  // POST NOTIFICATION IMAGE FOR SIGNED TAB
  if (type === BaseChannelItemTypeProps.MY_SIGNED_POST_NOTIFICATION_I_COMMENTED_ANONYMOUSLY) {
    return (
      <View>
        <FastImage source={{uri: mainPicture}} style={styles.image} />
        <ChannelAnonymousSubImage
          anonPostNotificationUserInfo={{
            anon_user_info_emoji_code: anonPostNotificationUserInfo?.anon_user_info_emoji_code,
            anon_user_info_color_code: anonPostNotificationUserInfo?.anon_user_info_color_code
          }}
        />
      </View>
    );
  }

  if (
    type === BaseChannelItemTypeProps.MY_SIGNED_POST_NOTIFICATION_I_COMMENTED ||
    type === BaseChannelItemTypeProps.MY_SIGNED_POST_NOTIFICATION_COMMENTED_ANONYMOUSLY ||
    type === BaseChannelItemTypeProps.MY_SIGNED_POST_NOTIFICATION_COMMENTED ||
    type === BaseChannelItemTypeProps.SIGNED_POST_NOTIFICATION_I_COMMENTED ||
    type === BaseChannelItemTypeProps.SIGNED_POST_NOTIFICATION
  ) {
    return (
      <View>
        <FastImage source={{uri: mainPicture}} style={styles.image} />
        {renderMyPostNotificationSubImage()}
      </View>
    );
  }

  if (type === BaseChannelItemTypeProps.MY_SIGNED_POST_NOTIFICATION) {
    return (
      <View>
        <FastImage source={{uri: mainPicture}} style={styles.image} />
        <View style={[styles.postNotificationImage, styles.myPostNotificationImageContainer]}>
          <FastImage source={FeedIcon} style={styles.postNotificationIcon} />
        </View>
      </View>
    );
  }

  if (
    type === BaseChannelItemTypeProps.ANON_POST_NOTIFICATION ||
    type === BaseChannelItemTypeProps.ANON_POST_NOTIFICATION_I_COMMENTED
  ) {
    return (
      <View>
        {renderMainImage()}
        {renderMyPostNotificationSubImage()}
      </View>
    );
  }

  return <></>;
};

export default ChannelImage;
