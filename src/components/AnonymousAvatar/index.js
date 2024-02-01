import * as React from 'react';
import {Image, StyleSheet, Text, View} from 'react-native';

import AnonymousProfile from '../../assets/images/AnonymousProfile.png';
import dimen from '../../utils/dimen';
import {POST_VERSION} from '../../utils/constants';
import ProfilePicture from '../../screens/ProfileScreen/elements/ProfilePicture';

const styles = StyleSheet.create({
  imageAnonimity: {
    marginRight: 0,
    width: dimen.size.FEED_HEADER_IMAGE_RADIUS,
    height: dimen.size.FEED_HEADER_IMAGE_RADIUS
  }
});

/**
 * @typedef {Object} AnonymousAvatarComponentProps
 * @property {number} [radius=dimen.size.FEED_HEADER_IMAGE_RADIUS]
 * @property {number} [emojiRadius=dimen.size.FEED_HEADER_ANONYMOUS_IMAGE_RADIUS]
 * @property {string} version
 * @property {import('react-native').StyleProp} containerStyle
 * @property {AnonUserInfoTypes} anonUserInfo
 */

/**
 *
 * @param {AnonymousAvatarComponentProps} props
 */
const AnonymousAvatar = (props) => {
  const {
    version,
    anonUserInfo,
    containerStyle = {},
    radius = dimen.size.FEED_HEADER_IMAGE_RADIUS,
    emojiRadius = dimen.size.FEED_HEADER_ANONYMOUS_IMAGE_RADIUS,
    karmaScore,
    withKarma = false
  } = props;

  if (version >= POST_VERSION) {
    return (
      <ProfilePicture
        isAnon={true}
        anonBackgroundColor={anonUserInfo.colorCode}
        anonEmojiCode={anonUserInfo.emojiCode}
        karmaScore={karmaScore}
        size={radius}
        width={3}
        withKarma={withKarma}
      />
    );
  }

  return (
    <Image
      source={AnonymousProfile}
      width={radius}
      height={radius}
      style={{...styles.imageAnonimity, ...containerStyle}}
    />
  );
};

export default AnonymousAvatar;
