import * as React from 'react';
import {Image, StyleSheet, Text, View} from 'react-native';

import AnonymousProfile from '../../assets/images/AnonymousProfile.png';
import dimen from '../../utils/dimen';
import {POST_VERSION} from '../../utils/constants';

export const styles = StyleSheet.create({
  imageAnonimity: {
    marginRight: 0,
    width: dimen.size.FEED_HEADER_IMAGE_RADIUS,
    height: dimen.size.FEED_HEADER_IMAGE_RADIUS
  },
  avatarV2Background: (backgroundColor, radius) => ({
    width: radius,
    height: radius,
    borderRadius: radius / 2,
    backgroundColor,
    justifyContent: 'center'
  }),
  avatarV2Emoji: (emojiRadius) => ({
    fontSize: emojiRadius,
    textAlign: 'center',
    alignSelf: 'center'
  })
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
    emojiRadius = dimen.size.FEED_HEADER_ANONYMOUS_IMAGE_RADIUS
  } = props;

  if (version >= POST_VERSION) {
    return (
      <View
        testID="newVersion"
        style={{...styles.avatarV2Background(anonUserInfo.colorCode, radius), ...containerStyle}}>
        <Text style={styles.avatarV2Emoji(emojiRadius)}>{anonUserInfo.emojiCode}</Text>
      </View>
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
