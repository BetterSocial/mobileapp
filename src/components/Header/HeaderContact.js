import * as React from 'react';
import {Platform, StyleSheet, Text, View} from 'react-native';
import PropTypes from 'prop-types';
import ArrowLeftIcon from '../../../assets/icons/arrow-left.svg';
import {fonts, normalizeFontSize} from '../../utils/fonts';
import {COLORS, SIZES} from '../../utils/theme';
import GlobalButton from '../Button/GlobalButton';
import dimen from '../../utils/dimen';

const HeaderContact = ({
  title,
  subTitle,
  onPress,
  titleStyle = {},
  subtitleStyle = {},
  containerStyle = {},
  onPressSub,
  disabledNextBtn
}) => {
  const renderHeader = () => {
    if (Platform.OS === 'android') {
      return (
        <GlobalButton testID="onPressAndroid" buttonStyle={styles.noPaddingLeft} onPress={onPress}>
          <View testID="android" style={styles.content(-4)}>
            <ArrowLeftIcon
              width={dimen.normalizeDimen(20)}
              height={dimen.normalizeDimen(20)}
              fill="#000"
            />
          </View>
        </GlobalButton>
      );
    }
    return (
      <GlobalButton testID="onPressIos" buttonStyle={styles.noPaddingLeft} onPress={onPress}>
        <View testID="ios" style={styles.content(-8)}>
          <ArrowLeftIcon
            width={dimen.normalizeDimen(20)}
            height={dimen.normalizeDimen(20)}
            fill="#000"
          />
        </View>
      </GlobalButton>
    );
  };
  return (
    <View style={[styles.container, containerStyle]}>
      {renderHeader()}
      <Text style={[styles.text, titleStyle]}>{title}</Text>
      <GlobalButton
        disabled={disabledNextBtn}
        buttonStyle={styles.noPaddingRight}
        onPress={onPressSub}>
        <Text
          style={[
            styles.text,
            {color: disabledNextBtn ? COLORS.gray6 : COLORS.holyTosca},
            subtitleStyle
          ]}>
          {subTitle}
        </Text>
      </GlobalButton>
    </View>
  );
};

export default HeaderContact;

HeaderContact.propTypes = {
  onPressSub: PropTypes.func,
  title: PropTypes.string,
  subTitle: PropTypes.string,
  onPress: PropTypes.func,
  titleStyle: PropTypes.object,
  subtitleStyle: PropTypes.object,
  containerStyle: PropTypes.object,

  disabledNextBtn: PropTypes.bool
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: SIZES.base,
    alignItems: 'center'
  },
  content: (marginLeft) => ({
    padding: 10,
    marginLeft
  }),
  text: {
    color: COLORS.black,
    fontFamily: fonts.inter[600],
    fontSize: normalizeFontSize(14),
    fontWeight: 'bold',
    padding: 10,
    textAlign: 'center'
  },
  noPaddingLeft: {
    paddingLeft: 0
  },
  noPaddingRight: {
    paddingRight: 0
  }
});
