import * as React from 'react';
import { Dimensions, StyleSheet, Text, View } from 'react-native';

import { fonts, normalizeFontSize } from '../../../utils/fonts';

export const SlideShowItem = ({index, children, title, text, lineHeight}) => {
    const {width} = Dimensions.get('screen')
    const getBackgroundColor = () => {
        switch(index) {
            case 0 : return '#FFDFA0'
            case 1 : return '#76DDFD'
            case 2 : return '#54E4B9'
            case 3 : return '#B7EC9E'
            default : break;
        }
    }

    const backgroundColor = getBackgroundColor()

    return <View style={styles.slideShowItemContainer(backgroundColor, width)}>
        {children}
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.text(lineHeight)}>{text}</Text>
    </View>
}

const styles = StyleSheet.create({
    slideShowItemContainer : (backgroundColor, width) => ({
            justifyContent:'center',
            flex: 1,
            backgroundColor,
            maxWidth: width,
            marginTop: -32,
        }),
    title: {
        fontSize: 18,
        lineHeight:12.5,
        fontFamily: fonts.inter[600],
        zIndex: 1000,
        paddingTop: 5,
        marginTop: 18,
        textAlign: 'center',
        alignSelf: 'center'
    },
    text: (lineHeight) => ({
            fontSize: 14.0,
            lineHeight,
            marginLeft: 12,
            marginRight: 12,
            marginTop: 16,
            fontFamily: fonts.inter[500],
            zIndex: 1000,
            textAlign: 'center',
        })
});