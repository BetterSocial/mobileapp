/* eslint-disable import/no-extraneous-dependencies */
import React from "react";
import { StyleSheet, TextInput } from "react-native";
import PropType from "prop-types";
import { colors } from "../../utils/colors";
import { fonts } from "../../utils/fonts";
import useTagging from "./useTagging";

const styles = StyleSheet.create({
  text: {
    flex: 1,
    fontSize: 12,
    fontFamily: fonts.inter[400],
    color: colors.black,
    lineHeight: 14.52,
    paddingTop: 5,
    paddingBottom: 5,
    maxHeight: 100,
  },
});

const TaggingInput = ({ value = "", onChangeText, style, props }) => {
  const [textWithFormatted, setTagging] = useTagging(value);
  return (
    <TextInput
      {...props}
      style={[styles.text, style]}
      onChangeText={(v) => {
        setTagging(v);
        onChangeText(v);
      }}
    >
      {textWithFormatted}
    </TextInput>
  );
};

TaggingInput.prototype = {
  value: PropType.string,
  onChange: PropType.func.isRequired,
  style: PropType.func,
};

export default TaggingInput;
