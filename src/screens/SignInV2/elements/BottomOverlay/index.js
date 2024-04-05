import * as React from 'react';
import {Platform, Pressable, StyleSheet, Text, View, Image} from 'react-native';
import {TouchableOpacity} from 'react-native-gesture-handler';

import PropTypes from 'prop-types';
import BottomOverlayPagination from './pagination';
import MemoizedIcArrowRightTail from '../../../../assets/arrow/ic_arrow_right_tail';
import StringConstant from '../../../../utils/string/StringConstant';
import dimen from '../../../../utils/dimen';
import {COLORS} from '../../../../utils/theme';
import {fonts, normalize, normalizeFontSize} from '../../../../utils/fonts';
import {openUrl} from '../../../../utils/Utils';
import {imageConst} from '../../../../components/Image';

const HUMAN_ID_URL = 'https://www.human-internet.org';

const BottomOverlay = ({count, handleLogin, index, isLogin, title, onNextSlide, text}) => {
  const goToHumanIdWeb = () => {
    openUrl(HUMAN_ID_URL, true);
  };

  if (isLogin)
    return (
      <View style={bottomOverlayStyles.loginContainer}>
        <View
          style={{
            ...bottomOverlayStyles.loginBox,
            height: dimen.size.ONBOARDING_BOTTOM_OVERLAY_CONTAINER
          }}>
          <View style={bottomOverlayStyles.containerBtnLogin}>
            <TouchableOpacity onPress={() => handleLogin()} style={bottomOverlayStyles.btnSign}>
              <Image
                style={{height: 48.5, width: '100%'}}
                imageStyle={{borderRadius: 8}}
                // eslint-disable-next-line global-require
                source={require('../../../../assets/images/button-sign.png')}
                resizeMode={imageConst.resizeMode.cover}
              />
            </TouchableOpacity>
            <Text
              style={
                bottomOverlayStyles.descTitle
              }>{`What is ${StringConstant.signInScreenHumanIdBrand}?`}</Text>
            <Text style={bottomOverlayStyles.desc}>
              {'Created by the '}
              <Text onPress={goToHumanIdWeb} style={bottomOverlayStyles.link}>
                {StringConstant.signInScreenHumanIdFoundation}
              </Text>
              {',\n'}
              {'humanID verifies your humanity'}
              <Text>{' without storing\n'}</Text>
              {'your data or'}
              <Text>{' sharing'}</Text>
              {' it with Helio'}
            </Text>
          </View>
        </View>
      </View>
    );

  return (
    <View style={bottomOverlayStyles.container}>
      <Text style={bottomOverlayStyles.title}>{title}</Text>
      <Text style={bottomOverlayStyles.contentText}>{text}</Text>
      <View style={bottomOverlayStyles.bottomBlock}>
        <View style={bottomOverlayStyles.pagination}>
          <BottomOverlayPagination count={count} active={index} />
        </View>
        <Pressable onPress={onNextSlide}>
          <View style={bottomOverlayStyles.paddingContainer}>
            <View style={bottomOverlayStyles.nextButton}>
              <MemoizedIcArrowRightTail
                width={26.6}
                height={26.6}
                style={bottomOverlayStyles.nextButtonIcon}
              />
            </View>
          </View>
        </Pressable>
      </View>
    </View>
  );
};

export default BottomOverlay;

BottomOverlay.propTypes = {
  count: PropTypes.number,
  handleLogin: PropTypes.func,
  index: PropTypes.number,
  isLogin: PropTypes.bool,
  title: PropTypes.string,
  onNextSlide: PropTypes.func,
  text: PropTypes.string
};

const bottomOverlayStyles = StyleSheet.create({
  bottomBlock: {
    position: 'absolute',
    bottom: 0,
    right: 32,
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.transparent,
    zIndex: 1000,
    width: '100%'
    // backgroundColor: 'rgba(255,0,0,0.5)'
  },
  btnSign: {
    width: '101%',
    alignSelf: 'center',
    marginBottom: 12,
    marginTop: -1,
    zIndex: 99
  },
  container: {
    backgroundColor: COLORS.white,
    height: dimen.size.ONBOARDING_BOTTOM_OVERLAY_CONTAINER,
    paddingStart: 32,
    paddingEnd: 32,
    display: 'flex',
    flexDirection: 'column',
    zIndex: 10
  },
  containerBtnLogin: {
    backgroundColor: COLORS.gray100,
    borderWidth: 1,
    borderRadius: 8,
    borderColor: COLORS.gray200,
    paddingBottom: 16
  },
  descTitle: {
    fontWeight: '600',
    fontFamily: fonts.inter[600],
    lineHeight: 24,
    fontSize: 16,
    textAlign: 'center',
    color: COLORS.white2,
    alignSelf: 'center'
  },
  desc: {
    fontWeight: '400',
    fontFamily: fonts.inter[400],
    lineHeight: Platform.OS === 'ios' ? 20 : 22,
    fontSize: 14,
    textAlign: 'center',
    color: COLORS.gray500,
    alignSelf: 'center'
  },
  link: {
    color: COLORS.signed_primary,
    textDecorationLine: 'underline'
  },
  loginContainer: {
    backgroundColor: COLORS.almostBlack
  },
  loginBox: {
    width: '100%',
    backgroundColor: COLORS.almostBlack,
    height: dimen.size.ONBOARDING_BOTTOM_OVERLAY_CONTAINER,
    display: 'flex',
    flexDirection: 'column',
    alignContent: 'center',
    zIndex: 10,
    padding: 16,
    paddingTop: 30,
    alignSelf: 'center',
    borderRadius: 16
  },
  nextButton: {
    backgroundColor: COLORS.signed_primary,
    width: dimen.size.ONBOARDING_BOTTOM_OVERLAY_NEXT_BUTTON_SIZE,
    height: dimen.size.ONBOARDING_BOTTOM_OVERLAY_NEXT_BUTTON_SIZE,
    borderRadius: dimen.size.ONBOARDING_BOTTOM_OVERLAY_NEXT_BUTTON_SIZE,
    alignContent: 'center',
    justifyContent: 'center'
  },
  nextButtonIcon: {
    alignSelf: 'center'
  },
  title: {
    marginTop: normalize(35),
    marginBottom: normalize(20),
    lineHeight: normalize(28),
    fontSize: normalizeFontSize(22),
    fontFamily: fonts.inter[600],
    color: COLORS.white2,
    alignSelf: 'flex-start'
  },
  contentText: {
    lineHeight: normalize(20),
    fontSize: normalizeFontSize(14),
    fontFamily: fonts.inter[400],
    color: COLORS.gray500
  },
  paddingContainer: {
    paddingTop: dimen.normalizeDimen(27),
    paddingLeft: dimen.normalizeDimen(16.76),
    paddingBottom: dimen.normalizeDimen(23),
    paddingRight: dimen.normalizeDimen(8.24),
    zIndex: 1000
  },
  pagination: {
    flex: 1,
    justifyContent: 'center',
    marginTop: 4.5
  }
});
