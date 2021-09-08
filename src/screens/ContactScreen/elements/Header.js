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
      <View style={styles.containerTitle}>
        <Text style={{...styles.text, ...titleStyle}}>{title}</Text>
      </View>
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
    fontFamily: 'Inter',
    fontStyle: 'normal',
    fontWeight: '600',
    fontSize: 16,
    color: '#000000',
    lineHeight: 20,
    alignSelf: 'center',
  },
  gap: {width: 20, height: 12},
  containerTitle: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
