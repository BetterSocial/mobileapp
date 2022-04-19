import * as React from 'react';
import { Button, Dimensions, Image, StyleSheet, Text, View } from 'react-native';

import BgOnboarding from '../../../assets/background/bg_onboarding.png'
import BgOnboardingTop from '../../../assets/background/bg_onboarding_5_top.png'
import BottomOverlay from './BottomOverlay';
import { fonts, normalizeFontSize } from '../../../utils/fonts';

const { height, width } = Dimensions.get('screen')

export const SlideShowItem = ({ children, count, handleLogin, illustration, index, isLogin, title, text, onNextSlide = () => { } }) => {
    const __renderForeground = () => {
        if (index < 4) return (<Image source={illustration} style={styles.onboardingForeground} />)
        return <></>
    }

    return <View style={styles.container}>
        <View style={styles.topPartContainer}>
            {__renderForeground()}
            <Image source={index === 4 ? BgOnboardingTop : BgOnboarding} style={styles.onboardingBackground} />
        </View>
        <BottomOverlay count={count} handleLogin={handleLogin} isLogin={isLogin} text={text} title={title} index={index} onNextSlide={onNextSlide} />
    </View>
}

const styles = StyleSheet.create({
    container: {
        height: '100%',
        width: width,
    },
    slideShowItemContainer: (backgroundColor, width) => {
        return {
            justifyContent: 'center',
            flex: 1,
            backgroundColor: backgroundColor,
            maxWidth: width,
            marginTop: -32,
        }
    },
    onboardingForeground: {
        position: 'absolute',
        top: -48,
        zIndex: 1,
        width: width,
        height: height,
        resizeMode: 'contain'
    },
    onboardingBackground: {
        width: '100%',
        height: '100%',
    },
    title: {
        fontSize: 18,
        lineHeight: 12.5,
        fontFamily: fonts.inter[600],
        zIndex: 1000,
        paddingTop: 5,
        marginTop: 18,
        textAlign: 'center',
        alignSelf: 'center'
    },
    text: (lineHeight) => {
        return {
            fontSize: 14.0,
            lineHeight: lineHeight,
            marginLeft: 12,
            marginRight: 12,
            marginTop: 16,
            fontFamily: fonts.inter[500],
            zIndex: 1000,
            textAlign: 'center',
        }
    },
    topPartContainer: {
        flex: 1,
    }
});