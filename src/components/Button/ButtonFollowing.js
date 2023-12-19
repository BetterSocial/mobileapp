import React from 'react';
import { View, TouchableNativeFeedback, Text, StyleSheet } from 'react-native';
import { colors } from '../../utils/colors'
import { fonts } from '../../utils/fonts'

const ButtonFollowing = ({ handleSetUnFollow }) => (
    <TouchableNativeFeedback onPress={handleSetUnFollow}>
      <View style={styles.buttonFollowing}>
        <Text style={styles.textButtonFollowing}>Following</Text>
      </View>
    </TouchableNativeFeedback>
  )

const styles = StyleSheet.create({
  buttonFollowing: {
    width: 72,
    height: 24,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.bondi_blue,
    borderRadius: 8,
  },
  textButtonFollowing: {
    fontFamily: fonts.inter[600],
    fontWeight: 'bold',
    fontSize: 12,
    color: colors.bondi_blue,
  },
})

export default ButtonFollowing
