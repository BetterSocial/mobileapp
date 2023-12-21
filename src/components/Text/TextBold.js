import * as React from 'react'
import { StyleSheet, Text, TextProps } from 'react-native'
import {COLORS} from '../../utils/theme';

/**
 * 
 * @param {TextProps} props 
 * @returns {React.FC}
 */
const TextBold = ({text, ...props}) => <Text {...props} style={styles.bold}>{text}</Text>

const styles = StyleSheet.create({
    bold: {
        fontFamily: 'Inter',
        fontStyle: 'normal',
        fontWeight: 'bold',
        fontSize: 14,
        lineHeight: 17,
        color: COLORS.black,
    },
});

export default TextBold