import * as React from 'react';
import { Pressable, StyleSheet, Text } from 'react-native';

import IcArrowUpRight from '../../../assets/icons/ic_arrow_up_right';
import { colors } from '../../../utils/colors';
import { fonts } from '../../../utils/fonts';

/**
 * @typedef {Object} RecentSearchItemsProp
 * @property {String} text
 * @property {Function} onItemClicked
 */
/**
 * 
 * @param {RecentSearchItemsProp} prop
 */
const RecentSearchItems = (prop) => {
    const { onItemClicked, text = "Coba" } = prop
    return <Pressable style={styles.pressableContainer} onPress={onItemClicked}
        android_ripple={{
            color: colors.gray1,
            borderless: false,
        }}>
        <Text style={styles.text}>{text}</Text>
        <IcArrowUpRight style={styles.icon} />
    </Pressable>
}

const styles = StyleSheet.create({
    icon: {
        alignSelf: 'center',
    },
    pressableContainer: {
        paddingLeft: 20,
        paddingRight: 14,
        display: 'flex',
        flexDirection: 'row',
        width: '100%',
    },
    text: {
        fontFamily: fonts.inter[500],
        fontSize: 14,
        lineHeight: 17,
        flex: 1,
        alignSelf: 'center',
        paddingTop: 6,
        paddingBottom: 6,
    }
})

export default RecentSearchItems