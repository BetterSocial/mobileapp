import PropTypes from 'prop-types';
import * as React from 'react';
import {Platform, StyleSheet, Text, View} from 'react-native';
import ArrowLeftIcon from '../../../assets/icons/arrow-left.svg';
import dimen from '../../utils/dimen';
import {fonts, normalizeFontSize} from '../../utils/fonts';
import {COLORS} from '../../utils/theme';
import GlobalButton from '../Button/GlobalButton';

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
        <View testID="ios" style={styles.content(-6)}>
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
      <Text style={[styles.text, styles.titleText, titleStyle]}>{title}</Text>
      <GlobalButton
        disabled={disabledNextBtn}
        buttonStyle={styles.noPaddingRight}
        onPress={onPressSub}>
        <Text
          style={[
            styles.text,
            {color: disabledNextBtn ? COLORS.gray310 : COLORS.anon_primary},
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
    alignItems: 'center'
  },
  content: (marginLeft) => ({
    padding: 10,
    marginLeft
  }),
  text: {
    color: COLORS.black,
    fontFamily: fonts.inter[500],
    fontSize: normalizeFontSize(14),
    padding: 10,
    textAlign: 'center'
  },
  titleText: {
    position: 'absolute',
    width: '100%',
    zIndex: -1
  },
  noPaddingLeft: {
    paddingLeft: 0
  },
  noPaddingRight: {
    paddingRight: 0
  }
});
