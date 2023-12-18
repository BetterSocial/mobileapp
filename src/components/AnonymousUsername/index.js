import * as React from 'react';
import {StyleSheet, Text, TextStyle} from 'react-native';

import {POST_VERSION} from '../../utils/constants';
import {fonts} from '../../utils/fonts';
import {COLORS} from '../../utils/theme';

const styles = StyleSheet.create({
  feedUsername: {
    fontFamily: fonts.inter[600],
    fontWeight: 'bold',
    fontSize: 14,
    lineHeight: 16.94,
    color: COLORS.black,
    flex: 1
  }
});

/**
 * @typedef {Object} AnonymousUsernameComponentProps
 * @property {string} version
 * @property {AnonUserInfoTypes} anonUserInfo
 * @property {TextStyle} style
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
        style={[styles.feedUsername, props.style]}>{`Anonymous ${anonUserInfo.emojiName}`}</Text>
    );
  }

  return <Text style={[styles.feedUsername, props.style]}>Anonymous</Text>;
};

export default AnonymousUsername;
