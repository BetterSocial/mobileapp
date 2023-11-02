/* eslint-disable no-use-before-define */
import FastImage from 'react-native-fast-image';
import React from 'react';
import {View} from 'react-native';

import CommunityIcon from '../../../assets/hashtag.png';
import GroupIcon from '../../../assets/group-icon.png';
import {
  ChannelImageBadgeProps,
  ChannelImageMainProps,
  ChannelImageProps
} from '../../../../types/component/ChatList/ChannelImage.types';
import {channelImageStyles as styles} from './ChannelImage.style';

const ChannelImage: ChannelImageProps = ({children}) => {
  return <View>{children}</View>;
};

const Big: React.FC<ChannelImageMainProps> = ({type, image}) => {
  if (image) {
    return (
      <FastImage
        source={{uri: image}}
        resizeMode={FastImage.resizeMode.contain}
        style={styles.containerImage}
      />
    );
  }

  if (type === 'COMMUNITY') {
    return (
      <View style={[styles.containerImage, styles.containerDefaultImage, styles.containerGreen]}>
        <FastImage
          source={CommunityIcon}
          resizeMode={FastImage.resizeMode.contain}
          style={styles.imageDefaultCommunity}
        />
      </View>
    );
  }

  if (type === 'GROUP') {
    return (
      <View style={[styles.containerImage, styles.containerDefaultImage, styles.containerDarkBlue]}>
        <FastImage
          source={GroupIcon}
          resizeMode={FastImage.resizeMode.contain}
          style={styles.imageDefaultGroup}
        />
      </View>
    );
  }

  return null;
};

const Small: React.FC<ChannelImageBadgeProps> = ({type}) => {
  if (type === 'COMMUNITY') {
    return (
      <View style={[styles.badgeContainer, styles.containerGreen]}>
        <FastImage
          source={CommunityIcon}
          resizeMode={FastImage.resizeMode.contain}
          style={[styles.badgeIcon, {top: -0.1, left: -0.06}]}
        />
      </View>
    );
  }

  if (type === 'GROUP') {
    return (
      <View style={[styles.badgeContainer, styles.containerDarkBlue]}>
        <FastImage
          source={GroupIcon}
          resizeMode={FastImage.resizeMode.contain}
          style={styles.badgeIcon}
        />
      </View>
    );
  }

  return null;
};

ChannelImage.Big = Big;
ChannelImage.Small = Small;
export default ChannelImage;
