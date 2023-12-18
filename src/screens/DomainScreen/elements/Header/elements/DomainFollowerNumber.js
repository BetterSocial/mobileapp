import * as React from 'react';
import {StyleSheet, Text, View} from 'react-native';

import {COLORS} from '../../../../../utils/theme';
import {Gap} from '../../../../../components';
import {fonts, normalize, normalizeFontSize} from '../../../../../utils/fonts';
import {getSingularOrPluralText} from '../../../../../utils/string/StringUtils';

const DomainFollowerNumber = ({followers}) => {
  return (
    <View style={styles.container}>
      <Text style={styles.followersNumber}>{followers}</Text>
      <Gap width={normalize(4)} />
      <Text style={styles.followersText}>
        {getSingularOrPluralText(followers, 'Follower', 'Followers')}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    marginTop: 6
  },
  followersNumber: {
    color: COLORS.blue,
    fontFamily: fonts.inter[700],
    fontSize: normalizeFontSize(14),
    lineHeight: normalizeFontSize(17)
  },
  followersText: {
    color: COLORS.black,
    fontFamily: fonts.inter[400],
    fontSize: normalizeFontSize(14),
    lineHeight: normalizeFontSize(17)
  }
});

export default DomainFollowerNumber;
