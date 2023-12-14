import * as React from 'react';
import {Text} from 'react-native';

import {fonts} from '../../../utils/fonts'
import {COLORS} from '../../../utils/theme';

/**
 * @typedef {Object} DiscoveryTitleSeparatorProp
 * @property {String} text
 */
/**
 *
 * @param {DiscoveryTitleSeparatorProp} prop
 */
const DiscoveryTitleSeparator = (prop) => {
  const {text} = prop;
  return (
    <Text
      style={{
        fontSize: 12,
        lineHeight: 18,
        fontFamily: fonts.poppins[600],
        color: COLORS.black,
        paddingLeft: 20,
        paddingRight: 20,
        paddingTop: 11,
        paddingBottom: 11,
        backgroundColor: COLORS.lightgrey
        // marginTop: 15,
      }}>
      {text}
    </Text>;
  );
};

export default DiscoveryTitleSeparator;
