import * as React from 'react';
import { Keyboard, ScrollView, StatusBar, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import DiscoveryAction from '../../context/actions/discoveryAction';
import DiscoveryRepo from '../../service/discovery';
import DiscoveryTab from './elements/DiscoveryTab';
import DomainFragment from "./fragment/DomainFragment";
import NewsFragment from "./fragment/NewsFragment";
import Search from './elements/Search';
import TopicFragment from "./fragment/TopicFragment";
import UsersFragment from './fragment/UsersFragment';
import { Context } from '../../context';
import { DISCOVERY_TAB_DOMAINS, DISCOVERY_TAB_NEWS, DISCOVERY_TAB_TOPICS, DISCOVERY_TAB_USERS } from '../../utils/constants';
import { colors } from '../../utils/colors';
import { fonts } from '../../utils/fonts';
import { withInteractionsManagedNoStatusBar } from '../../components/WithInteractionManaged';

// const { height } = Dimensions.get('screen');

const DiscoveryScreenV2 = ({ route }) => {
    const { tab } = route.params
    const [selectedScreen, setSelectedScreen] = React.useState(tab);
    const [isLoadingDiscovery, setIsLoadingDiscovery] = React.useState({
        user: false,
        topic: false,
        domain: false,
        news: false,
    });
    const [discoveryDataFollowedUsers, setDiscoveryDataFollowedUsers] = React.useState([]);
    const [discoveryDataUnfollowedUsers, setDiscoveryDataUnfollowedUsers] = React.useState([]);
    const [discoveryDataTopics, setDiscoveryDataTopics] = React.useState([]);
    const [discoveryDataDomains, setDiscoveryDataDomains] = React.useState([]);
    const [discoveryDataNews, setDiscoveryDataNews] = React.useState([]);
    const [searchText, setSearchText] = React.useState("");
    const [isFocus, setIsFocus] = React.useState(true);
    const [isFirstTimeOpen, setIsFirstTimeOpen] = React.useState(true);

    const [, discoveryDispatch] = React.useContext(Context).discovery

    const handleScroll = React.useCallback(() => {
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

    const fetchDiscoveryData = async (text) => {
        DiscoveryRepo.fetchDiscoveryDataUser(text).then(async (data) => {
            if (data.success) {
                setDiscoveryDataFollowedUsers(data?.followedUsers)
                setDiscoveryDataUnfollowedUsers(data?.unfollowedUsers)
            }
            setIsLoadingDiscovery((prevState) => ({
                ...prevState,
                user: false
            }))
        })

        DiscoveryRepo.fetchDiscoveryDataDomain(text).then(async (data) => {
            if (data.success) {
                setDiscoveryDataDomains(data)
            }

            setIsLoadingDiscovery((prevState) => ({
                ...prevState,
                domain: false
            }))
        })

        DiscoveryRepo.fetchDiscoveryDataTopic(text).then(async (data) => {
            if (data.success) {
                setDiscoveryDataTopics(data)
            }

            setIsLoadingDiscovery((prevState) => ({
                ...prevState,
                topic: false
            }))
        })

        DiscoveryRepo.fetchDiscoveryDataNews(text).then(async (data) => {
            if (data.success) {
                setDiscoveryDataNews(data)
            }

            setIsLoadingDiscovery((prevState) => ({
                ...prevState,
                news: false
            }))
        })
    }

    // React.useEffect(() => {
    //     if (discoverySearchBarText.length > 1) DiscoveryAction.setDiscoveryFirstTimeOpen(false, discoveryDispatch)
    // }, [discoverySearchBarText])

    const renderFragment = () => {
        if (selectedScreen === DISCOVERY_TAB_USERS)
            return <UsersFragment isLoadingDiscoveryUser={isLoadingDiscovery.user}
                hidden={selectedScreen !== DISCOVERY_TAB_USERS}
                isFirstTimeOpen={isFirstTimeOpen}
                setIsFirstTimeOpen={setIsFirstTimeOpen}
                followedUsers={discoveryDataFollowedUsers}
                unfollowedUsers={discoveryDataUnfollowedUsers}
                setFollowedUsers={setDiscoveryDataFollowedUsers}
                setUnfollowedUsers={setDiscoveryDataUnfollowedUsers}
                setSearchText={setSearchText}
                 />

        if (selectedScreen === DISCOVERY_TAB_TOPICS)
            return <TopicFragment isLoadingDiscoveryTopic={isLoadingDiscovery.topic}
                hidden={selectedScreen !== DISCOVERY_TAB_TOPICS}
                isFirstTimeOpen={isFirstTimeOpen}
                setIsFirstTimeOpen={setIsFirstTimeOpen} />

        if (selectedScreen === DISCOVERY_TAB_DOMAINS)
            return <DomainFragment isLoadingDiscoveryDomain={isLoadingDiscovery.domain}
                hidden={selectedScreen !== DISCOVERY_TAB_DOMAINS}
                isFirstTimeOpen={isFirstTimeOpen}
                setIsFirstTimeOpen={setIsFirstTimeOpen} />

        if (selectedScreen === DISCOVERY_TAB_NEWS)
            return <NewsFragment isLoadingDiscoveryNews={isLoadingDiscovery.news}
                hidden={selectedScreen !== DISCOVERY_TAB_NEWS}
                isFirstTimeOpen={isFirstTimeOpen}
                setIsFirstTimeOpen={setIsFirstTimeOpen} />

        return <></>
    }

    return <SafeAreaView style={{ flex: 1 }}>
        <StatusBar translucent={false} />
        <Search searchText={searchText}
            setSearchText={setSearchText}
            setDiscoveryLoadingData={setIsLoadingDiscovery}
            isFocus={isFocus}
            setIsFocus={setIsFocus}
            setIsFirstTimeOpen={setIsFirstTimeOpen}
            fetchDiscoveryData={fetchDiscoveryData} />
        <DiscoveryTab selectedScreen={selectedScreen} onChangeScreen={(index) => setSelectedScreen(index)} />
        <ScrollView
            style={styles.fragmentContainer}
            contentContainerStyle={styles.fragmentContentContainer}
            keyboardShouldPersistTaps='handled'
            onMomentumScrollBegin={handleScroll}>
            {renderFragment()}
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