import * as React from 'react';
import {Platform, StyleSheet, Text, View} from 'react-native';
import PropTypes from 'prop-types';
import ArrowLeftIcon from '../../../../assets/icons/arrow-left.svg';
import GlobalButton from '../../../components/Button/GlobalButton';
import {COLORS, SIZES} from '../../../utils/theme';
import dimen from '../../../utils/dimen';

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
            <ArrowLeftIcon
              width={dimen?.normalizeDimen(20)}
              height={dimen?.normalizeDimen(20)}
              fill="#000"
            />
          </View>
        </GlobalButton>
      );
    }
    return (
      <GlobalButton buttonStyle={styles.backContainer} onPress={onPress}>
        <View style={styles.content(-8)}>
          <ArrowLeftIcon
            width={dimen?.normalizeDimen(20)}
            height={dimen?.normalizeDimen(20)}
            fill="#000"
          />
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
      <GlobalButton
        disabled={disabledNextBtn}
        buttonStyle={styles.nextContainer}
        onPress={onPressSub}>
        <Text style={[styles.text, {color: disabledNextBtn ? COLORS.gray6 : COLORS.anon_primary}]}>
          {subTitle}
        </Text>
      </GlobalButton>
    </View>
  );
};

export default Header;

Header.propTypes = {
  onPressSub: PropTypes.func,
  title: PropTypes.string,
  subTitle: PropTypes.string,
  onPress: PropTypes.func,
  titleStyle: PropTypes.object,
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
    fontFamily: 'Inter',
    fontStyle: 'normal',
    fontWeight: 'bold',
    fontSize: 16,
    color: COLORS.black,
    lineHeight: 20,
    alignSelf: 'center'
  },
  gap: {width: 20, height: 12},
  containerTitle: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  backContainer: {
    paddingLeft: 0
  },
  nextContainer: {
    paddingLeft: 0
  }
});
