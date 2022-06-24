import * as React from 'react';
import { Keyboard, ScrollView, StatusBar, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import DiscoveryAction from '../../context/actions/discoveryAction';
import DiscoveryTab from './elements/DiscoveryTab';
import DomainFragment from '../DiscoveryScreenV2/fragment/DomainFragment';
import NewsFragment from '../DiscoveryScreenV2/fragment/NewsFragment';
import Search from './elements/Search';
import TopicFragment from '../DiscoveryScreenV2/fragment/TopicFragment';
import UsersFragment from './fragment/UsersFragment';
// import DomainFragment from './fragment/DomainFragment';
// import DomainList from '../Followings/elements/RenderList';
// import Followings from '../Followings';
// import NewsFragment from './fragment/NewsFragment';
// import RecentSearch from './elements/RecentSearch';
// import RecentSearchItems from './elements/RecentSearchItem';
// import Search from './elements/Search';
// import SearchFragment from './fragment/SearchFragment';
// import StringConstant from '../../utils/string/StringConstant';
// import TopicFragment from './fragment/TopicFragment';
// import UsersFragment from './fragment/UsersFragment';
import useIsReady from '../../hooks/useIsReady';
import { Context } from '../../context';
import { DEFAULT_PROFILE_PIC_PATH, DISCOVERY_TAB_DOMAINS, DISCOVERY_TAB_NEWS, DISCOVERY_TAB_TOPICS, DISCOVERY_TAB_USERS } from '../../utils/constants';
import { FONTS } from '../../utils/theme';
import { colors } from '../../utils/colors';
import { fonts } from '../../utils/fonts';
import { withInteractionsManagedNoStatusBar } from '../../components/WithInteractionManaged';

// const { height } = Dimensions.get('screen');

const DiscoveryScreenV2 = ({ route }) => {
    const { tab } = route.params
    const [selectedScreen, setSelectedScreen] = React.useState(tab);

    const [discovery, discoveryDispatch] = React.useContext(Context).discovery

    const __handleScroll = React.useCallback(() => {
        Keyboard.dismiss()
    })
    

    React.useEffect(() => {
        const unsubscribe = (() => {
            // console.log('coba')
            DiscoveryAction.setDiscoveryFirstTimeOpen(true, discoveryDispatch)
            DiscoveryAction.setDiscoveryFocus(true, discoveryDispatch)
        })

        return unsubscribe
    }, [])

    // React.useEffect(() => {
    //     if (discoverySearchBarText.length > 1) DiscoveryAction.setDiscoveryFirstTimeOpen(false, discoveryDispatch)
    // }, [discoverySearchBarText])

    const __renderFragment = () => {
        if(selectedScreen === DISCOVERY_TAB_USERS) return <UsersFragment />
        if(selectedScreen === DISCOVERY_TAB_TOPICS) return <TopicFragment />
        if(selectedScreen === DISCOVERY_TAB_DOMAINS) return <DomainFragment />
        if(selectedScreen === DISCOVERY_TAB_NEWS) return <NewsFragment />

        return <></>
    }

    return <SafeAreaView style={{flex: 1}}>
        <StatusBar translucent={false} />
        <Search />
        <DiscoveryTab selectedScreen={selectedScreen} onChangeScreen={(index) => setSelectedScreen(index)}/>
        <ScrollView
            style={styles.fragmentContainer}
            contentContainerStyle={styles.fragmentContentContainer} 
            keyboardShouldPersistTaps='handled'
            onMomentumScrollBegin={__handleScroll}>
            { __renderFragment() }
        </ScrollView>
    </SafeAreaView>
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#fff',
        flex: 1,
        paddingTop: 60
    },
    fragmentContainer: {
        height: '100%',
        backgroundColor: colors.white,
    },
    fragmentContentContainer: {
        // height: '100%'
        flexGrow: 1,
    },
    sectionTitle: {
        paddingHorizontal: 24,
        paddingVertical: 4,
        fontFamily: fonts.inter[600]
    }
})

export default withInteractionsManagedNoStatusBar(DiscoveryScreenV2)
// export default React.memo(DiscoveryScreenV2)