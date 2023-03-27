import * as React from 'react';
import {Image, StyleSheet, Text, View} from 'react-native';

import AnonymousProfile from '../../assets/images/AnonymousProfile.png';
import dimen from '../../utils/dimen';
import {POST_VERSION} from '../../utils/constants';

const styles = StyleSheet.create({
  imageAnonimity: {
    marginRight: 0,
    width: dimen.size.FEED_HEADER_IMAGE_RADIUS,
    height: dimen.size.FEED_HEADER_IMAGE_RADIUS
  },
  avatarV2Background: (backgroundColor) => ({
    width: dimen.size.FEED_HEADER_IMAGE_RADIUS,
    height: dimen.size.FEED_HEADER_IMAGE_RADIUS,
    borderRadius: dimen.size.FEED_HEADER_IMAGE_RADIUS / 2,
    backgroundColor,
    justifyContent: 'center'
  }),
  avatarV2Emoji: {
    fontSize: dimen.size.FEED_HEADER_ANONYMOUS_IMAGE_RADIUS,
    alignSelf: 'center'
  }
});

/**
 * @typedef {Object} AnonymousAvatarComponentProps
 * @property {string} version
 * @property {AnonUserInfoTypes} anonUserInfo
 */

/**
 *
 * @param {AnonymousAvatarComponentProps} props
 */
const AnonymousAvatar = (props) => {
  const {version, anonUserInfo} = props;
  console.log(anonUserInfo);

  if (version >= POST_VERSION) {
    return (
      <View style={styles.avatarV2Background(anonUserInfo.colorCode)}>
        <Text style={styles.avatarV2Emoji}>{anonUserInfo.emojiCode}</Text>
      </View>
    );
  }

  return (
    <Image
      source={AnonymousProfile}
      width={dimen.size.FEED_HEADER_IMAGE_RADIUS}
      height={dimen.size.FEED_HEADER_IMAGE_RADIUS}
      style={styles.imageAnonimity}
    />
  );
};

export default AnonymousAvatar;
