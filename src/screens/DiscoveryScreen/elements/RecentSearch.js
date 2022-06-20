import * as React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import IconClear from '../../../assets/icon/IconClear';
import RecentSearchItems from './RecentSearchItem';
import { colors } from '../../../utils/colors';
import { fonts } from '../../../utils/fonts';

/**
 * @typedef {Object} RecentSearchOptions
 *
 */
/**
 * 
 * @param {RecentSearchOptions} param
 */
const RecentSearch = (param) => {
    const [isShown, setIsShown] = React.useState(true)
    let items = ['Coba123', 'Coba456', 'Coba789']
    // items = []

    const __handleClearRecentSearch = () => {
        setIsShown(false)
        // Remove from context here
    }

    if (isShown && items.length > 0) return <View style={styles.recentContainer}>
        <View style={styles.recentTitleContainer}>
            <Text style={styles.recentTitle}>Recent</Text>
            <Pressable style={styles.iconClear} onPress={() => setIsShown(false)}
                android_ripple={{
                    borderless: true,
                    radius: 15,
                    color: colors.gray1,
                }}>
                <IconClear fill={colors.black} />
            </Pressable>
        </View>
        <RecentSearchItems text='Coba123' onItemClicked={() => console.log('Coba123')} />
        <RecentSearchItems text='Coba456' onItemClicked={() => { }} />
        <RecentSearchItems text='Coba789' onItemClicked={() => { }} />
    </View>

    return <></>

}

const styles = StyleSheet.create({
    iconClear: {
        alignSelf: 'center',
        color: colors.black
    },
    recentContainer: {
        marginTop: 18,
        marginBottom: 15,
    },
    recentTitle: {
        fontSize: 14,
        fontFamily: fonts.inter[600],
        color: colors.bondi_blue,
        alignSelf: 'center',
        flex: 1,
    },
    recentTitleContainer: {
        display: 'flex',
        flexDirection: 'row',
        paddingLeft: 20,
        paddingRight: 14,
        marginBottom: 9,
    },
})

export default RecentSearch;