import * as React from 'react';
import {StyleSheet, Text} from 'react-native';

import {COLORS} from '../../utils/theme';
import {POST_VERSION} from '../../utils/constants';
import {fonts} from '../../utils/fonts';
import {getOfficialAnonUsername} from '../../utils/string/StringUtils';

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
 */

/**
 *
 * @param {AnonymousUsernameComponentProps} props
 */
const AnonymousUsername = (props) => {
  const {version, anonUserInfo} = props;

  if (version >= POST_VERSION) {
    const mappedAnonUserInfo = {
      anon_user_info_emoji_name: anonUserInfo.emojiName,
      anon_user_info_color_name: anonUserInfo.colorName,
      anon_user_info_color_code: anonUserInfo.colorCode,
      anon_user_info_emoji_code: anonUserInfo.emojiCode
    };
    return (
      <Text testID="newVersion" style={styles.feedUsername}>
        {getOfficialAnonUsername(mappedAnonUserInfo)}
      </Text>
    );
  }

  return <Text style={styles.feedUsername}>Anonymous</Text>;
};

export default AnonymousUsername;
