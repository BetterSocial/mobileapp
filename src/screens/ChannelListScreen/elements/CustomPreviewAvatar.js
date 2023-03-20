import * as React from 'react';
import {ChannelAvatar} from 'stream-chat-react-native';
import FastImage from 'react-native-fast-image';

import {StyleSheet, View} from 'react-native';
import DefaultChatGroupProfilePicture from '../../../assets/images/default-chat-group-picture.png';
import {getGroupMemberCount} from '../../../utils/string/StringUtils';
import ChatIcon from '../../../assets/chat-icon.png';
import GroupIcon from '../../../assets/group-icon.png';
import Hashtag from '../../../assets/hashtag.png';
import {colors} from '../../../utils/colors';

const CustomPreviewAvatar = ({channel}) => {
  console.log(channel, 'sisin');
  if (channel.data.channel_type === 3) {
    return (
      <View style={styles.containerAvatar}>
        <FastImage
          source={{uri: channel.data.image, priority: FastImage.priority.normal}}
          style={styles.image}
        />
        <View style={styles.typeContainer('#55C2FF')}>
          <FastImage
            resizeMode={FastImage.resizeMode.contain}
            style={styles.iconChatStyle}
            source={Hashtag}
          />
        </View>
      </View>
    );
  }

  if (channel.data.channel_type === 2) {
    return (
      <View style={styles.containerAvatar}>
        <FastImage
          source={{uri: channel.data.image, priority: FastImage.priority.normal}}
          style={styles.image}
        />
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
    height: 48
    // borderRadius: 24,
    // marginLeft: 8,
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
    backgroundColor: background || colors.bondi_blue,
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
  }
});
