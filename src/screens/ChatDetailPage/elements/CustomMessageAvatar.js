import * as React from 'react';
import {MessageAvatar} from 'stream-chat-react-native-core';
import {View} from 'react-native';

import AnonymousIcon from '../../ChannelListScreen/elements/components/AnonymousIcon';
import {CHANNEL_TYPE_ANONYMOUS} from '../../../utils/constants';

/**
 *
 * @param {number} channelType
 * @param {import('stream-chat-react-native-core').MessageAvatarProps} props
 */
const CustomMessageAvatar = ({channelType, color, emoji, ...props}) => {
  if (channelType === CHANNEL_TYPE_ANONYMOUS)
    return (
      <View style={{marginRight: 8}}>
        <AnonymousIcon size={32} color={color} emojiCode={emoji} />
      </View>
    );

  return <MessageAvatar {...props} />;
};

export default CustomMessageAvatar;
