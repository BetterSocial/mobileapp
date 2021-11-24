import * as React from 'react';
import { Dimensions, StyleSheet, View } from 'react-native';

import Onboarding1 from '../../../assets/images/onboarding1';
import Onboarding2 from '../../../assets/images/onboarding2';
import Onboarding3 from '../../../assets/images/onboarding3';
import Onboarding4 from '../../../assets/images/onboarding4';

export const SlideShowItem = ({index}) => {
    const {width, height} = Dimensions.get('screen') 

    const getBackgroundColor = () => {
        switch(index) {
            case 0 : return '#FFDFA0'
            case 1 : return '#76DDFD'
            case 2 : return '#54E4B9'
            case 3 : return '#B7EC9E'
            default : break;
        }
    }

    let backgroundColor = getBackgroundColor()

    const renderOnboardingItem = () => {
        switch(index) {
            case 0 : return <Onboarding1 width={width} height={width / 375 * 509} style={styles.onboardingItem(width, backgroundColor)}/>
            case 1 : return <Onboarding2 width={width} height={width / 375 * 509} style={styles.onboardingItem(width, backgroundColor)}/>
            case 2 : return <Onboarding3 width={width} height={width / 375 * 509} style={styles.onboardingItem(width, backgroundColor)}/>
            case 3 : return <Onboarding4 width={width} height={width / 375 * 509} style={styles.onboardingItem(width, backgroundColor)}/>
            default : break;
        }
    }

    return <View style={styles.slideShowItemContainer(width, backgroundColor)}>
        {renderOnboardingItem()}
    </View>
}

const styles = StyleSheet.create({
    slideShowItemContainer : (width, backgroundColor) => {
        return {
            width: width,
            height: '100%',
            alignContent : 'center',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: backgroundColor,
        }
    },
    
    onboardingItem: (width, backgroundColor) => {
        return {
            backgroundColor: backgroundColor,
            // marginLeft: (width - 375),
        }
    }
});