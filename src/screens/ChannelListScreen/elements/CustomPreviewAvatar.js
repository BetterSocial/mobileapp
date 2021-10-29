import * as React from 'react';
import {Image, StyleSheet, View} from 'react-native';

import {
  ChannelAvatar,
  useChannelPreviewDisplayAvatar,
} from 'stream-chat-react-native';
import {Context} from '../../../context';
import {setProfileChannel} from '../../../context/actions/setChannel';
import {getGroupMemberCount} from '../../../utils/string/StringUtils';
import DefaultChatGroupProfilePicture from '../../../assets/images/default-chat-group-picture.png';

const CustomPreviewAvatar = ({channel}) => {
  const [, dispatch] = React.useContext(Context).channel;
  const dataChannel = useChannelPreviewDisplayAvatar(channel);
  React.useEffect(() => {
    setProfileChannel(dataChannel.images, dispatch);
  }, [dataChannel]);

  if (channel?.data?.image) {
    return (
      <Image
        source={{uri: `data:image/jpg;base64,${channel?.data?.image}`}}
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
