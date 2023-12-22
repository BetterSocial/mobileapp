import * as React from 'react';
import FastImage from 'react-native-fast-image';
import {ChannelAvatar} from 'stream-chat-react-native';
import {StyleSheet, View} from 'react-native';

import AnonymousIcon from './components/AnonymousIcon';
import ChatIcon from '../../../assets/chat-icon.png';
import DefaultChatGroupProfilePicture from '../../../assets/images/default-chat-group-picture.png';
import GroupIcon from '../../../assets/group-icon.png';
import Hashtag from '../../../assets/hashtag.png';
import {CHANNEL_TYPE_ANONYMOUS} from '../../../utils/constants';
import {getGroupMemberCount} from '../../../utils/string/StringUtils';
import {COLORS} from '../../../utils/theme';

const CustomPreviewAvatar = ({channel}) => {
  const channel_type = channel?.data?.channel_type;
  if (channel_type === CHANNEL_TYPE_ANONYMOUS) {
    return (
      <View style={{marginLeft: 8}}>
        <AnonymousIcon
          size={48}
          color={channel?.data?.anon_user_info_color_code}
          emojiCode={channel?.data?.anon_user_info_emoji_code}
        />
        <View style={styles.typeContainer()}>
          {channel.data.type === 'group' && (
            <FastImage
              resizeMode={FastImage.resizeMode.contain}
              source={GroupIcon}
              style={styles.iconChatStyle}
            />
          )}
          {channel.data.type === 'messaging' && (
            <FastImage
              resizeMode={FastImage.resizeMode.contain}
              source={ChatIcon}
              style={styles.iconChatStyle}
            />
          )}
        </View>
      </View>
    );
  }

  if (channel_type === 3) {
    return (
      <View style={styles.containerAvatar}>
        <FastImage
          source={{uri: channel.data.image, priority: FastImage.priority.normal}}
          style={styles.image}
        />
        <View style={styles.typeContainer(COLORS.blueSea)}>
          <FastImage
            resizeMode={FastImage.resizeMode.contain}
            style={styles.iconChatStyle}
            source={Hashtag}
          />
        </View>
      </View>
    );
  }
  if (channel_type === 2) {
    return (
      <View style={styles.containerAvatar}>
        {channel?.data?.image ? (
          <FastImage
            source={{uri: channel.data.image, priority: FastImage.priority.normal}}
            style={styles.image}
          />
        ) : (
          <FastImage source={DefaultChatGroupProfilePicture} style={styles.image} />
        )}

        <View style={styles.typeContainer()}>
          <FastImage
            resizeMode={FastImage.resizeMode.contain}
            source={GroupIcon}
            style={styles.iconChatStyle}
          />
        </View>
      </View>
    );
  }

  if (channel?.data?.image) {
    if (channel?.data?.image.indexOf('res.cloudinary.com') > -1) {
      return (
        <View style={styles.containerAvatar}>
          <FastImage
            source={{uri: channel?.data?.image, priority: FastImage.priority.normal}}
            style={styles.defaultGroupImage}
          />
          <View style={styles.typeContainer()}>
            {channel.data.type === 'group' && (
              <FastImage
                resizeMode={FastImage.resizeMode.contain}
                source={GroupIcon}
                style={styles.iconChatStyle}
              />
            )}
            {channel.data.type === 'messaging' && (
              <FastImage
                resizeMode={FastImage.resizeMode.contain}
                source={ChatIcon}
                style={styles.iconChatStyle}
              />
            )}
          </View>
        </View>
      );
    }

    return (
      <View style={styles.containerAvatar}>
        <FastImage
          source={{
            uri: `data:image/jpg;base64,${channel?.data?.image}`,
            priority: FastImage.priority.normal
          }}
          style={styles.image}
        />
        <View style={styles.typeContainer()}>{/* <Text>Man</Text> */}</View>
      </View>
    );
  }
  if (getGroupMemberCount(channel) > 2) {
    return (
      <View style={styles.containerAvatar}>
        <FastImage source={DefaultChatGroupProfilePicture} style={styles.defaultGroupImage} />
        <View style={styles.typeContainer()}>
          <FastImage
            resizeMode={FastImage.resizeMode.contain}
            source={GroupIcon}
            style={styles.iconChatStyle}
          />
        </View>
      </View>
    );
  }
  return (
    <View style={styles.containerAvatar}>
      <ChannelAvatar channel={channel} />
      <View style={styles.typeContainer()}>
        <FastImage
          resizeMode={FastImage.resizeMode.contain}
          source={ChatIcon}
          style={styles.iconChatStyle}
        />
      </View>
    </View>
  );
};

export default React.memo(
  CustomPreviewAvatar,
  (prevProps, nexProps) => prevProps.channel === nexProps.channel
);

const styles = StyleSheet.create({
  image: {
    width: 48,
    height: 48,
    borderRadius: 24
  },
  defaultGroupImage: {
    width: 48,
    height: 48,
    borderRadius: 24,
    marginLeft: 0
  },
  containerAvatar: {
    paddingLeft: 8
  },
  typeContainer: (background) => ({
    height: 24,
    width: 24,
    backgroundColor: background || COLORS.bondi_blue,
    borderRadius: 12,
    position: 'absolute',
    bottom: -6,
    right: 0,
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
    borderWidth: 1,
    borderColor: 'white'
  }),
  iconChatStyle: {
    height: 12,
    width: 12
  },
  whiteText: {
    color: 'white',
    textAlign: 'center',
    fontSize: 12,
    padding: 0,
    margin: 0
  },
  postNotificationImage: {
    width: 48,
    height: 48,
    borderRadius: 24,
    right: 0,
    borderWidth: 2,
    borderColor: COLORS.white,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center'
  },
  anonPostNotificationEmoji: {
    fontSize: 32,
    alignSelf: 'center',
    textAlign: 'center'
  }
});
