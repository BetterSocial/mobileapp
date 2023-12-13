/* eslint-disable no-use-before-define */
import React from 'react';
import {Pressable, StyleSheet, Text, View} from 'react-native';

import dimen from '../../../utils/dimen';
import {colors} from '../../../utils/colors';
import {fonts} from '../../../utils/fonts';
import {COLORS} from '../../../utils/theme';

interface Props {
  isFollowing: boolean;
  handleFollow?: () => void;
  isAnonymousTab?: boolean;
}

const ChannelFollowButton = (props: Props) => {
  const {isFollowing, handleFollow, isAnonymousTab = false} = props;

  return (
    <Pressable onPress={handleFollow}>
      <View style={styles.followContainer}>
        <View
          style={[
            styles.containerFollowBtn,
            isFollowing ? styles.followingBtn(isAnonymousTab) : styles.followBtn(isAnonymousTab)
          ]}>
          <Text
            style={[
              styles.textFollowBtn,
              isFollowing ? styles.textFollowing(isAnonymousTab) : styles.textFollow
            ]}>
            {isFollowing ? 'Following' : 'Follow'}
          </Text>
        </View>
      </View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  followContainer: {
    marginLeft: dimen.normalizeDimen(8),
    justifyContent: 'center'
  },
  containerFollowBtn: {
    justifyContent: 'center',
    alignItems: 'center'
  },
  followBtn: (isAnonymousTab) => ({
    paddingVertical: dimen.normalizeDimen(9.5),
    paddingHorizontal: dimen.normalizeDimen(14),
    borderRadius: 8,
    backgroundColor: isAnonymousTab ? COLORS.anon_primary : COLORS.signed_primary
  }),
  followingBtn: (isAnonymousTab) => ({
    paddingVertical: dimen.normalizeDimen(9.5),
    paddingHorizontal: dimen.normalizeDimen(4.5),
    borderWidth: 1,
    borderColor: isAnonymousTab ? COLORS.anon_primary : COLORS.signed_primary,
    borderRadius: 8
  }),
  textFollowBtn: {
    fontFamily: fonts.inter[600],
    fontWeight: 'bold',
    fontSize: 12
  },
  textFollow: {
    color: colors.white
  },
  textFollowing: (isAnonymousTab) => ({
    color: isAnonymousTab ? COLORS.anon_primary : COLORS.signed_primary
  })
});

export default ChannelFollowButton;
