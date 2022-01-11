import * as React from 'react';
import {
  ChannelAvatar,
  useChannelPreviewDisplayAvatar,
} from 'stream-chat-react-native';
import { Image, StyleSheet, View } from 'react-native';

import DefaultChatGroupProfilePicture from '../../../assets/images/default-chat-group-picture.png';
import { Context } from '../../../context';
import { getGroupMemberCount } from '../../../utils/string/StringUtils';
import { setProfileChannel } from '../../../context/actions/setChannel';

const CustomPreviewAvatar = ({ channel }) => {
  const [, dispatch] = React.useContext(Context).channel;
  const dataChannel = useChannelPreviewDisplayAvatar(channel);
  React.useEffect(() => {
    setProfileChannel(dataChannel.images, dispatch);
  }, [dataChannel]);

  if (channel.data.channel_type === 2 || channel.data.channel_type === 3) {
    return (
      <Image
        source={{ uri: channel.data.image }}
        style={styles.image}
      />
    );
  }

  if (channel?.data?.image) {
    if (channel?.data?.image.indexOf('res.cloudinary.com') > -1) {
      return (
        <Image source={{uri: channel?.data?.image}} style={styles.image} />
      );
    }

    return (
      <Image
        source={{ uri: `data:image/jpg;base64,${channel?.data?.image}` }}
        style={styles.image}
      />
    );
  } else if (getGroupMemberCount(channel) > 2) {
    return (
      <View style={styles.containerAvatar}>
        <Image
          source={DefaultChatGroupProfilePicture}
          style={styles.defaultGroupImage}
        />
      </View>
    );
  } else {
    return (
      <View style={styles.containerAvatar}>
        <ChannelAvatar channel={channel} />
      </View>
    );
  }
};

export default CustomPreviewAvatar;

const styles = StyleSheet.create({
  image: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginLeft: 8,
  },
  defaultGroupImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginLeft: 0,
  },
  containerAvatar: {
    paddingLeft: 8,
  },
});
