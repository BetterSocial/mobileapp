import * as React from 'react';
import {
  Platform,
  StyleSheet,
  Text,
  TouchableHighlight,
  TouchableNativeFeedback,
  View,
} from 'react-native';

import ArrowLeftIcon from '../../../../assets/icons/arrow-left.svg';
import {fonts} from '../../../utils/fonts';
import {COLORS, SIZES} from '../../../utils/theme';
const Header = ({
  title,
  subTitle,
  onPress,
  titleStyle = {},
  subtitleStyle = {},
  containerStyle = {},
  onPressSub,
}) => {
  const renderHeader = () => {
    if (Platform.OS === 'android') {
      return (
        <TouchableNativeFeedback onPress={onPress}>
          <View style={styles.content(-4)}>
            <ArrowLeftIcon width={20} height={12} fill="#000" />
          </View>
        </TouchableNativeFeedback>
      );
    } else {
      return (
        <TouchableHighlight onPress={onPress}>
          <View style={styles.content(-8)}>
            <ArrowLeftIcon width={20} height={12} fill="#000" />
          </View>
        </TouchableHighlight>
      );
    }
  };
  return (
    <View style={{...styles.container, ...containerStyle}}>
      {renderHeader()}
      <Text style={{...styles.text, ...titleStyle}}>{title}</Text>
      <View style={styles.gap} />
      <TouchableNativeFeedback onPress={onPressSub}>
        <Text style={{...styles.text, ...subtitleStyle}}>{subTitle}</Text>
      </TouchableNativeFeedback>
    </View>
  );
};

export default Header;

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: SIZES.base,
    alignItems: 'center',
  },
  content: (marginLeft) => ({
    padding: 10,
    marginLeft: marginLeft,
  }),
  text: {
    color: COLORS.black,
    fontFamily: fonts.inter[600],
    fontSize: 14,
    marginLeft: -20,
    fontWeight: 'bold',
  },
  gap: {width: 20, height: 12},
});
