import React from 'react';
import {
  Platform,
  StyleSheet,
  Text,
  TouchableHighlight,
  TouchableNativeFeedback,
  View,
} from 'react-native';
import ArrowLeftIcon from '../../../assets/icons/arrow-left.svg';
import {colors} from '../../utils/colors';
import {fonts} from '../../utils/fonts';
const Header = ({title, onPress, titleStyle = {}, containerStyle={}}) => {
  const renderHeader = () => {
    if (Platform.OS === 'android') {
      return (
        <TouchableNativeFeedback onPress={onPress}>
          <View style={{padding : 10, marginLeft : -4}}>
            <ArrowLeftIcon width={20} height={12} fill="#000"/>
          </View>
        </TouchableNativeFeedback>
      );
    } else {
      return (
        <TouchableHighlight onPress={onPress}>
          <View style={{padding : 10, marginLeft : -8}}>
            <ArrowLeftIcon width={20} height={12} fill="#000"/>
          </View>
        </TouchableHighlight>
      );
    }
  };
  return (
    <View style={{...styles.container, ...containerStyle}}>
      {renderHeader()}
      <Text style={{...styles.text, ...titleStyle}}>{title}</Text>
      <View style={{width: 20, height: 12}} />
    </View>
  );
};

export default Header;

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  text: {
    color: colors.black,
    fontFamily: fonts.poppins[600],
    fontSize: 14,
    marginLeft : -20,
    fontWeight: 'bold',
  },
});
