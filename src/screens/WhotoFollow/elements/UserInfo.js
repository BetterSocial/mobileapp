import * as React from 'react';
import PropTypes from 'prop-types';
import {Image, StyleSheet, Text, View} from 'react-native';
import {COLORS} from '../../../utils/theme';
import {normalize} from '../../../utils/fonts';

import {CircleGradient} from '../../../components/Karma/CircleGradient';

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
    width: 45,
    height: 45,
    borderRadius: 48,
    marginLeft: 3,
    marginTop: 3
  },
  containerTextCard: {
    flexDirection: 'column',
    alignItems: 'center',
    marginLeft: 8,
    flex: 1
  },
  textFullName: {
    fontFamily: 'Poppins',
    fontStyle: 'normal',
    fontWeight: 'bold',
    fontSize: 14,
    color: COLORS.black,
    lineHeight: 21,
    alignSelf: 'flex-start'
  },
  textUsername: {
    fontSize: 14,
    color: COLORS.black,
    lineHeight: 21,
    alignSelf: 'flex-start',
    width: '100%',
    marginRight: 16
  }
});

export default UserInfo;
