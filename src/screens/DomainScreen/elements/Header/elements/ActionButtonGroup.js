/* eslint-disable no-underscore-dangle */
import * as React from 'react';
import {StyleSheet, Text, View} from 'react-native';

import GlobalButton from '../../../../../components/Button/GlobalButton';
import {fonts, normalize, normalizeFontSize} from '../../../../../utils/fonts';
import {COLORS} from '../../../../../utils/theme';

const ActionButtonGroup = ({
  follow,
  handleFollow,
  handleUnfollow,
  isBlocked,
  onPressBlock,
  onPressUnblock
}) => {
  const __renderFollowButton = () => {
    if (follow)
      return (
        <GlobalButton
          buttonStyle={styles.globalButtonFollowContainer}
          onPress={() => handleUnfollow()}>
          <View style={styles.buttonFollowing}>
            <Text style={styles.textButtonFollowing}>Following</Text>
          </View>
        </GlobalButton>
      );

    return (
      <GlobalButton buttonStyle={styles.globalButtonFollowContainer} onPress={() => handleFollow()}>
        <View style={styles.buttonFollow}>
          <Text style={styles.textButtonFollow}>Follow</Text>
        </View>
      </GlobalButton>
    );
  };

  const __renderBlockButton = () => {
    if (!isBlocked)
      return (
        <GlobalButton
          buttonStyle={styles.globalButtonBlockContainer}
          onPress={() => onPressBlock()}>
          <View style={styles.buttonBlock}>
            <Text style={styles.blockButtonText}>Block</Text>
          </View>
        </GlobalButton>
      );

    return (
      <GlobalButton
        buttonStyle={styles.globalButtonBlockContainer}
        onPress={() => onPressUnblock()}>
        <View style={styles.buttonUnblock}>
          <Text style={styles.unblockButtonText}>Blocked</Text>
        </View>
      </GlobalButton>
    );
  };

  return (
    <View style={styles.container}>
      {__renderFollowButton()}
      {__renderBlockButton()}
    </View>
  );
};

const styles = StyleSheet.create({
  blockButtonText: {
    fontSize: normalizeFontSize(12),
    color: COLORS.redalert,
    paddingHorizontal: 0
  },
  buttonBlock: {
    flex: 1,
    height: normalize(36),
    // width: normalize(88),
    borderWidth: 0.5,
    borderRadius: 8,
    borderColor: COLORS.redalert,
    overflow: 'hidden',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'transparent'
  },
  buttonUnblock: {
    flex: 1,
    height: normalize(36),
    // width: normalize(88),
    borderWidth: 0.5,
    borderRadius: 8,
    borderColor: COLORS.redalert,
    overflow: 'hidden',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.redalert
  },
  buttonFollow: {
    flex: 1,
    // width: normalize(88),
    height: normalize(36),
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 8,
    backgroundColor: COLORS.anon_primary,
    color: COLORS.white
  },
  buttonFollowing: {
    flex: 1,
    // width: normalize(88),
    height: normalize(36),
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.anon_primary,
    borderRadius: 8
  },
  container: {
    display: 'flex',
    flexDirection: 'row',
    flex: 1
  },
  globalButtonBlockContainer: {
    paddingHorizontal: 0,
    flex: 1
  },
  globalButtonFollowContainer: {
    paddingHorizontal: 0,
    flex: 1,
    marginRight: 9
  },
  textButtonFollow: {
    fontFamily: fonts.inter[600],
    fontWeight: 'bold',
    fontSize: normalizeFontSize(12),
    lineHeight: normalizeFontSize(24),
    color: COLORS.white
  },
  textButtonFollowing: {
    fontFamily: fonts.inter[600],
    fontWeight: 'bold',
    fontSize: normalizeFontSize(12),
    lineHeight: normalizeFontSize(24),
    color: COLORS.anon_primary
  },
  unblockButtonText: {
    fontSize: normalizeFontSize(12),
    color: COLORS.white,
    paddingHorizontal: 0
  }
});

export default ActionButtonGroup;
