import * as React from 'react';
import {StyleSheet, Text, TouchableNativeFeedback, View} from 'react-native';
import SimpleToast from 'react-native-simple-toast';
import GlobalButton from '../../../components/Button/GlobalButton';

import {colors} from '../../../utils/colors';
import {fonts} from '../../../utils/fonts';
import {getSingularOrPluralText} from '../../../utils/string/StringUtils';
/**
 *
 * @typedef {Function} OnFollowingContainerClicked
 * @param {number} userId
 * @param {String} username
 */
/**
 *
 * @typedef {Object} FollowInfoRowPropsParam
 * @property {String} follower
 * @property {String} following
 * @property {OnFollowingContainerClicked} onFollowingContainerClicked
 */
/**
 *
 * @param {FollowInfoRowPropsParam} param0
 * @returns
 */
const FollowInfoRow = ({follower, following, onFollowingContainerClicked}) => {
  const openFollower = () => {
    SimpleToast.show('For privacy reasons, you cannot see who follows you', SimpleToast.LONG);
  };
  return (
    <View style={styles.wrapFollower}>
      <GlobalButton onPress={openFollower} buttonStyle={{paddingHorizontal: 0}}>
        <View style={styles.wrapRow}>
          <Text style={styles.textTotal}>{follower}</Text>
          <Text style={styles.textFollow}>
            {getSingularOrPluralText(follower, 'Follower', 'Followers')}
          </Text>
        </View>
      </GlobalButton>
      <GlobalButton buttonStyle={{paddingHorizontal: 0}} onPress={onFollowingContainerClicked}>
        <View style={styles.following}>
          <View style={styles.wrapRow}>
            <Text style={styles.textTotal}>{following}</Text>
            <Text style={styles.textFollow}>Following</Text>
          </View>
        </View>
      </GlobalButton>
    </View>
  );
};

let styles = StyleSheet.create({
  following: {marginLeft: 18},
  textTotal: {
    // fontFamily: fonts.inter[800],
    // fontWeight: 'bold',
    fontSize: 14,
    color: colors.bondi_blue,
    paddingRight: 4
  },
  textFollow: {
    // fontFamily: fonts.inter[800],
    fontSize: 14,
    color: colors.black,
    paddingRight: 4
  },
  wrapFollower: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 12
  },
  wrapRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8
  }
});

export default React.memo(FollowInfoRow);
