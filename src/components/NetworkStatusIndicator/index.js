import * as React from 'react'
import Netinfo, { useNetInfo } from '@react-native-community/netinfo'
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native'
import { colors } from 'react-native-swiper-flatlist/src/themes'
import { debounce } from 'lodash'

import LoadingWithoutModal from '../LoadingWithoutModal'
import { COLORS } from '../../utils/theme'

/**
 * 
 * @param {NetworkStatusIndicatorProps} param0 
 * @returns 
 */
const NetworkStatusIndicator = ({ hide = false }) => {
    const [isInternetReachable, setIsInternetReachable] = React.useState(true);
    const internetStatusDebounced = React.useCallback(debounce(() => {
        setIsInternetReachable(false)
    }, 3000)

        , [])

    const netInfo = useNetInfo()

    React.useEffect(() => {
        const { isInternetReachable: isReachable } = netInfo
        if (!isReachable) {
            internetStatusDebounced()
        } else {
            internetStatusDebounced.cancel()
            setIsInternetReachable(true)
        }

    }, [netInfo?.isInternetReachable])

    if (hide) return <></>

    if (!isInternetReachable) return <View testID='network-status-indicator' style={styles.container}>
        <LoadingWithoutModal />
        <View style={styles.bottomContainer}>
            <Text style={styles.text}>No Internet Connection</Text>
        </View>
    </View>

    return <></>
}

const styles = StyleSheet.create({
    container: {
        position: 'absolute',
        top: 0,
        bottom: 0,
        right: 0,
        left: 0,
        height: '100%',
        width: '100%',
        zIndex: 100,
        backgroundColor: COLORS.black30percent
    },
    bottomContainer: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        width: '100%',
        zIndex: 100,
        padding: 16,
        backgroundColor: COLORS.red,
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'center'
    },

    text: {
        color: COLORS.white,
        alignSelf: 'center',
        marginEnd: 8
    }
})

export default NetworkStatusIndicator