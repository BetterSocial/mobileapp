import * as React from 'react';
import {Pressable, StyleSheet, Text, TouchableNativeFeedback, View} from 'react-native';
import {TouchableOpacity, TouchableWithoutFeedback} from 'react-native-gesture-handler';
import {useNavigation} from '@react-navigation/native';

import BottomOverlayPagination from './pagination';
import ButtonSign from '../../../../assets/icon-svg/button_sign.svg';
import MemoizedIcArrowRightTail from '../../../../assets/arrow/ic_arrow_right_tail';
import StringConstant from '../../../../utils/string/StringConstant';
import dimen from '../../../../utils/dimen';
import {COLORS} from '../../../../utils/theme';
import {colors} from '../../../../utils/colors';
import {fonts, normalize, normalizeFontSize} from '../../../../utils/fonts';
import {openUrl} from '../../../../utils/Utils';

const HUMAN_ID_URL = 'https://www.human-internet.org';
const TERMS_URL = 'https://www.bettersocial.org/terms';
const PRIVACY_URL = 'https://www.bettersocial.org/privacy';

const BottomOverlay = ({count, handleLogin, index, isLogin, title, onNextSlide, textSvg}) => {
  const goToHumanIdWeb = () => {
    openUrl(HUMAN_ID_URL, true);
  };

  const goToTermsWeb = () => {
    openUrl(TERMS_URL, true);
  };

  const goToPrivacyTerms = () => {
    openUrl(PRIVACY_URL, true);
  };

  if (isLogin) {
    return (
      <View style={bottomOverlayStyles.loginContainer}>
        <View style={bottomOverlayStyles.containerBtnLogin}>
          <TouchableOpacity onPress={() => handleLogin()} style={bottomOverlayStyles.btnSign}>
            <ButtonSign />
          </TouchableOpacity>
          <Text style={bottomOverlayStyles.termsAndPrivacy}>
            {` ${StringConstant.signInTermsAndPrivacyDetail}\n`}
            <Text onPress={goToTermsWeb} style={bottomOverlayStyles.link}>
              {StringConstant.signInTermsLink}
            </Text>
            {' and '}
            <Text onPress={goToPrivacyTerms} style={bottomOverlayStyles.link}>
              {StringConstant.signInPrivacy}
            </Text>
          </Text>
          <Text style={bottomOverlayStyles.desc}>
            <Text onPress={goToHumanIdWeb} style={bottomOverlayStyles.link}>
              {StringConstant.signInScreenHumanIdBrand}
            </Text>
            {` ${StringConstant.signInScreenHumanIdDetail}`}
          </Text>
        </View>
      </View>
    );
  }

  return (
    <View style={bottomOverlayStyles.container}>
      <Text style={bottomOverlayStyles.title}>{title}</Text>
      <View>{textSvg}</View>
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

const bottomOverlayStyles = StyleSheet.create({
  bottomBlock: {
    position: 'absolute',
    bottom: 0,
    right: 32,
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'transparent',
    zIndex: 1000,
    width: '100%'
    // backgroundColor: 'rgba(255,0,0,0.5)'
  },
  btnSign: {
    alignSelf: 'center'
    // marginBottom: 39,
  },
  container: {
    backgroundColor: 'white',
    height: dimen.size.ONBOARDING_BOTTOM_OVERLAY_CONTAINER,
    paddingStart: 32,
    paddingEnd: 32,
    display: 'flex',
    flexDirection: 'column',
    zIndex: 10
  },
  containerBtnLogin: {
    // backgroundColor: 'red',
    // maxWidth: 321,
    // alignSelf: 'center',
    // flex: 1,
  },
  desc: {
    fontWeight: '400',
    fontFamily: fonts.inter[400],
    lineHeight: 18,
    fontSize: 12,
    textAlign: 'center',
    color: COLORS.blackgrey,
    marginTop: 38,
    alignSelf: 'center'
  },
  termsAndPrivacy: {
    fontWeight: '400',
    fontFamily: fonts.inter[400],
    lineHeight: 18,
    fontSize: 12,
    textAlign: 'center',
    color: COLORS.blackgrey,
    marginTop: 10,
    alignSelf: 'center'
  },
  link: {
    color: colors.blue,
    textDecorationLine: 'underline'
  },
  loginContainer: {
    backgroundColor: 'white',
    height: dimen.size.ONBOARDING_BOTTOM_OVERLAY_CONTAINER,
    paddingTop: 55,
    display: 'flex',
    flexDirection: 'column',
    alignContent: 'center',
    zIndex: 10
  },
  nextButton: {
    backgroundColor: COLORS.blueOnboarding,
    // backgroundColor: 'red',
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
    marginBottom: normalize(30),
    lineHeight: normalize(28),
    fontSize: normalizeFontSize(22),
    fontFamily: fonts.inter[600],
    color: COLORS.blueOnboarding,
    alignSelf: 'flex-start'
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
