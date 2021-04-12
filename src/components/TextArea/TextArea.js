import React from 'react';
import {TextInput, StyleSheet} from 'react-native';
import {colors} from '../../utils/colors'
import {fonts} from '../../utils/fonts';

const TextArea = (props) => {
  let textAlignVerticalVal = props.textAlignVertical
    ? props.textAlignVertical
    : 'top';
  let multiLine = props.multiline ? props.multiline : true;
  let placeHolder = props.placeholder ?props.placeholder : ""
  return (
    <TextInput
      value={props.value}
      onChangeText={props.onChangeText}
      multiline={multiLine}
      style={{...styles.input, ...props.style}}
      textAlignVertical={textAlignVerticalVal}
      placeholder={placeHolder}
    />
  );
};

const styles = StyleSheet.create({
  input: {
    backgroundColor: colors.lightgrey,
    paddingVertical: 16,
    paddingHorizontal: 12,
    height: 261,
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
