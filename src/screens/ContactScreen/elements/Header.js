import * as React from 'react';
import {
  Platform,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import ArrowLeftIcon from '../../../../assets/icons/arrow-left.svg';
import GlobalButton from '../../../components/Button/GlobalButton';
import {COLORS, SIZES} from '../../../utils/theme';

const Header = ({
  title,
  subTitle,
  onPress,
  titleStyle = {},
  containerStyle = {},
  onPressSub,
  disabledNextBtn
}) => {
  const renderHeader = () => {
    if (Platform.OS === 'android') {
      return (
        <GlobalButton buttonStyle={styles.backContainer} onPress={onPress}>
          <View style={styles.content(-4)}>
            <ArrowLeftIcon width={20} height={12} fill="#000" />
          </View>
        </GlobalButton>
      );
    } 
      return (
        <GlobalButton buttonStyle={styles.backContainer}  onPress={onPress}>
          <View style={styles.content(-8)}>
            <ArrowLeftIcon width={20} height={12} fill="#000" />
          </View>
        </GlobalButton>
      );
    
  };
  return (
    <View style={{...styles.container, ...containerStyle}}>
      {renderHeader()}
      <View style={styles.containerTitle}>
        <Text style={{...styles.text, ...titleStyle}}>{title}</Text>
      </View>
      <GlobalButton disabled={disabledNextBtn} buttonStyle={styles.nextContainer} onPress={onPressSub}>
        <Text style={[styles.text, {color: disabledNextBtn ? COLORS.gray6: COLORS.holyTosca}]}>{subTitle}</Text>
      </GlobalButton>
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
    marginLeft,
  }),
  text: {
    fontFamily: 'Inter',
    fontStyle: 'normal',
    fontWeight: 'bold',
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
  backContainer: {
    paddingLeft: 0
  },
  nextContainer: {
    paddingLeft: 0
  }
});