import * as React from 'react';
import {StyleSheet, TextInput} from 'react-native';

import {fonts} from '../../utils/fonts';
import {COLORS} from '../../utils/theme';

const TextArea = ({
  textAlignVertical = 'top',
  multiline = true,
  placeholder = '',
  onChangeText = () => {},
  value = '',
  style = {},
  onRef = (ref) => {}
}) => {
  const textRef = React.useRef();
  React.useEffect(() => {
    onRef(textRef);
  }, []);

  return (
    <TextInput
      ref={textRef}
      autoFocus={true}
      value={value}
      onChangeText={onChangeText}
      multiline={multiline}
      style={{...styles.input, ...style}}
      textAlignVertical={textAlignVertical}
      placeholder={placeholder}
    />
  );
};

const styles = StyleSheet.create({
  input: {
    backgroundColor: COLORS.lightgrey,
    paddingVertical: 16,
    paddingHorizontal: 12,
    height: 150,
    justifyContent: 'flex-start',
    overflow: 'scroll',
    borderRadius: 8,
    fontFamily: fonts.inter[500],
    fontSize: 14,
    color: COLORS.black,
    lineHeight: 24
  }
});
export default TextArea;
