import * as React from 'react';
import { Dimensions, StyleSheet, Text, View } from 'react-native';

import { fonts } from '../../../utils/fonts';

export const SlideShowItem = ({index, children, title, text, lineHeight = 24}) => {
    const width = Dimensions.get('screen').width
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

    return <View style={styles.slideShowItemContainer(backgroundColor, width)}>
        {children}
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.text(lineHeight)}>{text}</Text>
    </View>
}

const styles = StyleSheet.create({
    slideShowItemContainer : (backgroundColor, width) => {
        return {
            justifyContent:'center',
            flex: 1,
            backgroundColor : backgroundColor,
            maxWidth: width,
        }
    },
    title: {
        fontSize: 18,
        lineHeight:12.5,
        fontFamily: fonts.inter[600],
        zIndex: 1000,
        paddingTop: 18,
        textAlign: 'center'
    },
    text: (lineHeight) => {
        return {
            fontSize: 15,
            lineHeight:lineHeight,
            marginHorizontal: 25,
            marginTop: 20,
            fontFamily: fonts.inter[500],
            zIndex: 1000,
            textAlign: 'center'
        }
    }
});