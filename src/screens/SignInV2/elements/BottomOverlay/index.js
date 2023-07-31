import * as React from 'react';
import {Pressable, StyleSheet, Text, View} from 'react-native';
import {TouchableOpacity} from 'react-native-gesture-handler';

import BottomOverlayPagination from './pagination';
import MemoizedIcArrowRightTail from '../../../../assets/arrow/ic_arrow_right_tail';
import StringConstant from '../../../../utils/string/StringConstant';
import dimen from '../../../../utils/dimen';
import {COLORS} from '../../../../utils/theme';
import {colors} from '../../../../utils/colors';
import {fonts, normalizeFontSize} from '../../../../utils/fonts';
import {openUrl} from '../../../../utils/Utils';
import ButtonSign from '../../../../assets/icon/ButtonSign';

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

  if (isLogin)
    return (
      <View
        style={{
          ...bottomOverlayStyles.loginContainer,
          height: dimen.size.ONBOARDING_BOTTOM_OVERLAY_CONTAINER_LOGIN
        }}>
        <View style={bottomOverlayStyles.containerBtnLogin}>
          <TouchableOpacity onPress={() => handleLogin()} style={bottomOverlayStyles.btnSign}>
            <ButtonSign width={'100%'} preserveAspectRatio="xMinYMin slice" />
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
            <Text style={bottomOverlayStyles.descBold}>{' without storing\n'}</Text>
            {'your data or'}
            <Text style={bottomOverlayStyles.descBold}>{' sharing'}</Text>
            {' it with BetterSocial'}
          </Text>
        </View>
      </View>
    );

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
    width: '100%',
    alignSelf: 'center',
    marginBottom: 12
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
    backgroundColor: 'white',
    borderWidth: 1,
    borderRadius: 8,
    borderColor: COLORS.gray1,
    paddingBottom: 16
  },
  descTitle: {
    fontFamily: fonts.inter[600],
    lineHeight: 24,
    fontSize: 16,
    textAlign: 'center',
    color: COLORS.bunting,
    alignSelf: 'center'
  },
  desc: {
    fontWeight: '400',
    fontFamily: fonts.inter[400],
    lineHeight: 20,
    fontSize: 14,
    textAlign: 'center',
    color: COLORS.blackgrey,
    alignSelf: 'center'
  },
  descBold: {
    fontWeight: '700'
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
    width: '100%',
    backgroundColor: COLORS.lightgrey,
    height: dimen.size.ONBOARDING_BOTTOM_OVERLAY_CONTAINER,
    display: 'flex',
    flexDirection: 'column',
    alignContent: 'center',
    zIndex: 10,
    padding: 16,
    alignSelf: 'center'
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
    marginTop: 26,
    marginBottom: 12,
    marginRight: 32,
    fontSize: normalizeFontSize(36),
    fontFamily: fonts.inter[600],
    lineHeight: 43.57,
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
