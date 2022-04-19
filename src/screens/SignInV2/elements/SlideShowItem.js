import * as React from 'react';
import { Button, Dimensions, Image, StyleSheet, Text, View } from 'react-native';

import BgOnboarding from '../../../assets/background/bg_onboarding.png'
import BgOnboardingTop from '../../../assets/background/bg_onboarding_top.png'
import BottomOverlay from './BottomOverlay';
import IconBetterOnboarding from '../../../assets/icon/IconBetterOnboarding';
import dimen from '../../../utils/dimen';
import { COLORS, FONTS } from '../../../utils/theme';
import { fonts, normalizeFontSize } from '../../../utils/fonts';

const { height, width } = Dimensions.get('screen')

export const SlideShowItem = ({ children, count, handleLogin, illustration, index, isLogin, title, text, onNextSlide = () => { } }) => {
    // console.log(height)
    const __renderForeground = () => {
        if (index < 4) return (<Image source={illustration} style={styles.onboardingForeground} />)
        return <></>
    }

    const getLogoDimension = () => {
        // if()
    }

    const __renderBackground = () => {
        // if (index < 4) return <Image source={BgOnboarding} style={styles.onboardingBackground} />
        if (index < 4) return <></>
        return <View style={styles.onboardingBackgroundTopContainer}>
            <Image source={BgOnboardingTop} style={styles.onboardingBackgroundTop} />
            <View style={styles.brandLoginContainer}>
                <IconBetterOnboarding width={dimen.size.ONBOARDING_BETTER_LOGO_WIDTH} height={dimen.size.ONBOARDING_BETTER_LOGO_HEIGHT} style={styles.brandLoginImage} />
                {/* <IconBetterOnboarding width={156} height={213.94} style={styles.brandLoginImage} /> */}
                <Text style={styles.brandLoginTopText}>
                    {`Better Social is a Public Benefits Corporation -\n`}
                    {`started to fix what Big Tech has broken, to protect\n`}
                    {`your privacy, well being & freedom of speech.\n`}
                    {`\n`}
                    {`Now, and in the future`}
                </Text>
            </View>
        </View >
    }

    return <View style={styles.container}>
        <View style={styles.topPartContainer}>
            {__renderForeground()}
            {__renderBackground()}
        </View>
        <BottomOverlay count={count} handleLogin={handleLogin} isLogin={isLogin} text={text} title={title} index={index} onNextSlide={onNextSlide} />
    </View>
}

const styles = StyleSheet.create({
    brandLoginContainer: { alignSelf: 'center' },
    brandLoginTopText: {
        alignSelf: 'center',
        textAlign: 'center',
        fontFamily: fonts.inter[500],
        fontSize: normalizeFontSize(14.45),
        lineHeight: normalizeFontSize(21.67),
        color: COLORS.white
    },
    brandLoginImage: {
        alignSelf: 'center',
        marginBottom: dimen.normalizeDimen(height > 640 ? 32.62 : 8),
        // backgroundColor: 'red'
    },
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
        top: height > 640 ? 0 : 0,
        zIndex: 1,
        width: width,
        height: '100%',
        // resizeMode: 'contain'
        resizeMode: 'cover'
    },
    onboardingBackground: {
        width: '100%',
        height: '100%',
    },
    onboardingBackgroundTop: {
        width: '100%',
        height: '100%',
        resizeMode: 'cover',
        position: 'absolute',
    },
    onboardingBackgroundTopContainer: { 
        width: '100%', 
        height: '100%', 
        display: 'flex', 
        justifyContent: 'center' 
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