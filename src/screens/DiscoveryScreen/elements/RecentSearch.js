import * as React from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Keyboard, Pressable, StyleSheet, Text, View } from 'react-native';

import DiscoveryAction from '../../../context/actions/discoveryAction';
import DiscoveryRepo from '../../../service/discovery';
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
    const { shown = true } = param
    const [isShown, setIsShown] = React.useState(shown)

    const [generalComponent, generalComponentDispatch] = React.useContext(Context).generalComponent
    const [discovery, discoveryDispatch] = React.useContext(Context).discovery

    const [items, setItems] = React.useState(discovery.recentSearch)

    const __manipulateSearchTermsOrder = async (search) => {
        let result = await AsyncStorage.getItem(RECENT_SEARCH_TERMS)
        if(!result) return

        let resultArray = JSON.parse(result)
        if(resultArray.length <= 1) return

        let itemIndex = resultArray.indexOf(search)
        resultArray = [search].concat(resultArray)
        resultArray.splice(itemIndex + 1, 1)
        DiscoveryAction.setDiscoveryRecentSearch(resultArray, discoveryDispatch)
        AsyncStorage.setItem(RECENT_SEARCH_TERMS, JSON.stringify(resultArray))
        setItems(resultArray)

    }

    const __fetchDiscoveryData = async (search) => {
        GeneralComponentAction.setDiscoverySearchBar(search, generalComponentDispatch)
        DiscoveryAction.setDiscoveryFirstTimeOpen(false, discoveryDispatch)
        Keyboard.dismiss()
        __manipulateSearchTermsOrder(search)
        
        // DiscoveryRepo.fetchDiscoveryDataUser(search).then(async (data) => {
        //     if (data.success) {
        //         await DiscoveryAction.setDiscoveryDataUsers(data, discoveryDispatch)
        //         setTimeout(() => {
        //             DiscoveryAction.setDiscoveryLoadingDataUser(false, discoveryDispatch)
        //         }, 500)
        //     }
        // })

        // DiscoveryRepo.fetchDiscoveryDataDomain(search).then(async (data) => {
        //     if (data.success) {
        //         await DiscoveryAction.setDiscoveryDataDomains(data, discoveryDispatch)
        //         setTimeout(() => {
        //             DiscoveryAction.setDiscoveryLoadingDataDomain(false, discoveryDispatch)
        //         }, 500)
        //     }
        // })

        // DiscoveryRepo.fetchDiscoveryDataTopic(search).then(async (data) => {
        //     if (data.success) {
        //         await DiscoveryAction.setDiscoveryDataTopics(data, discoveryDispatch)
        //         setTimeout(() => {
        //             DiscoveryAction.setDiscoveryLoadingDataTopic(false, discoveryDispatch)
        //         }, 500)
        //     }
        // })

        // DiscoveryRepo.fetchDiscoveryDataNews(search).then(async (data) => {
        //     if (data.success) {
        //         await DiscoveryAction.setDiscoveryDataNews(data, discoveryDispatch)
        //         setTimeout(() => {
        //             DiscoveryAction.setDiscoveryLoadingDataNews(false, discoveryDispatch)
        //         }, 500)
        //     }
        // })

        // DiscoveryAction.setDiscoveryLoadingData(false, discoveryDispatch)
    }

    const __handleClearRecentSearch = async () => {
        setIsShown(false)
        // Remove from context here
        let response = await AsyncStorage.removeItem(RECENT_SEARCH_TERMS, () => {
            console.log('response asdadadasd')
        })
    }

    if (isShown && items.length > 0) return <View style={styles.recentContainer}>
        <View style={styles.recentTitleContainer}>
            <Text style={styles.recentTitle}>Recent</Text>
            <Pressable style={styles.iconClear} onPress={__handleClearRecentSearch}
                android_ripple={{
                    borderless: true,
                    radius: 15,
                    color: colors.gray1,
                }}>
                <IconClear fill={colors.black} />
            </Pressable>
        </View>
        {items.map((item, index) => {
            return <RecentSearchItems key={`recentSearch-${index}`} text={item} onItemClicked={() => __fetchDiscoveryData(item)} />
        })}
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