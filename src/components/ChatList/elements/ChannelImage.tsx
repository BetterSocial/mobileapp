/* eslint-disable no-use-before-define */
import React from 'react';
import {View} from 'react-native';
import FastImage from 'react-native-fast-image';

import {
  ChannelImageBadgeProps,
  ChannelImageMainProps
} from '../../../../types/component/ChatList/ChannelImage.types';
import GroupIcon from '../../../assets/group-icon.png';
import CommunityIcon from '../../../assets/hashtag.png';
import {channelImageStyles as styles} from './ChannelImage.style';

const ChannelImage = ({children}) => {
  return <View>{children}</View>;
};

const Big: React.FC<ChannelImageMainProps> = ({type, image, style}) => {
  if (image) {
    return (
      <FastImage
        source={{uri: image}}
        resizeMode={FastImage.resizeMode.cover}
        style={style ?? styles.containerImage}
      />
    );
  }

  if (type === 'ANON_TOPIC') {
    return (
      <View
        style={[styles.containerImage, styles.containerDefaultImage, styles.containeranon_primary]}>
        <FastImage
          source={CommunityIcon}
          resizeMode={FastImage.resizeMode.contain}
          style={styles.imageDefaultCommunity}
        />
      </View>
    );
  }

  if (type === 'TOPIC') {
    return (
      <View
        style={[
          styles.containerImage,
          styles.containerDefaultImage,
          styles.containersigned_primary
        ]}>
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
      <View
        style={[
          styles.containerImage,
          styles.containerDefaultImage,
          styles.containersigned_primary
        ]}>
        <FastImage
          source={GroupIcon}
          resizeMode={FastImage.resizeMode.contain}
          style={styles.imageDefaultGroup}
        />
      </View>
    );
  }

  if (type === 'GROUP_INFO') {
    return (
      <View
        style={[
          styles.containerImageGroupINfo,
          styles.containerDefaultImage,
          styles.containersigned_primary
        ]}>
        <FastImage
          source={GroupIcon}
          resizeMode={FastImage.resizeMode.contain}
          style={styles.imageDefaultGroupInfo}
        />
      </View>
    );
  }

  return (
    <View
      style={[styles.containerImage, styles.containerDefaultImage, styles.containersigned_primary]}>
      <FastImage
        source={CommunityIcon}
        resizeMode={FastImage.resizeMode.contain}
        style={styles.imageDefaultCommunity}
      />
    </View>
  );
};

const Small: React.FC<ChannelImageBadgeProps> = ({type}) => {
  if (type === 'ANON_TOPIC') {
    return (
      <View style={[styles.badgeContainer, styles.containeranon_secondary]}>
        <FastImage
          source={CommunityIcon}
          resizeMode={FastImage.resizeMode.contain}
          style={[styles.badgeIcon, {top: -0.1, left: -0.06}]}
        />
      </View>
    );
  }

  if (type === 'COMMUNITY') {
    return (
      <View style={[styles.badgeContainer, styles.containersigned_secondary]}>
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
      <View style={[styles.badgeContainer, styles.containersigned_secondary]}>
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
