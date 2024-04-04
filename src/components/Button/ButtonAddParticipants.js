import * as React from 'react';
import {useNavigation} from '@react-navigation/core';
import {StyleSheet, Text, TouchableWithoutFeedback, View} from 'react-native';
import {COLORS} from '../../utils/theme';
import {fonts} from '../../utils/fonts';

const ButtonAddParticipants = (props) => {
  const navigation = useNavigation();
  return (
    <View style={styles.btnAdd}>
      <TouchableWithoutFeedback
        testID="btnPress"
        onPress={() => navigation.navigate('AddParticipant', {refresh: props.refresh})}>
        <Text style={styles.btnAddText}>+ Add Participants</Text>
      </TouchableWithoutFeedback>
    </View>
  );
};

export default ButtonAddParticipants;

const styles = StyleSheet.create({
  btnAdd: {
    paddingHorizontal: 8,
    paddingVertical: 8,
    backgroundColor: COLORS.gray100,
    width: 'auto',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 8,
    alignSelf: 'center'
  },
  btnAddText: {
    fontFamily: fonts.inter[600],
    fontSize: 14,
    lineHeight: 20,
    color: COLORS.anon_primary
  }
});
