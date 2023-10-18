import * as React from 'react';
import {StyleSheet, Text, View} from 'react-native';
import PropTypes from 'prop-types';
import ArrowLeftIcon from '../../../assets/icons/arrow-left.svg';
import {fonts, normalizeFontSize} from '../../utils/fonts';
import {COLORS, SIZES} from '../../utils/theme';
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
    return (
      <GlobalButton testID="onPressBtnHeader" buttonStyle={styles.noPaddingLeft} onPress={onPress}>
        <View style={styles.content}>
          <ArrowLeftIcon width={20} height={20} fill="#000" />
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
            {color: disabledNextBtn ? COLORS.gray6 : COLORS.holytosca},
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
  title: PropTypes.string,
  subTitle: PropTypes.string,
  onPress: PropTypes.func,
  titleStyle: PropTypes.object,
  subtitleStyle: PropTypes.object,
  containerStyle: PropTypes.object,
  onPressSub: PropTypes.func,
  disabledNextBtn: PropTypes.bool
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: SIZES.base,
    alignItems: 'center'
  },
  content: {
    padding: 10
  },
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
