import * as React from 'react';
import {StyleSheet, Text, View} from 'react-native';
import PropTypes from 'prop-types';
import GlobalButton from '../../../components/Button/GlobalButton';

import {getSingularOrPluralText} from '../../../utils/string/StringUtils';
import {COLORS} from '../../../utils/theme';

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
 * @property {onFollowersContainerClicked} onFollowersContainerClicked
 */
/**
 *
 * @param {FollowInfoRowPropsParam} param0
 * @returns
 */
const FollowInfoRow = ({
  follower,
  following,
  onFollowingContainerClicked,
  onFollowersContainerClicked
}) => {
  const openFollower = () => {
    onFollowersContainerClicked();
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
    fontSize: 14,
    color: COLORS.blue,
    paddingRight: 4
  },
  textFollow: {
    fontSize: 14,
    color: COLORS.black,
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

FollowInfoRow.propTypes = {
  follower: PropTypes.string,
  following: PropTypes.string,
  onFollowingContainerClicked: PropTypes.func,
  onFollowersContainerClicked: PropTypes.func
};

export default React.memo(FollowInfoRow);
