/* eslint-disable no-use-before-define */
import React from 'react';
import {Pressable, StyleSheet, Text, View} from 'react-native';

import dimen from '../../../utils/dimen';
import {colors} from '../../../utils/colors';
import {fonts} from '../../../utils/fonts';

interface Props {
  isFollowing: boolean;
  handleFollow?: () => void;
}

const ChannelFollowButton = (props: Props) => {
  const {isFollowing, handleFollow} = props;

  return (
    <Pressable onPress={handleFollow}>
      <View style={styles.followContainer}>
        <View
          style={[styles.containerFollowBtn, isFollowing ? styles.followingBtn : styles.followBtn]}>
          <Text
            style={[styles.textFollowBtn, isFollowing ? styles.textFollowing : styles.textFollow]}>
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
  followBtn: {
    paddingVertical: dimen.normalizeDimen(9.5),
    paddingHorizontal: dimen.normalizeDimen(14),
    borderRadius: 8,
    backgroundColor: colors.bondi_blue
  },
  followingBtn: {
    paddingVertical: dimen.normalizeDimen(9.5),
    paddingHorizontal: dimen.normalizeDimen(4.5),
    borderWidth: 1,
    borderColor: colors.bondi_blue,
    borderRadius: 8
  },
  textFollowBtn: {
    fontFamily: fonts.inter[600],
    fontWeight: 'bold',
    fontSize: 12
  },
  textFollow: {
    color: colors.white
  },
  textFollowing: {
    color: colors.bondi_blue
  }
});

export default ChannelFollowButton;
