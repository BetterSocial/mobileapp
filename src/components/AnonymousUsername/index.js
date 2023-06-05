import * as React from 'react';
import {StyleSheet, Text} from 'react-native';

import {POST_VERSION} from '../../utils/constants';
import {colors} from '../../utils/colors';
import {fonts} from '../../utils/fonts';

const styles = StyleSheet.create({
  feedUsername: {
    fontFamily: fonts.inter[600],
    fontWeight: 'bold',
    fontSize: 14,
    lineHeight: 16.94,
    color: colors.black,
    flex: 1
  }
});

/**
 * @typedef {Object} AnonymousUsernameComponentProps
 * @property {string} version
 * @property {AnonUserInfoTypes} anonUserInfo
 */

/**
 *
 * @param {AnonymousUsernameComponentProps} props
 */
const AnonymousUsername = (props) => {
  const {version, anonUserInfo} = props;

  if (version >= POST_VERSION) {
    return (
      <Text
        testID="newVersion"
        style={styles.feedUsername}>{`${anonUserInfo.colorName} ${anonUserInfo.emojiName}`}</Text>
    );
  }

  return <Text style={styles.feedUsername}>Anonymous</Text>;
};

export default AnonymousUsername;
