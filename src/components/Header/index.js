import * as React from 'react';
import {
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

import ArrowLeftIcon from '../../../assets/icons/arrow-left.svg';
import { colors } from '../../utils/colors';
import { fonts } from '../../utils/fonts';

const Header = ({ title, onPress, titleStyle = {}, containerStyle = {} }) => {
  const renderHeader = () => {
    if (Platform.OS === 'android') {
      return (
        <TouchableOpacity onPress={onPress}>
          <View style={styles.content(-4)}>
            <ArrowLeftIcon width={20} height={12} fill="#000" />
          </View>
        </TouchableOpacity>
      );
    } else {
      return (
        <TouchableOpacity style={styles.buttonBackContainerIos} onPress={onPress}>
          <View style={styles.content(-4)}>
            <ArrowLeftIcon width={20} height={12} fill="#000" />
          </View>
        </TouchableOpacity>
      );
    }
  };

  const renderText = () => {
    if (Platform.OS === 'android') {
      return <Text numberOfLines={1} style={{ ...styles.text, ...titleStyle }}>{title}</Text>
    }

    return <Text numberOfLines={1} style={{ ...styles.textIos, ...titleStyle }}>{title}</Text>
  }
  return (
    <View style={{ ...styles.container, ...containerStyle }}>
      {renderHeader()}
      {renderText()}
      <View style={styles.gap} />
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
  content: (marginLeft) => ({
    padding: 10,
    // marginLeft: marginLeft,
  }),
  text: {
    color: colors.black,
    fontFamily: fonts.poppins[600],
    fontSize: 14,
    marginLeft: -20,
    fontWeight: 'bold',
  },
  textIos: {
    color: colors.black,
    fontFamily: fonts.poppins[600],
    fontSize: 14,
    marginLeft: -20,
    fontWeight: 'bold',
    flex: 1,
  },
  gap: { width: 20, height: 12 },
  buttonBackContainer: {
    width: '20%'
  },
  buttonBackContainerIos: {
    width: '20%'
  }
});
