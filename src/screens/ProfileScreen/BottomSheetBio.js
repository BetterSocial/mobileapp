import React, { useEffect, useImperativeHandle, useRef, useState } from 'react';
import {forwardRef} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  ActivityIndicator,
  KeyboardAvoidingView,
  TextInput,
} from 'react-native';
import {Button} from '../../components/Button';
import {colors} from '../../utils/colors';
import {fonts} from '../../utils/fonts';
import {BottomSheet} from '../../components/BottomSheet';
import {TextArea} from '../../components/TextArea';
import AutoFocusTextArea from '../../components/TextArea/AutoFocusTextArea';

let textRef

const BottomSheetBio = forwardRef((props, ref) => {
  return <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"}>
    <BottomSheet ref={ref} closeOnPressMask={true} 
      height={380} 
      pullBottom
      viewstyle={styles.bottomsheet}>
      <View style={styles.containerBottomSheet}>
        <Text style={styles.title}>Update your bio</Text>
        <AutoFocusTextArea 
          value={props.value} 
          onChangeText={props.onChangeText}
          placeholder="Add Bio"/>
        <Text style={styles.description}>{props.value? props.value.length : 0 }/350</Text>
        {props.error ? <Text style={styles.errorText}>{props.error}</Text> : null}
      </View>
      <Button
        style={styles.button}
        textStyling={styles.textStyling}
        onPress={() => (props.error ? null : props.handleSave())}>
        {props.isLoadingUpdateBio ? (
          <ActivityIndicator size="small" color="#0000ff" />
        ) : (
          'Save'
        )}
      </Button>
    </BottomSheet>
  </KeyboardAvoidingView>
});

const styles = StyleSheet.create({
  bottomsheet : {
    paddingBottom : 20
  },
  containerBottomSheet: {
    flexDirection: 'column'
  },
  title: {
    fontFamily: fonts.inter[400],
    fontWeight: 'bold',
    fontSize: 24,
    color: colors.black,
    marginBottom: 16,
  },
  description: {
    fontFamily: fonts.inter[400],
    fontSize: 12,
    color: colors.gray,
    marginTop: 7,
  },
  errorText: {
    fontFamily: fonts.inter[400],
    fontSize: 12,
    color: colors.red,
    marginTop: 7,
  },
  button: {
    marginTop: 33,
    backgroundColor: colors.bondi_blue,
  },
  textStyling: {
    fontFamily: fonts.inter[600],
    fontSize: 18,
    color: colors.white,
  },
  input: {
    backgroundColor: colors.lightgrey,
    paddingVertical: 16,
    paddingHorizontal: 12,
    height : 150,
    justifyContent: 'flex-start',
    overflow: 'scroll',
    borderRadius: 8,
    fontFamily: fonts.inter[500],
    fontSize: 14,
    color: colors.black,
    lineHeight: 24
  },
});
export default BottomSheetBio;
