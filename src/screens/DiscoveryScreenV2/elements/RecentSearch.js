import * as React from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Keyboard, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import DiscoveryAction from '../../../context/actions/discoveryAction';
import GeneralComponentAction from '../../../context/actions/generalComponentAction';
import IconClear from '../../../assets/icon/IconClear';
import RecentSearchItems from './RecentSearchItem';
import { Context } from '../../../context';
import { RECENT_SEARCH_TERMS } from '../../../utils/cache/constant';
import { colors } from '../../../utils/colors';
import { fonts } from '../../../utils/fonts';

/**
 * @typedef {Object} RecentSearchOptions
 * @property {Boolean}[shown = true] shown
 */
/**
 *
 * @param {RecentSearchOptions} param
 */
const RecentSearch = (param) => {
    const {
        shown = true,
        setSearchText = () => { },
        setIsFirstTimeOpen = () => { }
    } = param

    const [discovery, discoveryDispatch] = React.useContext(Context).discovery

    const [isShown, setIsShown] = React.useState(shown)
    const [items, setItems] = React.useState(discovery.recentSearch)

    React.useEffect(() => {
        setIsShown(shown)
        return () => {
            setIsShown(false)
        }
    }, [shown])

    React.useEffect(() => {
        setItems(discovery.recentSearch)
        return () => {
            setItems([])
        }
    }, [discovery.recentSearch])

    const manipulateSearchTermsOrder = async (search) => {
        const result = await AsyncStorage.getItem(RECENT_SEARCH_TERMS)
        if (!result) return

        let resultArray = JSON.parse(result)
        if (resultArray.length <= 1) return

        const itemIndex = resultArray.indexOf(search)
        resultArray = [search].concat(resultArray)
        resultArray.splice(itemIndex + 1, 1)
        DiscoveryAction.setDiscoveryRecentSearch(resultArray, discoveryDispatch)
        AsyncStorage.setItem(RECENT_SEARCH_TERMS, JSON.stringify(resultArray))
        setItems(resultArray)

    }

    const fetchDiscoveryData = async (search) => {
        setSearchText(search)
        setIsFirstTimeOpen(false)
        Keyboard.dismiss()
        manipulateSearchTermsOrder(search)
    }

    const handleClearRecentSearch = async () => {
        setIsShown(false)
        // Remove from context here
        await AsyncStorage.removeItem(RECENT_SEARCH_TERMS)

        DiscoveryAction.setDiscoveryRecentSearch([], discoveryDispatch)
    }

    if (isShown && items.length > 0) return <View style={styles.recentContainer}>
        <View style={styles.recentTitleContainer}>
            <Text style={styles.recentTitle}>Recent</Text>
            <TouchableOpacity delayPressIn={0} style={styles.iconClear} onPress={handleClearRecentSearch}>
                <IconClear fill={colors.black} />
            </TouchableOpacity>
        </View>
        {items.map((item, index) => <RecentSearchItems key={`recentSearch-${index}`} text={item} onItemClicked={() => fetchDiscoveryData(item)} />)}
    </View>

    return <></>

}

const styles = StyleSheet.create({
    iconClear: {
        alignSelf: 'center',
        color: colors.black
    },
    recentContainer: {
        paddingTop: 18,
        paddingBottom: 15,
        backgroundColor: colors.white
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
