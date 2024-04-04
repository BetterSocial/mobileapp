import * as React from 'react';
import {Image, StyleSheet, Text, View} from 'react-native';
import PropTypes from 'prop-types';
import {fonts, normalize, normalizeFontSize} from '../../../utils/fonts';
import {CircleGradient} from '../../../components/Karma/CircleGradient';
import {COLORS} from '../../../utils/theme';
import dimen from '../../../utils/dimen';

const UserInfo = ({photo, username, bio, karmaScore}) => (
  <View style={styles.cardLeft}>
    <CircleGradient fill={karmaScore} size={normalize(50)} width={normalize(3)}>
      <Image
        style={styles.tinyLogo}
        source={{
          uri: photo
        }}
        width={45}
        height={45}
      />
    </CircleGradient>
    <View style={styles.containerTextCard}>
      <Text style={styles.textFullName}>{username}</Text>
      <Text style={styles.textUsername} numberOfLines={1}>
        {bio || ''}
      </Text>
    </View>
  </View>
);

UserInfo.propTypes = {
  photo: PropTypes.string,
  username: PropTypes.string,
  bio: PropTypes.string,
  karmaScore: PropTypes.number
};

const styles = StyleSheet.create({
  cardLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1
  },
  tinyLogo: {
    width: dimen.normalizeDimen(45),
    height: dimen.normalizeDimen(45),
    borderRadius: dimen.normalizeDimen(48),
    marginLeft: dimen.normalizeDimen(3),
    marginTop: dimen.normalizeDimen(3)
  },
  containerTextCard: {
    flexDirection: 'column',
    alignItems: 'center',
    marginLeft: dimen.normalizeDimen(8),
    flex: 1
  },
  textFullName: {
    fontFamily: fonts.inter[700],
    fontSize: normalizeFontSize(14),
    color: COLORS.white,
    lineHeight: normalizeFontSize(21),
    alignSelf: 'flex-start'
  },
  textUsername: {
    fontSize: normalizeFontSize(14),
    color: COLORS.gray500,
    lineHeight: normalizeFontSize(21),
    alignSelf: 'flex-start',
    width: '100%',
    marginRight: dimen.normalizeDimen(16)
  }
});

export default UserInfo;
