import * as React from 'react';
import {
  ChannelAvatar,
  useChannelPreviewDisplayAvatar,
} from 'stream-chat-react-native';
import { Image, StyleSheet, View, Text } from 'react-native';
import FastImage from 'react-native-fast-image'
import DefaultChatGroupProfilePicture from '../../../assets/images/default-chat-group-picture.png';
import { Context } from '../../../context';
import { getGroupMemberCount } from '../../../utils/string/StringUtils';
import { setProfileChannel } from '../../../context/actions/setChannel';
import ChatIcon from '../../../assets/chat-icon.png'
import GroupIcon from '../../../assets/group-icon.png'
import { colors } from '../../../utils/colors';

const CustomPreviewAvatar = ({ channel }) => {
  const [, dispatch] = React.useContext(Context).channel;
  const dataChannel = useChannelPreviewDisplayAvatar(channel);
  React.useEffect(() => {
    setProfileChannel(dataChannel.images, dispatch);
  }, [dataChannel]);
  if (channel.data.channel_type === 2 || channel.data.channel_type === 3) {
    return (
      <View style={styles.containerAvatar} >
      <Image
        source={{ uri: channel.data.image }}
        style={styles.image}
      />
      <View style={styles.typeContainer('#55C2FF')} >
          <Text style={styles.whiteText} >#</Text>
        </View>
      </View>
    );
  }

  if (channel?.data?.image) {
    if (channel?.data?.image.indexOf('res.cloudinary.com') > -1) {
      return (
        <View style={styles.containerAvatar} >
        <Image source={{uri: channel?.data?.image}} style={styles.image} />
        <View style={styles.typeContainer()} >
          {/* <Text>Min</Text> */}
        </View>
        </View>
      );
    }

    return (
      <View style={styles.containerAvatar} >
      <Image
        source={{ uri: `data:image/jpg;base64,${channel?.data?.image}` }}
        style={styles.image}
      />
      <View style={styles.typeContainer()} >
          {/* <Text>Man</Text> */}
        </View>
      </View>
    );
  } if (getGroupMemberCount(channel) > 2) {
    return (
      <View style={styles.containerAvatar}>
        <Image
          source={DefaultChatGroupProfilePicture}
          style={styles.defaultGroupImage}
        />
        <View style={styles.typeContainer()} >
          <FastImage source={GroupIcon} style={styles.iconChatStyle} />
        </View>
      </View>
    );
  } 
    return (
      <View style={styles.containerAvatar}>
        <ChannelAvatar channel={channel} />
        <View style={styles.typeContainer()} >
          <FastImage source={ChatIcon} style={styles.iconChatStyle} />
        </View>
      </View>
    );
  
};

export default CustomPreviewAvatar;

const styles = StyleSheet.create({
  image: {
    width: 40,
    height: 40,
    borderRadius: 20,
    // marginLeft: 8,
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
    typeContainer: (background) => ({
    height: 20,
    width: 20,
    backgroundColor: background || colors.bondi_blue,
    borderRadius: 10,
    position: 'absolute',
    bottom: -6,
    right: 0,
    alignItems: 'center',
    justifyContent: 'center'
  }),
  iconChatStyle: {
    height: 13.5,
    width: 13.5
  },
  whiteText: {
    color: 'white'
  }
});
