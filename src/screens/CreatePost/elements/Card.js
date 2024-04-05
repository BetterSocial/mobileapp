import React from 'react';
import {View, StyleSheet, Platform} from 'react-native';
import {COLORS} from '../../../utils/theme';

const Card = (props) => {
  return (
    // <View style={{ ...styles.card, ...props.style }}></View>
    <View // Parent
      style={{
        zIndex: 999,
        // width: widthInput,
        ...props.style
      }}>
      <View // Card
        style={{
          flex: 1,
          borderRadius: 10,
          // To round image corners
          overflow: 'hidden',
          borderColor: COLORS.gray310,
          borderWidth: 0.5,
          // https://github.com/facebook/react-native/issues/10049#issuecomment-366426897
          backgroundColor: COLORS.gray110,
          // Android shadow
          elevation: 4,
          paddingHorizontal: 15,
          paddingVertical: 10,
          width: '100%'
        }}>
        {props.children}
      </View>
    </View>
  );
};
const styles = StyleSheet.create({
  card: {
    shadowOffset: {width: 10, height: 10},
    shadowColor: 'black',
    shadowOpacity: 1,
    elevation: 3,
    // background color must be set
    backgroundColor: COLORS.black, // invisible color
    zIndex: 999
  }
});
export default Card;
