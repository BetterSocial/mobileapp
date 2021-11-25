import * as React from 'react';
import { StyleSheet, View } from 'react-native';

export const SlideShowItem = ({index, children}) => {
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

    return <View style={styles.slideShowItemContainer}>
        {children}
    </View>
}

const styles = StyleSheet.create({
    slideShowItemContainer : {
        flex: 1,
        justifyContent: 'center',
    },
});