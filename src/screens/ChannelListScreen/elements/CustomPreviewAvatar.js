import * as React from 'react';
import {Image, StyleSheet} from 'react-native';

import {
  ChannelAvatar,
  useChannelPreviewDisplayAvatar,
} from 'stream-chat-react-native';
import {Context} from '../../../context';
import {setProfileChannel} from '../../../context/actions/setChannel';
const CustomPreviewAvatar = ({channel}) => {
  const [, dispatch] = React.useContext(Context).channel;
  const dataChannel = useChannelPreviewDisplayAvatar(channel);
  React.useEffect(() => {
    setProfileChannel(dataChannel.images, dispatch);
  }, [dataChannel]);
  if (channel?.data?.image) {
    return (
      <Image
        style={styles.image}
        source={{uri: `data:image/jpg;base64,${channel?.data?.image}`}}
      />
    );
  }
  return <ChannelAvatar channel={channel} />;
};

export default CustomPreviewAvatar;

const styles = StyleSheet.create({
  image: {width: 40, height: 40, borderRadius: 20},
});
