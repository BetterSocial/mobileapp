import * as React from 'react'
import { StyleSheet, Text, TouchableOpacity, View } from "react-native"

import ChevronRightIcon from '../../../assets/icons/images/chevron-right.svg';
import { colors } from "../../../utils/colors";
import { fonts } from "../../../utils/fonts";

/**
 * @typedef {Object} ProfileSettingItemProps
 * @property {String} text
 * @property {Function} onPress
 */
/**
 * 
 * @param {ProfileSettingItemProps} props
 * @returns 
 */
const ProfileSettingItem = ({ text, onPress, ...props }) => <TouchableOpacity onPress={onPress} {...props} >
        <View style={styles.card}>
            <Text style={styles.textCard}>{text}</Text>
            <ChevronRightIcon width={6.67} height={11.67} fill="#000" />
        </View>
    </TouchableOpacity>

const styles = StyleSheet.create({
    card: {
        height: 52,
        borderRadius: 8,
        backgroundColor: colors.lightgrey,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingLeft: 20,
        paddingRight: 20,
        paddingTop: 18,
        paddingBottom: 18,
        marginBottom: 12,
    },
    textCard: {
        fontFamily: fonts.inter[700],
        fontWeight: '800',
        fontSize: 14,
        color: colors.black,
        lineHeight: 16,
    },
})

export default ProfileSettingItem