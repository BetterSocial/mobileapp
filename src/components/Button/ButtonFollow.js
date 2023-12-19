import React from 'react'
import { View, StyleSheet, TouchableNativeFeedback, Text } from 'react-native'
import { colors } from '../../utils/colors'
import { fonts } from '../../utils/fonts'

const ButtonFollow = ({ handleSetFollow }) => (
    <TouchableNativeFeedback onPress={handleSetFollow}>
      <View style={styles.buttonFollow}>
        <Text style={styles.textButtonFollow}>Follow</Text>
      </View>
    </TouchableNativeFeedback>
  )

const styles = StyleSheet.create({
  buttonFollow: {
    width: 58,
    height: 24,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 8,
    backgroundColor: colors.bondi_blue,
  },
  textButtonFollow: {
    fontFamily: fonts.inter[600],
    fontWeight: 'bold',
    fontSize: 12,
    color: colors.white,
  },
})

export default ButtonFollow
