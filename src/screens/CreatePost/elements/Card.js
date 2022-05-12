import React from 'react';
import { View, StyleSheet, Platform } from 'react-native';
import { colors } from '../../../utils/colors';
const Card = props => {
  return (
    // <View style={{ ...styles.card, ...props.style }}></View>
    <View // Parent
      style={{
        // No backgroundColor
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.5,
        // shadowRadius: 10,
        zIndex: 999,
        // width: widthInput,
        ...props.style,
      }}
    >
      <View // Card
        style={{
          flex: 1,
          borderRadius: 10,
          // To round image corners
          overflow: 'hidden',
          borderColor: '#bdbdbd',
          borderWidth: 0.5,
          // https://github.com/facebook/react-native/issues/10049#issuecomment-366426897
          backgroundColor: colors.lightgrey,
          // Android shadow
          elevation: 4,
          paddingHorizontal: 15,
          paddingVertical: 10,
          width: '100%'
        }}
      >
        {props.children}
      </View>
    </View>
  );
};
const styles = StyleSheet.create({
  card: {
    shadowOffset: { width: 10, height: 10 },
    shadowColor: 'black',
    shadowOpacity: 1,
    elevation: 3,
    // background color must be set
    backgroundColor: "#0000", // invisible color
    zIndex: 999,
  }
});
export default Card;