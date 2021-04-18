import {useNavigation} from '@react-navigation/core';
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
const Header = ({title}) => {
  const navigation = useNavigation();
  const renderHeader = () => {
    if (Platform.OS === 'android') {
      return (
        <TouchableNativeFeedback onPress={() => navigation.goBack()}>
          <ArrowLeftIcon width={20} height={12} fill="#000" />
        </TouchableNativeFeedback>
      );
    } else {
      return (
        <TouchableHighlight onPress={() => navigation.goBack()}>
          <ArrowLeftIcon width={20} height={12} fill="#000" />
        </TouchableHighlight>
      );
    }
  };
  return (
    <View style={styles.container}>
      {renderHeader()}
      <Text style={styles.text}>{title}</Text>
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
    fontWeight: 'bold',
  },
});
