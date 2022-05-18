import * as React from 'react'
import { Pressable, StyleSheet, Text, TouchableNativeFeedback, View } from "react-native"
import { TouchableOpacity, TouchableWithoutFeedback } from 'react-native-gesture-handler'

import BottomOverlayPagination from './pagination'
import ButtonSign from '../../../../assets/icon-svg/button_sign.svg';
import MemoizedIcArrowRightTail from "../../../../assets/arrow/ic_arrow_right_tail"
import StringConstant from '../../../../utils/string/StringConstant'
import dimen from "../../../../utils/dimen"
import { COLORS } from "../../../../utils/theme"
import { fonts, normalizeFontSize } from "../../../../utils/fonts"

const BottomOverlay = ({ count, handleLogin, index, isLogin, title, text, onNextSlide, textSvg }) => {
    const goToHumanIdWeb = () => {
        openUrl(HUMAN_ID_URL);
    };

    if (isLogin) return <View style={bottomOverlayStyles.loginContainer}>
        <View style={bottomOverlayStyles.containerBtnLogin}>
            <TouchableOpacity onPress={() => handleLogin()} style={bottomOverlayStyles.btnSign}>
                <ButtonSign />
            </TouchableOpacity>
            <Text style={bottomOverlayStyles.desc}>
                <Text onPress={goToHumanIdWeb} style={bottomOverlayStyles.humanID}>
                    {StringConstant.signInScreenHumanIdBrand}
                </Text>
                {` ${StringConstant.signInScreenHumanIdDetail}`}
            </Text>
        </View>
    </View>

    return <View style={bottomOverlayStyles.container}>
        <Text style={bottomOverlayStyles.title}>{title}</Text>
        {/* {text} */}
        {/* <View style={{backgroundColor: 'rgba(255,0,0,0.1)'}}> */}
        <View>
            {textSvg}
        </View>
        <View style={bottomOverlayStyles.bottomBlock}>
            <View style={bottomOverlayStyles.pagination}>
                <BottomOverlayPagination count={count} active={index} />
            </View>
            <Pressable onPress={onNextSlide}>
                <View style={bottomOverlayStyles.paddingContainer}>
                    <View style={bottomOverlayStyles.nextButton}>
                        <MemoizedIcArrowRightTail width={26.6} height={26.6} style={bottomOverlayStyles.nextButtonIcon} />
                    </View>
                </View>
            </Pressable>
        </View>
    </View>
}

export default BottomOverlay

const bottomOverlayStyles = StyleSheet.create({
    bottomBlock: {
        position: 'absolute',
        bottom: 0,
        right: 0,
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'transparent',
        zIndex: 1000,
        // backgroundColor: 'rgba(255,0,0,0.5)'
    },
    btnSign: {
        alignSelf: 'center',
        marginBottom: 39,
    },
    container: {
        backgroundColor: 'white',
        // backgroundColor: 'red',
        height: dimen.size.ONBOARDING_BOTTOM_OVERLAY_CONTAINER,
        paddingStart: 32,
        paddingEnd: 32,
        display: 'flex',
        flexDirection: 'column',
        // justifyContent: 'flex-end',
        zIndex: 10,
    },
    desc: {
        fontWeight: '400',
        fontFamily: fonts.inter[400],
        lineHeight: 18,
        fontSize: 12,
        // width: 250,
        textAlign: 'center',
        color: COLORS.gray,
        marginTop: 16,
        alignSelf: 'center'
    },
    humanID: {
        color: '#11243D',
        // fontWeight: 'bold',
        textDecorationLine: 'underline',
    },
    loginContainer: {
        backgroundColor: 'white',
        height: dimen.size.ONBOARDING_BOTTOM_OVERLAY_CONTAINER,
        // paddingStart: 32,
        paddingTop: 55,
        display: 'flex',
        flexDirection: 'column',
        alignContent: 'center',
        zIndex: 10,
        // justifyContent: 'center'
    },
    nextButton: {
        backgroundColor: COLORS.blueOnboarding,
        // backgroundColor: 'red',
        width: dimen.size.ONBOARDING_BOTTOM_OVERLAY_NEXT_BUTTON_SIZE,
        height: dimen.size.ONBOARDING_BOTTOM_OVERLAY_NEXT_BUTTON_SIZE,
        borderRadius: dimen.size.ONBOARDING_BOTTOM_OVERLAY_NEXT_BUTTON_SIZE,
        alignContent: 'center',
        justifyContent: 'center',
    },
    nextButtonIcon: {
        alignSelf: 'center',
    },
    title: {
        marginTop: 26,
        marginBottom: 12,
        marginRight: 32,
        fontSize: normalizeFontSize(36),
        fontFamily: fonts.inter[600],
        lineHeight: 43.57,
        color: COLORS.blueOnboarding,
        alignSelf: 'flex-start',
    },
    paddingContainer: {
        // backgroundColor: 'red',
        paddingTop: dimen.normalizeDimen(27),
        paddingLeft: dimen.normalizeDimen(16.76),
        paddingBottom: dimen.normalizeDimen(23),
        paddingRight: dimen.normalizeDimen(39.24),
        zIndex: 1000,
    },
    pagination: {
        flex: 1,
        // backgroundColor: 'red',
        justifyContent: 'center',
        marginTop: 4.5,
    }
})