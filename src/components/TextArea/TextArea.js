import React, { forwardRef, useEffect, useRef, useState } from 'react';
import {TextInput, StyleSheet, KeyboardAvoidingView, View} from 'react-native';
import {colors} from '../../utils/colors'
import {fonts} from '../../utils/fonts';

const TextArea = ({
  textAlignVertical = 'top',
  multiline = true,
  placeholder = "",
  onChangeText = () => {},
  value = "",
  style={},
  onRef = (ref) => {}
}) => {

  let textRef = useRef()
  useEffect(() => {
    onRef(textRef)
  },[])

  return <TextInput
        ref={textRef}
        autoFocus={true}
        value={value}
        onChangeText={onChangeText}
        multiline={multiline}
        style={{...styles.input, ...style}}
        textAlignVertical={textAlignVertical}
        placeholder={placeholder}
      />
}

const styles = StyleSheet.create({
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
export default TextArea;
