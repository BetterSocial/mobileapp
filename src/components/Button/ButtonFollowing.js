import React from 'react';
import {View, TouchableNativeFeedback, Text, StyleSheet} from 'react-native';
import {fonts} from '../../utils/fonts';
import {COLORS} from '../../utils/theme';

const ButtonFollowing = ({handleSetUnFollow}) => (
  <TouchableNativeFeedback onPress={handleSetUnFollow}>
    <View style={styles.buttonFollowing}>
      <Text style={styles.textButtonFollowing}>Following</Text>
    </View>
  </TouchableNativeFeedback>
);

const styles = StyleSheet.create({
  buttonFollowing: {
    width: 72,
    height: 24,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.holyTosca,
    borderRadius: 8
  },
  textButtonFollowing: {
    fontFamily: fonts.inter[600],
    fontWeight: 'bold',
    fontSize: 12,
    color: COLORS.holyTosca
  }
});

export default ButtonFollowing;
